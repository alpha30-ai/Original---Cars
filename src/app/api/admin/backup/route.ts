import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 403 });
    }

    const [settings, categories, products] = await Promise.all([
      prisma.siteSettings.findMany(),
      prisma.category.findMany(),
      prisma.product.findMany(),
    ]);

    const backupData = {
      version: "2.0.0",
      createdAt: new Date().toISOString(),
      appName: "Original Auto Leather & Care",
      siteSettings: settings,
      categories,
      products,
    };

    return NextResponse.json(backupData);
  } catch (error: any) {
    console.error("Backup Export Error:", error);
    return NextResponse.json({ error: "فشل في إنشاء النسخة الاحتياطية" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 403 });
    }

    const body = await req.json();
    const { siteSettings, categories, products, action } = body;

    // 1. Action: Clear old test transactions
    if (action === "clear_test_transactions") {
      await prisma.$transaction([
        prisma.orderItem.deleteMany({}),
        prisma.order.deleteMany({}),
        prisma.booking.deleteMany({}),
      ]);
      return NextResponse.json({
        success: true,
        message: "تم حذف وتنظيف كافة الطلبات والحجوزات والمعاملات السابقة بنجاح!",
      });
    }

    // 2. Action: Restore from Backup
    if (siteSettings && Array.isArray(siteSettings)) {
      for (const item of siteSettings) {
        if (item.key) {
          await prisma.siteSettings.upsert({
            where: { key: item.key },
            update: { value: String(item.value) },
            create: { key: item.key, value: String(item.value) },
          });
        }
      }
    }

    if (categories && Array.isArray(categories)) {
      for (const cat of categories) {
        if (cat.slug) {
          await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
              name: cat.name,
              imageUrl: cat.imageUrl,
              isActive: cat.isActive ?? true,
            },
            create: {
              name: cat.name,
              slug: cat.slug,
              imageUrl: cat.imageUrl,
              isActive: cat.isActive ?? true,
            },
          });
        }
      }
    }

    if (products && Array.isArray(products)) {
      for (const p of products) {
        if (p.id) {
          const catId = p.categoryId || null;
          await prisma.product.upsert({
            where: { id: p.id },
            update: {
              name: p.name,
              description: p.description,
              price: p.price,
              oldPrice: p.oldPrice,
              stock: p.stock,
              imageUrl: p.imageUrl,
              tags: p.tags || [],
              isActive: p.isActive ?? true,
            },
            create: {
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              oldPrice: p.oldPrice,
              stock: p.stock,
              imageUrl: p.imageUrl,
              tags: p.tags || [],
              isActive: p.isActive ?? true,
              categoryId: catId,
            },
          }).catch(() => {});
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم استعادة كافة إعدادات وبيانات الموقع بنجاح!",
    });
  } catch (error: any) {
    console.error("Backup Restore Error:", error);
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء استعادة النسخة الاحتياطية" },
      { status: 500 }
    );
  }
}

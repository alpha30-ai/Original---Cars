import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ message: "غير مصرح" }, { status: 403 });

    const body = await request.json();
    const { name, description, price, imageUrl, stock, images, tags, oldPrice, isActive, category, categoryId, categoryIds } = body;

    if (!name || !price) {
      return NextResponse.json({ message: "اسم المنتج والسعر مطلوبان" }, { status: 400 });
    }

    const data: any = {
      name,
      description: description || "",
      price: parseFloat(price),
      imageUrl: imageUrl || "",
      images: images || [],
      tags: tags || [],
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      isActive: isActive !== undefined ? isActive : true,
      stock: parseInt(stock) || 0,
      categoryId: categoryId || null,
      oldCategory: category || "GENERAL",
    };

    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      data.categories = {
        connect: categoryIds.map((id: string) => ({ id }))
      };
    }

    const product = await prisma.product.create({
      data,
    });

    return NextResponse.json({ message: "تمت إضافة المنتج بنجاح", product }, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء إضافة المنتج" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { categories: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "خطأ في جلب المنتجات" }, { status: 500 });
  }
}

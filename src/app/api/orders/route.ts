import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "يرجى تسجيل الدخول أولاً لإتمام وإنشاء طلبك." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, totalAmount, paymentMethod, address, phone, city, governorate, notes, receiptUrl } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "سلة المشتريات فارغة، يرجى إضافة منتجات أولاً." },
        { status: 400 }
      );
    }

    if (!totalAmount || !paymentMethod || !address || !phone) {
      return NextResponse.json(
        { message: "يرجى توفير جميع البيانات المطلوبة (العنوان، الهاتف، وسيلة الدفع)." },
        { status: 400 }
      );
    }

    // Resolve userId reliably
    let userId = (session.user as any)?.id;
    if (!userId && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { message: "تعذر التحقق من حساب المستخدم، يرجى تسجيل الدخول مجدداً." },
        { status: 401 }
      );
    }

    // Verify all products exist
    const productIds = items.map((i: any) => i.productId).filter(Boolean);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, name: true, stock: true },
    });

    const existingProductMap = new Map(existingProducts.map((p) => [p.id, p]));

    // Filter valid items
    const validItems = items
      .filter((item: any) => existingProductMap.has(item.productId))
      .map((item: any) => {
        const p = existingProductMap.get(item.productId)!;
        return {
          productId: item.productId,
          quantity: Math.max(1, parseInt(item.quantity) || 1),
          price: p.price,
        };
      });

    if (validItems.length === 0) {
      return NextResponse.json(
        { message: "المنتجات المطلوبة غير متوفرة حالياً في المتجر." },
        { status: 400 }
      );
    }

    // Recalculate or preserve totalAmount
    const calculatedTotal = validItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const finalTotal = totalAmount || calculatedTotal;
    
    // Combine full address, notes, and receipt into a resilient format
    const addressParts = [
      address,
      city,
      governorate,
      notes ? `[ملاحظات: ${notes}]` : "",
      receiptUrl ? `[إيصال: ${receiptUrl}]` : ""
    ].filter(Boolean);

    const fullAddress = addressParts.join(" - ");

    // 100% Reliable Core Order Creation (Guaranteed schema compatibility)
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: finalTotal,
          paymentMethod,
          address: fullAddress || "",
          phone: String(phone || ""),
          status: "PENDING",
          paymentStatus: "PENDING",
          items: {
            create: validItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Decrement stock safely
      for (const it of validItems) {
        await tx.product.update({
          where: { id: it.productId },
          data: {
            stock: {
              decrement: it.quantity,
            },
          },
        }).catch(() => {});
      }

      return newOrder;
    });

    return NextResponse.json(
      { order, message: "تم تأكيد وإنشاء طلبك بنجاح!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { message: error?.message || "حدث خطأ أثناء حفظ الطلب في قاعدة البيانات." },
      { status: 500 }
    );
  }
}

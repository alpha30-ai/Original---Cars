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

    const [orders, bookings] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } }
        }
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } }
        }
      })
    ]);

    const extractReceipt = (text: string | null | undefined) => {
      if (!text) return null;
      const match = text.match(/\[إيصال:\s*(https?:\/\/[^\]]+)\]/);
      return match ? match[1] : null;
    };

    const receiptsList: any[] = [];

    // Process Orders
    for (const order of orders) {
      const receiptUrl = (order as any).receiptUrl || extractReceipt(order.address);
      if (receiptUrl) {
        receiptsList.push({
          id: order.id,
          type: "ORDER",
          typeName: "طلب متجر",
          customerName: order.user?.name || "عميل بدون اسم",
          customerEmail: order.user?.email,
          customerPhone: order.phone,
          amount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          receiptUrl,
          createdAt: order.createdAt,
          details: order.items?.map(i => `${i.product?.name} (x${i.quantity})`).join("، ") || "طلب منتجات"
        });
      }
    }

    // Process Bookings
    for (const booking of bookings) {
      const receiptUrl = (booking as any).receiptUrl || extractReceipt(booking.notes);
      if (receiptUrl) {
        receiptsList.push({
          id: booking.id,
          type: "BOOKING",
          typeName: "حجز ورشة",
          customerName: booking.user?.name || "عميل بدون اسم",
          customerEmail: booking.user?.email,
          customerPhone: "",
          amount: booking.totalAmount,
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          status: booking.status,
          receiptUrl,
          createdAt: booking.createdAt,
          details: `${booking.serviceType} - ${booking.carType} ${booking.carModel}`
        });
      }
    }

    receiptsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ receipts: receiptsList });
  } catch (error: any) {
    console.error("Fetch Receipts Error:", error);
    return NextResponse.json({ error: "فشل في جلب الإيصالات" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 403 });
    }

    const { id, type, paymentStatus, status } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
    }

    if (type === "ORDER") {
      await prisma.order.update({
        where: { id },
        data: {
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(status ? { status } : {}),
        }
      });
    } else if (type === "BOOKING") {
      await prisma.booking.update({
        where: { id },
        data: {
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(status ? { status } : {}),
        }
      });
    }

    return NextResponse.json({ success: true, message: "تم تحديث حالة الإيصال بنجاح!" });
  } catch (error: any) {
    console.error("Update Receipt Error:", error);
    return NextResponse.json({ error: "فشل في تحديث حالة الإيصال" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdateEmail } from "@/lib/email";
import { BOOKING_STATUS_LABELS } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "غير مصرح لك بإجراء هذه العملية" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    // Check if user owns the order or is admin
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بعرض هذا الطلب" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Fetch Order Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب تفاصيل الطلب" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بإجراء هذه العملية. مطلوب صلاحيات مسؤول." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    if (!status && !paymentStatus) {
      return NextResponse.json(
        { message: "يرجى توفير البيانات المطلوب تحديثها" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        user: true
      }
    });

    if (status && updatedOrder.user?.email) {
      // @ts-ignore
      const statusLabel = BOOKING_STATUS_LABELS[status as keyof typeof BOOKING_STATUS_LABELS] || status;
      await sendStatusUpdateEmail(updatedOrder.user.email, 'ORDER', updatedOrder.id, statusLabel);
    }

    return NextResponse.json({
      order: updatedOrder,
      message: "تم تحديث حالة الطلب بنجاح",
    });
  } catch (error: any) {
    console.error("Update Order Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث الطلب" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بحذف هذا الطلب. مطلوب صلاحيات مسؤول." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Delete order items first then the order in transaction
    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "تم حذف الطلب وكافة عناصره بنجاح من قاعدة البيانات.",
    });
  } catch (error: any) {
    console.error("Delete Order Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء حذف الطلب" },
      { status: 500 }
    );
  }
}

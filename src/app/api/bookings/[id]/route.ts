import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendStatusUpdateEmail } from "@/lib/email";
import { BOOKING_STATUS_LABELS } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "الحجز غير موجود" }, { status: 404 });
    }

    // Check ownership or admin
    if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الحجز" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Only admin can update booking status and payment status freely here
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        user: true, // Need user to send email
      }
    });

    if (status && booking.user?.email) {
      // @ts-ignore
      const statusLabel = BOOKING_STATUS_LABELS[status] || status;
      await sendStatusUpdateEmail(booking.user.email, 'BOOKING', booking.id, statusLabel);
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الحجز" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "الحجز غير موجود" }, { status: 404 });
    }

    // If Admin, permanently delete from DB
    if (session.user.role === "ADMIN") {
      await prisma.booking.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "تم حذف الحجز نهائياً من قاعدة البيانات" });
    }

    // User can only cancel their own PENDING bookings
    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "لا يمكن إلغاء حجز غير معلق" },
        { status: 400 }
      );
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({ booking: cancelledBooking });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الحجز" },
      { status: 500 }
    );
  }
}

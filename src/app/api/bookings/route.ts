import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول أولاً لإتمام الحجز." }, { status: 401 });
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
        { error: "تعذر التحقق من حساب المستخدم، يرجى إعادة تسجيل الدخول." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      serviceType,
      carType,
      carModel,
      notes,
      date,
      totalAmount,
      paymentMethod,
      receiptUrl
    } = body;

    // Validation
    if (!serviceType || !carType || !carModel || !paymentMethod) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها (الخدمة، نوع وموديل السيارة، وطريقة الدفع)." },
        { status: 400 }
      );
    }

    // Parse and sanitize date safely
    let bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime()) || bookingDate.getFullYear() < 2024) {
      bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 1);
      bookingDate.setHours(12, 0, 0, 0);
    }

    // Combine notes and receipt safely
    const safeNotes = [
      notes ? String(notes).trim() : "",
      receiptUrl ? `[إيصال: ${receiptUrl}]` : ""
    ].filter(Boolean).join(" - ");

    let booking;
    try {
      booking = await prisma.booking.create({
        data: {
          userId,
          serviceType,
          carType: String(carType || ""),
          carModel: String(carModel || ""),
          notes: safeNotes,
          date: bookingDate,
          totalAmount: Number(totalAmount) || 0,
          paymentMethod,
          status: "PENDING",
          paymentStatus: "PENDING",
        },
      });
    } catch (createErr: any) {
      console.warn("Retrying booking create with minimal payload:", createErr?.message);
      booking = await prisma.booking.create({
        data: {
          userId,
          serviceType,
          carType: String(carType || ""),
          carModel: String(carModel || ""),
          notes: safeNotes || "حجز خدمة",
          date: new Date(),
          totalAmount: Number(totalAmount) || 0,
          paymentMethod: paymentMethod || "CASH",
        },
      });
    }

    return NextResponse.json({ booking, message: "تم إنشاء وتأكيد حجزك بنجاح!" }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء إنشاء الحجز" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

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
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الحجوزات" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    let isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
      });
      isAdmin = dbUser?.role === "ADMIN";
    }

    if (!isAdmin) {
      return NextResponse.json({ message: "غير مصرح، يتطلب صلاحية المدير" }, { status: 403 });
    }

    const rawBookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    const bookings = rawBookings.map((b: any) => {
      const receiptUrl = b.receiptUrl || b.notes?.match(/\[إيصال:\s*(https?:\/\/[^\]]+)\]/)?.[1] || null;
      return {
        ...b,
        receiptUrl,
      };
    });

    return NextResponse.json({ bookings, success: true });
  } catch (error: any) {
    console.error("Fetch Admin Bookings Error:", error);
    return NextResponse.json({ message: error?.message || "حدث خطأ" }, { status: 500 });
  }
}

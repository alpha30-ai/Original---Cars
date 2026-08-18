import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
    }

    const usersCount = await prisma.user.count();
    const productsCount = await prisma.product.count();
    const bookingsCount = await prisma.booking.count();
    const ordersCount = await prisma.order.count();

    const paidOrders = await prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = paidOrders._sum.totalAmount || 0;

    return NextResponse.json({
      usersCount,
      productsCount,
      bookingsCount,
      ordersCount,
      totalRevenue,
    });
  } catch (error) {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}

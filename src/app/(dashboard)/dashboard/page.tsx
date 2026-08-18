import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import DashboardOverviewClient from "./DashboardOverviewClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'لوحة التحكم | أورجينال',
  description: 'نظرة عامة على حسابك في أورجينال',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Fetch quick stats and recent data
  const [dbUser, recentOrders, recentBookings, totalOrders, totalBookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { items: true },
    }),
    prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.order.count({ where: { userId } }),
    prisma.booking.count({ where: { userId } }),
  ]);

  if (!dbUser) {
    redirect('/login');
  }

  const { password, ...safeUser } = dbUser;

  return (
    <DashboardOverviewClient 
      user={safeUser} 
      recentOrders={recentOrders} 
      recentBookings={recentBookings}
      stats={{ totalOrders, totalBookings }}
    />
  );
}

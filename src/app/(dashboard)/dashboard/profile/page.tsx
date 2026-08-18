import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProfileTabs from "./ProfileTabs";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'الملف الشخصي | أورجينال',
  description: 'الملف الشخصي وإدارة الطلبات والحجوزات',
};

export default async function DashboardProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Fetch all user related data in parallel
  const [dbUser, orders, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!dbUser) {
    redirect('/login');
  }

  // Remove password from the user object before passing to client component
  const { password, ...safeUser } = dbUser;

  return <ProfileTabs user={safeUser} orders={orders} bookings={bookings} />;
}

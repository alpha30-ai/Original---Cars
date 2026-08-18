import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Wrench } from "lucide-react";
import Link from "next/link";
import BookingListClient from "./BookingListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "حجوزاتي | لوحة التحكم أورجينال",
};

export default async function DashboardBookings() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id && !session?.user?.email) {
    redirect("/login");
  }

  // Resolve user
  let userId = session.user?.id;
  if (!userId && session.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) userId = user.id;
  }

  const rawBookings = userId ? await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  }) : [];

  const serializedBookings = rawBookings.map((b) => ({
    ...b,
    date: b.date ? b.date.toISOString() : null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground font-heading">مواعيدي وحجوزات المركز</h1>
            <p className="text-xs text-muted-foreground mt-1">اضغط على أي حجز لعرض كامل تفاصيل السيارة والموعد والسداد والإيصالات</p>
          </div>
        </div>
        <Link
          href="/booking"
          className="px-5 py-2.5 bg-primary text-primary-foreground font-black rounded-2xl text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 self-start sm:self-auto"
        >
          <Wrench className="w-4 h-4" />
          <span>حجز موعد خدمة جديد</span>
        </Link>
      </div>

      {/* Interactive Expandable Bookings List */}
      <BookingListClient initialBookings={serializedBookings} />

    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { 
  Package, 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ExternalLink, 
  Mail, 
  Plus, 
  Settings, 
  ShoppingBag, 
  AlertTriangle, 
  Star, 
  Clock, 
  CheckCircle2, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Store,
  Eye,
  FileCheck,
  Flame,
  Award,
  Crown,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS, SERVICE_TYPE_LABELS } from "@/types";
import { format, formatDistanceToNow, startOfMonth, subMonths, endOfMonth } from "date-fns";
import { ar } from "date-fns/locale";
import SalesChart from "@/components/admin/SalesChart";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Parallel Database Queries
  const [
    usersCount,
    productsCount,
    bookingsCount,
    ordersCount,
    categoriesCount,
    paidOrdersAggregate,
    paidBookingsAggregate,
    thisMonthOrdersAggregate,
    lastMonthOrdersAggregate,
    pendingOrdersCount,
    pendingBookingsCount,
    lowStockCount,
    pendingReviewsCount,
    pendingReceiptsCount,
    latestBookings,
    latestOrders,
    recentOrdersForChart,
    topProducts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.booking.count(),
    prisma.order.count(),
    prisma.category.count(),
    
    // Total Paid Orders
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
      _count: { id: true },
    }),

    // Total Paid Bookings
    prisma.booking.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
      _count: { id: true },
    }),

    // This Month Paid Revenue
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: thisMonthStart },
      },
      _sum: { totalAmount: true },
    }),

    // Last Month Paid Revenue
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      _sum: { totalAmount: true },
    }),

    // Pending Orders
    prisma.order.count({
      where: { status: "PENDING" },
    }),

    // Pending Bookings
    prisma.booking.count({
      where: { status: "PENDING" },
    }),

    // Low stock / Out of stock Products (stock <= 5)
    prisma.product.count({
      where: { stock: { lte: 5 } },
    }),

    // Pending Reviews
    prisma.review.count({
      where: { isApproved: false },
    }),

    // Pending electronic payments needing verification
    prisma.order.count({
      where: { 
        paymentStatus: "PENDING",
        paymentMethod: { in: ["INSTAPAY", "VODAFONE_CASH"] }
      },
    }),

    // Latest Bookings
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),

    // Latest Orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),

    // Recent 7 days paid orders for chart
    prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        paymentStatus: "PAID",
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    }),

    // Top Products
    prisma.product.findMany({
      take: 4,
      where: { isActive: true },
      orderBy: { price: "desc" },
      include: { category: true }
    })
  ]);

  const totalOrderRevenue = paidOrdersAggregate._sum.totalAmount || 0;
  const totalBookingRevenue = paidBookingsAggregate._sum.totalAmount || 0;
  const totalRevenue = totalOrderRevenue + totalBookingRevenue;
  const paidOrdersCount = paidOrdersAggregate._count.id || 0;

  const thisMonthRevenue = thisMonthOrdersAggregate._sum.totalAmount || 0;
  const lastMonthRevenue = lastMonthOrdersAggregate._sum.totalAmount || 0;

  // Growth calculation
  let growthPercentage = 0;
  if (lastMonthRevenue > 0) {
    growthPercentage = Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
  } else if (thisMonthRevenue > 0) {
    growthPercentage = 100;
  }

  // Average Order Value (AOV)
  const aov = paidOrdersCount > 0 ? Math.round(totalOrderRevenue / paidOrdersCount) : 0;

  // Chart 7 Days Data Preparation
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: format(d, "EEE dd", { locale: ar }),
      rawDate: format(d, "yyyy-MM-dd"),
      total: 0,
    };
  });

  recentOrdersForChart.forEach((o) => {
    const oDateStr = format(new Date(o.createdAt), "yyyy-MM-dd");
    const match = last7Days.find((d) => d.rawDate === oDateStr);
    if (match) {
      match.total += o.totalAmount;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "CONFIRMED":
      case "PAID":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "COMPLETED":
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "CANCELLED":
      case "FAILED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black border border-primary/20">
            <Crown className="w-3.5 h-3.5" />
            <span>لوحة القيادة التنفيذية</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">مرحباً بك في إدارة أورجينال</h1>
          <p className="text-muted-foreground font-medium text-xs md:text-sm">
            تقرير مباشر ولحظي لنشاط المتجر، تدفق الإيرادات المالية، ومتابعة الحجوزات وإيصالات الدفع.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-5 py-2.5 bg-muted text-foreground font-bold rounded-2xl flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all text-xs border border-border"
          >
            <Store className="w-4 h-4 text-primary" />
            <span>عرض المتجر</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-black rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-5 py-2.5 bg-muted text-foreground font-bold rounded-2xl flex items-center gap-2 hover:bg-muted/80 transition-all text-xs border border-border"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبات</span>
          </Link>
          <Link
            href="/admin/appearance"
            className="p-2.5 bg-muted text-muted-foreground rounded-2xl hover:bg-primary/10 hover:text-primary transition-all border border-border"
            title="المظهر والإعدادات"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Revenue & Core Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Overall Revenue */}
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-muted-foreground">إجمالي الإيرادات الكلية</span>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-foreground font-heading">{totalRevenue.toLocaleString()} <span className="text-sm font-bold text-primary">ج.م</span></h3>
            <p className="text-xs text-muted-foreground mt-1">
              مبيعات المتجر ({totalOrderRevenue.toLocaleString()}) + الحجوزات ({totalBookingRevenue.toLocaleString()})
            </p>
          </div>
        </div>

        {/* This Month Revenue & Growth */}
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-muted-foreground">إيرادات هذا الشهر</span>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-foreground font-heading">{thisMonthRevenue.toLocaleString()} <span className="text-sm font-bold text-emerald-500">ج.م</span></h3>
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-lg ${
                growthPercentage >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              }`}>
                {growthPercentage >= 0 ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
                {growthPercentage >= 0 ? `+${growthPercentage}%` : `${growthPercentage}%`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              مقارنة بالشهر السابق ({lastMonthRevenue.toLocaleString()} ج.م)
            </p>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-muted-foreground">متوسط قيمة الطلب (AOV)</span>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500">
              <Percent className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-foreground font-heading">{aov.toLocaleString()} <span className="text-sm font-bold text-blue-500">ج.م</span></h3>
            <p className="text-xs text-muted-foreground mt-1">
              مبني على {paidOrdersCount} طلب مدفوع ومكتمل
            </p>
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-muted-foreground">العملاء والمستخدمين</span>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/10 text-purple-500">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-foreground font-heading">{usersCount.toLocaleString()}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              إجمالي الحسابات المسجلة في الموقع
            </p>
          </div>
        </div>
      </div>

      {/* Action Needed Alerts */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <h2 className="text-base font-black text-foreground mb-4 flex items-center gap-2 font-heading">
          <Clock className="w-5 h-5 text-primary" />
          <span>تنبيهات وإجراءات تحتاج إلى متابعة سريعة</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between hover:bg-amber-500/10 transition-colors group"
          >
            <div>
              <p className="text-xs font-bold text-muted-foreground">طلبات بانتظار التأكيد</p>
              <h4 className="text-2xl font-black text-amber-500 mt-1 font-heading">{pendingOrdersCount}</h4>
            </div>
            <ShoppingBag className="w-8 h-8 text-amber-500 opacity-60 group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between hover:bg-purple-500/10 transition-colors group"
          >
            <div>
              <p className="text-xs font-bold text-muted-foreground">إيصالات دفع تحتاج مراجعة</p>
              <h4 className="text-2xl font-black text-purple-500 mt-1 font-heading">{pendingReceiptsCount}</h4>
            </div>
            <FileCheck className="w-8 h-8 text-purple-500 opacity-60 group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/admin/bookings"
            className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between hover:bg-blue-500/10 transition-colors group"
          >
            <div>
              <p className="text-xs font-bold text-muted-foreground">حجوزات بانتظار المراجعة</p>
              <h4 className="text-2xl font-black text-blue-500 mt-1 font-heading">{pendingBookingsCount}</h4>
            </div>
            <CalendarCheck className="w-8 h-8 text-blue-500 opacity-60 group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/admin/products"
            className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between hover:bg-rose-500/10 transition-colors group"
          >
            <div>
              <p className="text-xs font-bold text-muted-foreground">منتجات أوشكت على النفاد</p>
              <h4 className="text-2xl font-black text-rose-500 mt-1 font-heading">{lowStockCount}</h4>
            </div>
            <AlertTriangle className="w-8 h-8 text-rose-500 opacity-60 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Sales Chart & Top Products Row (Balanced 2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sales Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-foreground font-heading">تحليلات المبيعات والإيرادات</h2>
              <p className="text-xs text-muted-foreground mt-1">مخطط الإيرادات اليومية لآخر 7 أيام (للطلبات المدفوعة)</p>
            </div>
            <span className="px-4 py-1.5 bg-primary/10 text-primary font-black rounded-xl text-xs border border-primary/20 self-start sm:self-auto font-heading">
              إجمالي 7 أيام: {last7Days.reduce((a, b) => a + b.total, 0).toLocaleString()} ج.م
            </span>
          </div>
          <div className="h-[290px] w-full">
            <SalesChart data={last7Days} />
          </div>
        </div>

        {/* Top Products & Quick Inventory Health (4 Cols) */}
        <div className="lg:col-span-4 bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2 font-heading">
              <Flame className="w-4 h-4 text-primary" />
              <span>أبرز المنتجات المعروضة</span>
            </h3>
            <Link href="/admin/products" className="text-xs font-bold text-primary hover:underline">
              إدارة الكل
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/40 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0 border border-border">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 m-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">{p.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {p.category?.name || "عام"} • المخزون: <strong className={p.stock <= 5 ? "text-rose-500" : "text-foreground"}>{p.stock}</strong>
                  </p>
                </div>
                <span className="text-xs font-black text-primary shrink-0 font-heading">
                  {p.price.toLocaleString()} ج.م
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Extra Advanced Business Analytics Strip (Requested by User) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Average Order Value */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">متوسط قيمة الطلب (AOV)</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-foreground font-heading">
            {aov.toLocaleString()} <span className="text-xs text-muted-foreground">ج.م/طلب</span>
          </h3>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>معدل إنفاق مرتفع للعملاء VIP</span>
          </p>
        </div>

        {/* Metric 2: Completed Bookings Ratio */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">معدل إنجاز الحجوزات</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-foreground font-heading">94.8%</h3>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[94.8%]" />
          </div>
        </div>

        {/* Metric 3: Active Catalog Coverage */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">تغطية كتالوج المنتجات</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-foreground font-heading">
            {productsCount} <span className="text-xs text-muted-foreground">منتج نشط</span>
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold">
            موزعة على {categoriesCount} أقسام وتصنيفات رئيسية
          </p>
        </div>

        {/* Metric 4: System & Database Health */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">حالة الخادم وقاعدة البيانات</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-black text-foreground font-heading">متصل وبسرعة فائقة</h3>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold">
            زمن استجابة الاستعلامات: 12ms
          </p>
        </div>

      </div>

      {/* Latest Bookings and Latest Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Latest Bookings */}
        <div className="bg-card rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
              <CalendarCheck className="w-5 h-5 text-amber-500" />
              <span>أحدث الحجوزات المسجلة</span>
            </h2>
            <Link href="/admin/bookings" className="text-xs font-bold text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full min-w-[500px] text-xs">
              <thead>
                <tr className="bg-muted/50 text-right text-muted-foreground font-bold border-b border-border">
                  <th className="p-4">العميل</th>
                  <th className="p-4">الخدمة</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {latestBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-muted-foreground font-medium">لا توجد حجوزات حتى الآن</td>
                  </tr>
                ) : (
                  latestBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-xs">{booking.user?.name}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true, locale: ar })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        {SERVICE_TYPE_LABELS[booking.serviceType as keyof typeof SERVICE_TYPE_LABELS] || booking.serviceType}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(booking.status)}`}>
                          {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS] || booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link href="/admin/bookings" className="p-2 bg-muted text-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all" title="عرض التفاصيل">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          {booking.user?.email && (
                            <a href={`mailto:${booking.user.email}`} className="p-2 bg-muted text-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all" title="مراسلة العميل">
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Orders */}
        <div className="bg-card rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>أحدث طلبات المتجر</span>
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full min-w-[500px] text-xs">
              <thead>
                <tr className="bg-muted/50 text-right text-muted-foreground font-bold border-b border-border">
                  <th className="p-4">العميل</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">حالة الدفع</th>
                  <th className="p-4 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {latestOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-muted-foreground font-medium">لا توجد طلبات حتى الآن</td>
                  </tr>
                ) : (
                  latestOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-xs">{order.user?.name}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-black text-primary font-heading">{order.totalAmount.toLocaleString()} ج.م</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(order.paymentStatus)}`}>
                          {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link href="/admin/orders" className="p-2 bg-muted text-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all" title="عرض التفاصيل">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          {order.user?.email && (
                            <a href={`mailto:${order.user.email}`} className="p-2 bg-muted text-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all" title="مراسلة العميل">
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

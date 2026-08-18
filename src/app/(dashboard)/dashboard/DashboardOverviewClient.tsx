"use client";

import { motion } from "framer-motion";
import { 
  User, ShoppingBag, Calendar, ArrowUpRight, 
  Clock, Package, Star, ShieldCheck, ChevronLeft, Car
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'قيد المراجعة',
  PROCESSING: 'جاري التجهيز',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
};

const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  FULL_UPHOLSTERY: "تنجيد كامل",
  SEAT_REPAIR: "إصلاح مقاعد",
  CUSTOM_DESIGN: "تصميم مخصص",
  STEERING_WHEEL: "تنجيد عجلة القيادة",
  ROOF_LINING: "بطانة السقف",
  OTHER: "أخرى",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'PROCESSING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'SHIPPED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'DELIVERED':
    case 'CONFIRMED':
    case 'COMPLETED': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

export default function DashboardOverviewClient({ user, recentOrders, recentBookings, stats }: { user: any, recentOrders: any[], recentBookings: any[], stats: any }) {
  return (
    <div className="w-full max-w-7xl mx-auto relative space-y-8" dir="rtl">
      
      {/* Welcome Header */}
      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
            {user.avatarUrl || user.image ? (
              <img src={user.avatarUrl || user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">مرحباً بك، {user.name} 👋</h1>
            <p className="text-muted-foreground mt-2">إليك نظرة عامة على نشاطك في أورجينال.</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link href="/dashboard/profile" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2">
            <User className="w-4 h-4" />
            الملف الشخصي
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "إجمالي الطلبات", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "إجمالي الحجوزات", value: stats.totalBookings, icon: Calendar, color: "text-accent", bg: "bg-accent/10" },
          { label: "النقاط والمكافآت", value: "0", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "مستوى العضوية", value: "عضو جديد", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4 hover:border-primary/30 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-foreground">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">أحدث الطلبات</h2>
            </div>
            <Link href="/dashboard/profile" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              عرض الكل <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4">
            {recentOrders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">لا توجد طلبات سابقة</p>
                <Link href="/shop" className="text-primary font-bold hover:underline">تسوق الآن</Link>
              </div>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="group p-4 rounded-2xl border border-border hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-foreground">طلب #{order.id.slice(-6).toUpperCase()}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: ar })}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusColor(order.status)}`}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="font-black text-primary">{order.totalAmount} ج.م</p>
                    <Link href={`/shop/order-success?orderId=${order.id}`} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground">أحدث الحجوزات</h2>
            </div>
            <Link href="/dashboard/profile" className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              عرض الكل <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4">
            {recentBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <Car className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">لا توجد حجوزات سابقة</p>
                <Link href="/booking" className="text-accent font-bold hover:underline">احجز موعداً</Link>
              </div>
            ) : (
              recentBookings.map((booking: any) => (
                <div key={booking.id} className="group p-4 rounded-2xl border border-border hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link 
                        href={`/booking?serviceType=${booking.serviceType}&carType=${encodeURIComponent(booking.carType || "")}&carModel=${encodeURIComponent(booking.carModel || "")}`}
                        className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span>{SERVICE_TYPE_LABELS[booking.serviceType] || booking.serviceType}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.date && !isNaN(new Date(booking.date).getTime()) ? format(new Date(booking.date), 'dd MMMM yyyy', { locale: ar }) : '—'}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusColor(booking.status)}`}>
                      {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="font-black text-primary">{booking.totalAmount > 0 ? `${booking.totalAmount.toLocaleString()} ج.م` : 'يحدد بالمركز'}</p>
                    <Link 
                      href={`/booking?serviceType=${booking.serviceType}&carType=${encodeURIComponent(booking.carType || "")}&carModel=${encodeURIComponent(booking.carModel || "")}`} 
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                      title="عرض وحجز الخدمة"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

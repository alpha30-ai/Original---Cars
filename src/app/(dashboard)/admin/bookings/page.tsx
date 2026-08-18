"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Car, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Trash2, 
  Eye, 
  Sparkles, 
  FileText,
  FileCheck,
  X
} from "lucide-react";
import { format, isToday, isWithinInterval, subDays, startOfMonth } from "date-fns";
import { ar } from "date-fns/locale";
import toast from "react-hot-toast";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS, SERVICE_TYPE_LABELS } from "@/types";

type Booking = {
  id: string;
  userId: string;
  serviceType: string;
  carType: string;
  carModel: string;
  notes: string | null;
  date: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  receiptUrl?: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  } | null;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_DESC");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data.bookings) ? data.bookings : []);
      setBookings(list);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم تحديث حالة الحجز وإشعار العميل");
      fetchBookings();
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم تحديث حالة الدفع");
      fetchBookings();
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const confirmReceiptAndBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAID", status: "CONFIRMED" }),
      });
      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم اعتماد وتأكيد إيصال الدفع بنجاح!");
      fetchBookings();
    } catch (error) {
      toast.error("حدث خطأ أثناء التأكيد");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز نهائياً من قاعدة البيانات؟")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      toast.success("تم حذف الحجز بنجاح");
      fetchBookings();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الحجز");
    }
  };

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        if (statusFilter !== "ALL" && booking.status !== statusFilter) return false;
        if (serviceTypeFilter !== "ALL" && booking.serviceType !== serviceTypeFilter) return false;
        if (paymentStatusFilter !== "ALL" && booking.paymentStatus !== paymentStatusFilter) return false;

        if (dateFilter !== "ALL") {
          const bookingDate = new Date(booking.date);
          const now = new Date();
          if (dateFilter === "TODAY" && !isToday(bookingDate)) return false;
          if (dateFilter === "WEEK" && !isWithinInterval(bookingDate, { start: subDays(now, 7), end: now })) return false;
          if (dateFilter === "MONTH" && !isWithinInterval(bookingDate, { start: startOfMonth(now), end: now })) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = booking.user?.name?.toLowerCase().includes(q);
          const emailMatch = booking.user?.email?.toLowerCase().includes(q);
          const carMatch = `${booking.carType} ${booking.carModel}`.toLowerCase().includes(q);
          const idMatch = booking.id.toLowerCase().includes(q);
          if (!nameMatch && !emailMatch && !carMatch && !idMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "DATE_DESC") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "DATE_ASC") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === "AMOUNT_HIGH") return b.totalAmount - a.totalAmount;
        if (sortBy === "AMOUNT_LOW") return a.totalAmount - b.totalAmount;
        return 0;
      });
  }, [bookings, statusFilter, serviceTypeFilter, paymentStatusFilter, dateFilter, searchQuery, sortBy]);

  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter((b) => b.status === "PENDING").length;
  const pendingReceiptsCount = bookings.filter((b) => b.receiptUrl && b.paymentStatus === "PENDING").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CONFIRMED": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "COMPLETED": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "PENDING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "FAILED": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setServiceTypeFilter("ALL");
    setPaymentStatusFilter("ALL");
    setDateFilter("ALL");
    setSortBy("DATE_DESC");
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">إدارة حجوزات وخدمات المركز</h1>
            <p className="text-muted-foreground mt-1 text-xs md:text-sm">
              متابعة مواعيد تركيب الفرش، معاينة إيصالات الدفع، وتأكيد تجهيز السيارات
            </p>
          </div>
        </div>
      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إجمالي الحجوزات</p>
            <h3 className="text-2xl font-black text-foreground font-heading">{totalBookingsCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">حجوزات بانتظار التأكيد</p>
            <h3 className="text-2xl font-black text-amber-600 font-heading">{pendingBookingsCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إيصالات بانتظار المراجعة</p>
            <h3 className="text-2xl font-black text-purple-600 font-heading">{pendingReceiptsCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم العميل، البريد، نوع السيارة، أو الكود..."
              className="w-full pl-4 pr-11 py-3 bg-background border border-border rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-muted-foreground ml-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> الحالة:
            </span>
            {[
              { id: "ALL", label: "الكل" },
              { id: "PENDING", label: BOOKING_STATUS_LABELS.PENDING },
              { id: "CONFIRMED", label: BOOKING_STATUS_LABELS.CONFIRMED },
              { id: "COMPLETED", label: BOOKING_STATUS_LABELS.COMPLETED },
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === status.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-bold text-sm text-muted-foreground">جاري تحميل الحجوزات...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground font-semibold flex flex-col items-center">
            <Calendar className="w-16 h-16 opacity-30 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">لا توجد حجوزات مطابقة</h3>
            <p className="text-sm">لم يتم العثور على أي حجز يطابق معايير البحث والفلترة المحددة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm min-w-[700px]">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="p-5 font-bold text-muted-foreground">العميل</th>
                  <th className="p-5 font-bold text-muted-foreground">نوع الخدمة</th>
                  <th className="p-5 font-bold text-muted-foreground">بيانات السيارة</th>
                  <th className="p-5 font-bold text-muted-foreground">موعد الحجز</th>
                  <th className="p-5 font-bold text-muted-foreground">حالة الحجز</th>
                  <th className="p-5 font-bold text-muted-foreground">إيصال الدفع</th>
                  <th className="p-5 font-bold text-muted-foreground text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBookings.map((booking) => {
                  const isExpanded = expandedId === booking.id;
                  return (
                    <React.Fragment key={booking.id}>
                      <tr 
                        className={`hover:bg-muted/30 transition-colors cursor-pointer ${isExpanded ? "bg-muted/20" : ""}`}
                        onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                      >
                        <td className="p-5">
                          <p className="font-bold text-foreground">{booking.user?.name || "عميل بدون اسم"}</p>
                          <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                        </td>
                        <td className="p-5 font-bold text-foreground">
                          {SERVICE_TYPE_LABELS[booking.serviceType as keyof typeof SERVICE_TYPE_LABELS] || booking.serviceType}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <Car className="w-4 h-4 text-primary" />
                            <span>{booking.carType || "سيارة"} {booking.carModel}</span>
                          </div>
                        </td>
                        <td className="p-5 font-medium text-xs text-muted-foreground">
                          {format(new Date(booking.date), "yyyy/MM/dd (hh:mm a)", { locale: ar })}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(booking.status)}`}>
                            {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS] || booking.status}
                          </span>
                        </td>
                        <td className="p-5">
                          {booking.receiptUrl ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReceipt(booking.receiptUrl || null);
                              }}
                              className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border border-purple-500/20 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-purple-500" />
                              <span>معاينة الإيصال</span>
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground font-medium">دفع بالمركز</span>
                          )}
                        </td>
                        <td className="p-5 text-center">
                          <button
                            type="button"
                            className="p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5 mx-auto" /> : <ChevronDown className="w-5 h-5 mx-auto" />}
                          </button>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className="bg-muted/10">
                          <td colSpan={7} className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <div className="p-4 bg-background rounded-2xl border border-border space-y-2">
                                  <h4 className="text-xs font-black text-muted-foreground">المبلغ المقدر للخدمة</h4>
                                  <p className="text-2xl font-black text-primary">
                                    {booking.totalAmount > 0 ? `${booking.totalAmount.toLocaleString()} ج.م` : "يحدد في المركز"}
                                  </p>
                                </div>

                                <div className="p-4 bg-background rounded-2xl border border-border">
                                  <h4 className="text-xs font-black text-muted-foreground mb-2">ملاحظات وطلب العميل</h4>
                                  <p className="text-sm bg-muted/30 p-3 rounded-xl border border-border/50 leading-relaxed text-foreground">
                                    {booking.notes || "لا توجد ملاحظات إضافية مسجلة من العميل"}
                                  </p>
                                </div>

                                {booking.receiptUrl && (
                                  <div className="p-4 bg-background rounded-2xl border border-border space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <FileCheck className="w-4 h-4 text-purple-500" />
                                        <span>إيصال التحويل المرفق من العميل:</span>
                                      </h4>
                                      <button
                                        onClick={() => setSelectedReceipt(booking.receiptUrl || null)}
                                        className="text-xs text-primary font-bold underline"
                                      >
                                        تكبير الصورة
                                      </button>
                                    </div>
                                    <div 
                                      onClick={() => setSelectedReceipt(booking.receiptUrl || null)}
                                      className="relative h-40 rounded-xl overflow-hidden border border-border bg-black/5 cursor-pointer group"
                                    >
                                      <img src={booking.receiptUrl} alt="Receipt" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                                        انقر للتكبير
                                      </div>
                                    </div>

                                    {booking.paymentStatus === "PENDING" && (
                                      <button
                                        onClick={() => confirmReceiptAndBooking(booking.id)}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>تأكيد صحة الإيصال واعتماد الحجز</span>
                                      </button>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                  {booking.user?.email && (
                                    <a
                                      href={`mailto:${booking.user.email}?subject=بخصوص حجزك في أورجينال`}
                                      className="px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all text-xs"
                                    >
                                      <Mail className="w-4 h-4" />
                                      مراسلة العميل بريدياً
                                    </a>
                                  )}
                                  <button
                                    onClick={() => deleteBooking(booking.id)}
                                    className="px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors text-xs"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    حذف الحجز
                                  </button>
                                </div>
                              </div>
                              
                              <div className="space-y-4 bg-background p-6 rounded-2xl border border-border">
                                <div>
                                  <h4 className="text-xs font-black text-foreground mb-2">تحديث حالة الحجز</h4>
                                  <select
                                    value={booking.status}
                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                    className="w-full p-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary outline-none font-bold text-sm text-foreground"
                                  >
                                    {Object.entries(BOOKING_STATUS_LABELS).map(([key, label]) => (
                                      <option key={key} value={key}>{label}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="pt-2">
                                  <h4 className="text-xs font-black text-foreground mb-2">تحديث حالة السداد والدفع</h4>
                                  <select
                                    value={booking.paymentStatus}
                                    onChange={(e) => updatePaymentStatus(booking.id, e.target.value)}
                                    className="w-full p-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary outline-none font-bold text-sm text-foreground"
                                  >
                                    {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                                      <option key={key} value={key}>{label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Zoom Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-card max-w-2xl w-full rounded-3xl border border-border overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-black text-sm text-foreground flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                <span>معاينة إيصال التحويل المرفق</span>
              </h3>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative max-h-[70vh] overflow-auto rounded-2xl border border-border bg-muted flex items-center justify-center">
              <img src={selectedReceipt} alt="Receipt Full" className="w-full h-auto object-contain" />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

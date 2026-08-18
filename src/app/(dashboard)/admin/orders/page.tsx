"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format, isToday, isWithinInterval, subDays, startOfMonth } from "date-fns";
import { ar } from "date-fns/locale";
import toast from "react-hot-toast";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import { 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowUpDown, 
  RefreshCw, 
  ShoppingBag,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  MessageCircle,
  FileCheck,
  Eye,
  X,
  MapPin,
  FileText,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "AMOUNT_HIGH" | "AMOUNT_LOW">("NEWEST");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error("فشل في جلب قائمة الطلبات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم تحديث حالة الطلب وإشعار العميل بنجاح");
      fetchOrders();
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم تحديث حالة الدفع بنجاح");
      fetchOrders();
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const confirmReceiptAndOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAID", status: "CONFIRMED" }),
      });
      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم تأكيد إيصال الدفع وتأكيد الطلب بنجاح!");
      fetchOrders();
    } catch (error) {
      toast.error("حدث خطأ أثناء التأكيد");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب وكافة عناصره نهائياً؟")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      toast.success("تم حذف الطلب بنجاح");
      fetchOrders();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الطلب");
    }
  };

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (statusFilter !== "ALL" && order.status !== statusFilter) return false;
        if (paymentStatusFilter !== "ALL" && order.paymentStatus !== paymentStatusFilter) return false;

        if (dateFilter !== "ALL") {
          const orderDate = new Date(order.createdAt);
          const now = new Date();
          if (dateFilter === "TODAY" && !isToday(orderDate)) return false;
          if (dateFilter === "WEEK" && !isWithinInterval(orderDate, { start: subDays(now, 7), end: now })) return false;
          if (dateFilter === "MONTH" && !isWithinInterval(orderDate, { start: startOfMonth(now), end: now })) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const idMatch = order.id.toLowerCase().includes(q);
          const nameMatch = order.user?.name?.toLowerCase().includes(q);
          const emailMatch = order.user?.email?.toLowerCase().includes(q);
          const phoneMatch = order.phone?.includes(q);
          const addressMatch = order.address?.toLowerCase().includes(q);
          const itemsMatch = order.items?.some((item: any) =>
            item.product?.name?.toLowerCase().includes(q)
          );

          if (!idMatch && !nameMatch && !emailMatch && !phoneMatch && !addressMatch && !itemsMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "OLDEST") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "AMOUNT_HIGH") return b.totalAmount - a.totalAmount;
        if (sortBy === "AMOUNT_LOW") return a.totalAmount - b.totalAmount;
        return 0;
      });
  }, [orders, statusFilter, paymentStatusFilter, dateFilter, searchQuery, sortBy]);

  const getReceiptUrl = (order: any) => {
    if (order.receiptUrl) return order.receiptUrl;
    const match = order.address?.match(/\[إيصال:\s*(https?:\/\/[^\]]+)\]/);
    return match ? match[1] : null;
  };

  const formatCleanAddress = (address: string | null) => {
    if (!address) return "—";
    return address
      .replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "")
      .replace(/\[ملاحظات:\s*[^\]]+\]/g, "")
      .replace(/\s*-\s*-\s*/g, " - ")
      .replace(/^\s*-\s*|\s*-\s*$/g, "")
      .trim() || "—";
  };

  const extractOrderNotes = (order: any) => {
    if (order.notes) return order.notes;
    const match = order.address?.match(/\[ملاحظات:\s*([^\]]+)\]/);
    return match ? match[1] : null;
  };

  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const pendingReceiptsCount = orders.filter((o) => getReceiptUrl(o) && o.paymentStatus === "PENDING").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CONFIRMED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "COMPLETED":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return "2" + cleaned;
    if (!cleaned.startsWith("20") && cleaned.length >= 10) return "20" + cleaned;
    return cleaned;
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">إدارة وتتبع الطلبات وإيصالات الدفع</h1>
            <p className="text-muted-foreground mt-1 text-xs md:text-sm">
              البحث، الفلترة، ومراجعة إيصالات التحويل البنكي وتحديث حالات التوصيل
            </p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-5 py-2.5 bg-muted text-foreground font-bold rounded-2xl flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all self-start md:self-auto shadow-sm text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إجمالي الطلبات</p>
            <h3 className="text-2xl font-black text-foreground font-heading">{totalOrdersCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">الإيرادات المدفوعة</p>
            <h3 className="text-2xl font-black text-foreground font-heading">{totalRevenue.toLocaleString()} ج.م</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">طلبات قيد المراجعة</p>
            <h3 className="text-2xl font-black text-foreground font-heading">{pendingOrdersCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
            <FileCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إيصالات تحتاج مراجعة</p>
            <h3 className="text-2xl font-black text-foreground font-heading">{pendingReceiptsCount}</h3>
          </div>
        </div>
      </div>

      {/* Advanced Search & Filtering Toolbar */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الطلب #، اسم العميل، الهاتف، البريد، أو العنوان..."
              className="w-full pl-4 pr-11 py-3 bg-background border border-border rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-lg hover:bg-muted/80"
              >
                مسح
              </button>
            )}
          </div>

          {/* Payment Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-2xl text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">جميع حالات الدفع</option>
              <option value="PAID">تم الدفع (PAID)</option>
              <option value="PENDING">في انتظار الدفع (PENDING)</option>
              <option value="FAILED">فشل الدفع (FAILED)</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-3 bg-background border border-border rounded-2xl text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="NEWEST">الأحدث أولاً</option>
              <option value="OLDEST">الأقدم أولاً</option>
              <option value="AMOUNT_HIGH">الأعلى قيمة</option>
              <option value="AMOUNT_LOW">الأقل قيمة</option>
            </select>
          </div>
        </div>

        {/* Filter Badges & Quick Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground ml-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> حالة الطلب:
            </span>
            {[
              { id: "ALL", label: "الكل" },
              { id: "PENDING", label: BOOKING_STATUS_LABELS.PENDING },
              { id: "CONFIRMED", label: BOOKING_STATUS_LABELS.CONFIRMED },
              { id: "COMPLETED", label: BOOKING_STATUS_LABELS.COMPLETED },
              { id: "CANCELLED", label: BOOKING_STATUS_LABELS.CANCELLED },
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

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground ml-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> التاريخ:
            </span>
            {[
              { id: "ALL", label: "الكل" },
              { id: "TODAY", label: "اليوم" },
              { id: "WEEK", label: "آخر 7 أيام" },
              { id: "MONTH", label: "هذا الشهر" },
            ].map((dateOption) => (
              <button
                key={dateOption.id}
                onClick={() => setDateFilter(dateOption.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  dateFilter === dateOption.id
                    ? "bg-foreground text-background"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {dateOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-bold text-xs text-muted-foreground">جاري تحميل الطلبات...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground font-semibold flex flex-col items-center">
            <ShoppingBag className="w-16 h-16 opacity-30 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1 font-heading">لا توجد طلبات مطابقة</h3>
            <p className="text-xs">لم نعثر على أي طلبات تطابق معايير البحث والفلترة المحددة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="p-5 font-bold text-muted-foreground">رقم الطلب</th>
                  <th className="p-5 font-bold text-muted-foreground">العميل</th>
                  <th className="p-5 font-bold text-muted-foreground">الإجمالي</th>
                  <th className="p-5 font-bold text-muted-foreground">التاريخ</th>
                  <th className="p-5 font-bold text-muted-foreground">حالة الطلب</th>
                  <th className="p-5 font-bold text-muted-foreground">الدفع والإيصال</th>
                  <th className="p-5 font-bold text-muted-foreground text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedId === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <tr 
                        className={`hover:bg-muted/30 transition-colors cursor-pointer ${isExpanded ? "bg-muted/20" : ""}`}
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      >
                        <td className="p-5 font-mono text-xs font-black text-foreground">
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td className="p-5">
                          <p className="font-black text-foreground text-xs">{order.user?.name || "عميل بدون اسم"}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5" dir="ltr">{order.phone || order.user?.email}</p>
                        </td>
                        <td className="p-5 font-black text-primary text-sm font-heading">
                          {order.totalAmount.toLocaleString()} ج.م
                        </td>
                        <td className="p-5 font-medium text-muted-foreground text-[11px]">
                          {format(new Date(order.createdAt), "yyyy/MM/dd - hh:mm a", { locale: ar })}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(order.status)}`}>
                            {BOOKING_STATUS_LABELS[order.status as keyof typeof BOOKING_STATUS_LABELS] || order.status}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getPaymentStatusBadge(order.paymentStatus)}`}>
                              {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || order.paymentStatus}
                            </span>
                            {getReceiptUrl(order) && (
                              <span className="bg-purple-500/10 text-purple-600 border border-purple-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> إيصال مرفق
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <button
                            type="button"
                            className="p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4 mx-auto" /> : <ChevronDown className="w-4 h-4 mx-auto" />}
                          </button>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className="bg-muted/10">
                          <td colSpan={7} className="p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                              
                              {/* Ordered Products list */}
                              <div className="lg:col-span-7 space-y-4">
                                <h4 className="text-xs font-black text-foreground flex items-center gap-2 font-heading">
                                  <Package className="w-4 h-4 text-primary" />
                                  المنتجات المطلوبة ({order.items?.length || 0})
                                </h4>
                                <div className="space-y-3">
                                  {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border shadow-sm">
                                      <div className="w-14 h-14 bg-muted rounded-xl border border-border overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.product?.imageUrl ? (
                                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <Package className="w-6 h-6 text-muted-foreground opacity-50" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-foreground truncate">{item.product?.name || "منتج محذوف"}</p>
                                        <p className="text-[11px] text-muted-foreground mt-1">
                                          {item.price.toLocaleString()} ج.م × {item.quantity} قطعة
                                        </p>
                                      </div>
                                      <div className="font-black text-sm text-primary font-heading">
                                        {(item.price * item.quantity).toLocaleString()} ج.م
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="p-4 bg-background rounded-2xl border border-border flex justify-between items-center text-xs">
                                  <span className="font-bold text-muted-foreground">الإجمالي الكلي للفاتورة:</span>
                                  <span className="font-black text-lg text-primary font-heading">{order.totalAmount.toLocaleString()} ج.م</span>
                                </div>

                                {/* Attached Payment Receipt Box */}
                                {getReceiptUrl(order) && (
                                  <div className="p-5 bg-card rounded-2xl border border-purple-500/30 space-y-3 shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-black text-purple-600 flex items-center gap-1.5">
                                        <FileCheck className="w-4 h-4" /> صورة إيصال الدفع المرفقة من العميل:
                                      </span>
                                      {order.paymentStatus === "PENDING" && (
                                        <button
                                          onClick={() => confirmReceiptAndOrder(order.id)}
                                          className="bg-green-600 hover:bg-green-700 text-white font-black text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>تأكيد الإيصال واعتماد الدفع</span>
                                        </button>
                                      )}
                                    </div>

                                    <div 
                                      className="relative w-40 h-40 rounded-2xl overflow-hidden border border-border bg-muted cursor-pointer group shadow-sm"
                                      onClick={() => setSelectedReceiptUrl(getReceiptUrl(order))}
                                    >
                                      <img src={getReceiptUrl(order)} alt="Receipt" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                        <Eye className="w-4 h-4" /> تكبير الإيصال
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Shipping & Actions */}
                              <div className="lg:col-span-5 space-y-6">
                                {/* Customer & Shipping Info */}
                                <div>
                                  <h4 className="text-xs font-black text-foreground mb-3 font-heading">بيانات التوصيل والتواصل</h4>
                                  <div className="bg-background p-5 rounded-2xl border border-border space-y-3 text-xs leading-relaxed">
                                    <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                      <span className="text-muted-foreground font-bold">اسم المستلم:</span>
                                      <span className="font-black text-foreground">{order.user?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                      <span className="text-muted-foreground font-bold">الهاتف:</span>
                                      <span className="font-black text-foreground" dir="ltr">{order.phone || "—"}</span>
                                    </div>
                                    <div className="flex justify-between items-start border-b border-border/50 pb-2">
                                      <span className="text-muted-foreground font-bold">العنوان:</span>
                                      <span className="font-semibold text-foreground text-left max-w-[200px]">{formatCleanAddress(order.address)}</span>
                                    </div>
                                    {extractOrderNotes(order) && (
                                      <div className="flex justify-between items-start border-b border-border/50 pb-2">
                                        <span className="text-muted-foreground font-bold">ملاحظات العميل:</span>
                                        <span className="font-semibold text-foreground text-left max-w-[200px]">{extractOrderNotes(order)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center pt-1">
                                      <span className="text-muted-foreground font-bold">طريقة الدفع:</span>
                                      <span className="font-bold text-primary">
                                        {PAYMENT_METHOD_LABELS[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || order.paymentMethod}
                                      </span>
                                    </div>

                                    {/* Direct Contact Action Buttons */}
                                    <div className="flex items-center gap-2 pt-3">
                                      {order.phone && (
                                        <a
                                          href={`https://wa.me/${formatPhoneNumber(order.phone)}?text=${encodeURIComponent(`مرحباً بك عميلنا العزيز ${order.user?.name} بخصوص طلبك رقم #${order.id.slice(-8).toUpperCase()} في أورجينال`)}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5" />
                                          واتساب
                                        </a>
                                      )}
                                      {order.phone && (
                                        <a
                                          href={`tel:${order.phone}`}
                                          className="px-3 py-2 bg-muted text-foreground hover:bg-muted/80 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                                          title="اتصال هاتفياً"
                                        >
                                          <Phone className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      {order.user?.email && (
                                        <a
                                          href={`mailto:${order.user.email}?subject=بخصوص طلبك رقم #${order.id.slice(-8).toUpperCase()}`}
                                          className="px-3 py-2 bg-muted text-foreground hover:bg-muted/80 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                                          title="إرسال بريد"
                                        >
                                          <Mail className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Order & Payment Status Update */}
                                <div>
                                  <h4 className="text-xs font-black text-foreground mb-3 font-heading">تحديث الحالات فورياً</h4>
                                  <div className="bg-background p-5 rounded-2xl border border-border space-y-4">
                                    <div>
                                      <p className="text-xs font-bold text-muted-foreground mb-2">حالة شحن الطلب</p>
                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "CONFIRMED"); }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            order.status === "CONFIRMED"
                                              ? "bg-blue-600 text-white shadow-sm"
                                              : "bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white"
                                          }`}
                                        >
                                          تأكيد الطلب
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "COMPLETED"); }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            order.status === "COMPLETED"
                                              ? "bg-green-600 text-white shadow-sm"
                                              : "bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white"
                                          }`}
                                        >
                                          تم التوصيل (مكتمل)
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "CANCELLED"); }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            order.status === "CANCELLED"
                                              ? "bg-red-600 text-white shadow-sm"
                                              : "bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white"
                                          }`}
                                        >
                                          إلغاء الطلب
                                        </button>
                                      </div>
                                    </div>

                                    <div className="pt-2 border-t border-border/50">
                                      <p className="text-xs font-bold text-muted-foreground mb-2">حالة السداد / الدفع</p>
                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); updatePaymentStatus(order.id, "PAID"); }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            order.paymentStatus === "PAID"
                                              ? "bg-green-600 text-white shadow-sm"
                                              : "bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white"
                                          }`}
                                        >
                                          تم الدفع (PAID)
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); updatePaymentStatus(order.id, "PENDING"); }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            order.paymentStatus === "PENDING"
                                              ? "bg-amber-600 text-white shadow-sm"
                                              : "bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white"
                                          }`}
                                        >
                                          قيد انتظار الدفع
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); updatePaymentStatus(order.id, "FAILED"); }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            order.paymentStatus === "FAILED"
                                              ? "bg-red-600 text-white shadow-sm"
                                              : "bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white"
                                          }`}
                                        >
                                          فشل الدفع
                                        </button>
                                      </div>
                                    </div>
                                  </div>
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

      {/* Receipt Lightbox Modal */}
      <AnimatePresence>
        {selectedReceiptUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
            <div className="relative bg-card rounded-3xl border border-border p-6 max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm text-foreground flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-primary" /> معاينة إيصال الدفع
                </h3>
                <button
                  onClick={() => setSelectedReceiptUrl(null)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center bg-black/90 rounded-2xl p-2">
                <img src={selectedReceiptUrl} alt="Receipt Full" className="max-h-[70vh] object-contain rounded-xl" />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

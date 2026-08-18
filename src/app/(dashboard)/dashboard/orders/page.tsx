import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import { 
  ChevronDown, 
  ShoppingBag, 
  Package, 
  Truck, 
  CreditCard, 
  MessageCircle, 
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  ShieldCheck,
  Printer,
  Sparkles,
  MapPin
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "طلباتي | لوحة التحكم أورجينال",
};

export default async function DashboardOrders() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CONFIRMED": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "COMPLETED": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-600 bg-amber-500/10 border-amber-500/20";
      case "PAID": return "text-green-600 bg-green-500/10 border-green-500/20";
      case "FAILED": return "text-red-600 bg-red-500/10 border-red-500/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground font-heading">طلباتي من المتجر</h1>
            <p className="text-xs text-muted-foreground mt-1">تتبع دقيق لمراحل تجهيز الفرش، الشحن، الفواتير، وشهادات الضمان المعتمدة</p>
          </div>
        </div>
        <Link
          href="/shop"
          className="px-5 py-2.5 bg-primary text-primary-foreground font-black rounded-2xl text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 self-start sm:self-auto"
        >
          <span>تسوق المزيد من المنتجات</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-20 text-center p-6">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="text-xl font-black text-foreground font-heading">لا توجد طلبات سابقة حتى الآن</h2>
          <p className="text-xs text-muted-foreground mt-2 mb-6">قم بزيارة المتجر لاكتشاف تشكيلات الجلود والألكانتارا وإضافتها لطلبك.</p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl text-xs hover:bg-primary/90 transition-all shadow-lg"
          >
            تصفح المتجر الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isConfirmed = order.status === "CONFIRMED" || order.status === "COMPLETED";
            const isCompleted = order.status === "COMPLETED";

            return (
              <details
                key={order.id}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-muted/30">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">رقم الطلب</p>
                      <p className="font-mono font-black text-sm text-foreground">#{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">التاريخ</p>
                      <p className="font-semibold text-xs text-foreground">{format(new Date(order.createdAt), "yyyy/MM/dd", { locale: ar })}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-bold text-muted-foreground">عدد الأصناف</p>
                      <p className="font-semibold text-xs text-foreground">{order.items.reduce((acc, item) => acc + item.quantity, 0)} قطع</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">الإجمالي</p>
                      <p className="font-black text-sm text-primary font-heading">{order.totalAmount.toLocaleString()} ج.م</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}>
                        {BOOKING_STATUS_LABELS[order.status as keyof typeof BOOKING_STATUS_LABELS] || order.status}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || order.paymentStatus}
                      </span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </div>
                </summary>

                <div className="border-t border-border bg-muted/20 p-6 space-y-6">
                  
                  {/* 4-Stage Visual Timeline Tracking */}
                  <div className="bg-card p-6 rounded-2xl border border-border space-y-3">
                    <h4 className="text-xs font-black text-foreground mb-4 font-heading flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <span>مراحل تجهيز وتوصيل الشحنة:</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center relative">
                      <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-border">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-foreground">1. استلام الطلب</span>
                        <span className="text-[10px] text-muted-foreground">تم التوثيق بالنظام</span>
                      </div>

                      <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-border">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isConfirmed ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {isConfirmed ? <CheckCircle2 className="w-4 h-4" /> : "2"}
                        </div>
                        <span className={`text-xs font-bold ${isConfirmed ? "text-foreground" : "text-muted-foreground"}`}>
                          2. قص الليزر والتجهيز
                        </span>
                        <span className="text-[10px] text-muted-foreground">مطابقة الباترون الألماني</span>
                      </div>

                      <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-border">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : "3"}
                        </div>
                        <span className={`text-xs font-bold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          3. في الطريق للشحن
                        </span>
                        <span className="text-[10px] text-muted-foreground">مع مندوب التوصيل المعتمد</span>
                      </div>

                      <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-border">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : "4"}
                        </div>
                        <span className={`text-xs font-bold ${isCompleted ? "text-emerald-600" : "text-muted-foreground"}`}>
                          4. تم الاستلام والتركيب
                        </span>
                        <span className="text-[10px] text-muted-foreground">تفعيل الضمان الذهبي</span>
                      </div>
                    </div>
                  </div>

                  {/* Items List with Category and Warranty */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-foreground flex items-center gap-2 font-heading">
                      <Package className="w-4 h-4 text-primary" />
                      <span>الأصناف والمنتجات المشمولة في الطلب:</span>
                    </h3>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-muted shrink-0 border border-border">
                            {item.product?.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                                <ShoppingBag className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-xs sm:text-sm text-foreground">{item.product?.name || "منتج تنجيد خاص"}</p>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>الكمية: <strong>{item.quantity}</strong></span>
                              <span>•</span>
                              <span>السعر: <strong>{item.price.toLocaleString()} ج.م</strong></span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                              <ShieldCheck className="w-3 h-3" /> مشمول بالضمان الذهبي 5 سنوات
                            </span>
                          </div>
                        </div>

                        <div className="text-left font-black text-base text-primary font-heading sm:border-r border-border sm:pr-6">
                          {(item.price * item.quantity).toLocaleString()} ج.م
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address & Payment Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-card p-5 rounded-2xl border border-border space-y-2.5 text-xs">
                      <h4 className="font-black text-foreground flex items-center gap-1.5 border-b border-border/50 pb-2 font-heading">
                        <MapPin className="w-4 h-4 text-primary" /> عنوان التوصيل وبيانات الاتصال
                      </h4>
                      <p className="text-muted-foreground">العنوان: <strong className="text-foreground">{order.address ? order.address.replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "").replace(/\[ملاحظات:\s*[^\]]+\]/g, "").replace(/\s*-\s*-\s*/g, " - ").replace(/^\s*-\s*|\s*-\s*$/g, "").trim() || "—" : "—"}</strong></p>
                      {order.governorate && <p className="text-muted-foreground">المحافظة: <strong className="text-foreground">{order.governorate}</strong></p>}
                      {order.city && <p className="text-muted-foreground">المدينة: <strong className="text-foreground">{order.city}</strong></p>}
                      <p className="text-muted-foreground">الهاتف: <strong className="text-foreground" dir="ltr">{order.phone || "—"}</strong></p>
                    </div>

                    <div className="bg-card p-5 rounded-2xl border border-border space-y-2.5 text-xs">
                      <h4 className="font-black text-foreground flex items-center gap-1.5 border-b border-border/50 pb-2 font-heading">
                        <CreditCard className="w-4 h-4 text-primary" /> تفاصيل الفاتورة والسداد
                      </h4>
                      <p className="text-muted-foreground">طريقة الدفع: <strong className="text-primary font-bold">{PAYMENT_METHOD_LABELS[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || order.paymentMethod}</strong></p>
                      <p className="text-muted-foreground">إجمالي المبلغ المطلوب: <strong className="text-primary font-black text-base font-heading">{order.totalAmount.toLocaleString()} ج.م</strong></p>
                      {(() => {
                        const receipt = order.receiptUrl || order.address?.match(/\[إيصال:\s*(https?:\/\/[^\]]+)\]/)?.[1] || null;
                        return receipt ? (
                          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <FileCheck className="w-4 h-4" /> إيصال التحويل موثق ومرفق
                            </span>
                            <a
                              href={receipt}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-primary underline hover:opacity-80"
                            >
                              معاينة الإيصال المرفق
                            </a>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Actions & WhatsApp Support */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-muted-foreground font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      مركز أورجينال لفرش وعناية السيارات الفاخرة
                    </span>

                    <a
                      href={`https://wa.me/201008499476?text=${encodeURIComponent(`مرحباً أورجينال، أود الاستفسار عن طلبي رقم #${order.id.slice(-8).toUpperCase()}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تتبع أو استفسار عبر واتساب</span>
                    </a>
                  </div>

                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}

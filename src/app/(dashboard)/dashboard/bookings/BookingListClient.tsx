"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS, SERVICE_TYPE_LABELS } from "@/types";
import { 
  Calendar, 
  Car, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  MessageCircle, 
  ArrowLeft, 
  FileCheck, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  X,
  Sparkles,
  CheckCircle2,
  Info,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CancelBookingButton from "./CancelBookingButton";
import Link from "next/link";

interface BookingListClientProps {
  initialBookings: any[];
}

export default function BookingListClient({ initialBookings }: BookingListClientProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [modalBooking, setModalBooking] = useState<any | null>(null);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CONFIRMED": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-600 bg-amber-500/10 border-amber-500/20";
      case "PAID": return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
      case "FAILED": return "text-red-600 bg-red-500/10 border-red-500/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedBookingId((prev) => (prev === id ? null : id));
  };

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-20 text-center p-6 shadow-sm">
        <Calendar className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-black text-foreground font-heading">لا توجد حجوزات سابقة حتى الآن</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-6 max-w-sm">
          يمكنك حجز موعد لمعاينة وفرش وتجهيز سيارتك بأرقى الخامات الألمانية الآن.
        </p>
        <Link
          href="/booking"
          className="px-6 py-3 bg-primary text-primary-foreground font-black rounded-2xl text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <span>احجز موعدك الأول بالمركز</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {bookings.map((booking) => {
        const isExpanded = expandedBookingId === booking.id;
        const isConfirmed = booking.status === "CONFIRMED" || booking.status === "COMPLETED";
        const isCompleted = booking.status === "COMPLETED";
        const receipt = booking.receiptUrl || booking.notes?.match(/\[إيصال:\s*(https?:\/\/[^\]]+)\]/)?.[1] || null;
        const cleanNotes = booking.notes?.replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "").trim();
        const serviceUrl = `/booking?serviceType=${booking.serviceType}&carType=${encodeURIComponent(booking.carType || "")}&carModel=${encodeURIComponent(booking.carModel || "")}`;

        return (
          <div
            key={booking.id}
            className={`rounded-3xl border transition-all duration-200 bg-card overflow-hidden shadow-sm ${
              isExpanded ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
            }`}
          >
            {/* Clickable Header */}
            <div
              onClick={() => toggleExpand(booking.id)}
              className="p-6 cursor-pointer bg-muted/15 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-foreground font-heading">
                      {SERVICE_TYPE_LABELS[booking.serviceType as keyof typeof SERVICE_TYPE_LABELS] || booking.serviceType}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg" dir="ltr">
                      #{booking.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>موعد الحضور: <strong>{booking.date && !isNaN(new Date(booking.date).getTime()) ? format(new Date(booking.date), "yyyy/MM/dd (hh:mm a)", { locale: ar }) : "—"}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-0.5 text-[11px] font-black ${getStatusColor(booking.status)}`}>
                    {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS] || booking.status}
                  </span>
                  <span className={`rounded-full border px-3 py-0.5 text-[11px] font-bold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {PAYMENT_STATUS_LABELS[booking.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || booking.paymentStatus}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalBooking(booking);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>تفاصيل الحجز</span>
                </button>

                <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Expandable Comprehensive Booking Details */}
            {isExpanded && (
              <div className="border-t border-border p-6 md:p-8 space-y-6 bg-card animate-in fade-in duration-200">
                {/* Visual 3-Stage Progress Timeline */}
                <div className="bg-muted/25 p-5 rounded-2xl border border-border space-y-3">
                  <h4 className="text-xs font-black text-foreground flex items-center gap-1.5 font-heading">
                    <Clock className="w-4 h-4 text-primary" /> مراحل وتتبع موعد الخدمة:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-2.5 shadow-sm">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground">1. تم استلام الحجز</p>
                        <p className="text-[10px] text-muted-foreground">تجهيز الفنيين والباترون</p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${isConfirmed ? "bg-card border-border shadow-sm" : "bg-muted/40 border-border/50 opacity-60"}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isConfirmed ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}>
                        2
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground">2. الحضور والمعاينة والتركيب</p>
                        <p className="text-[10px] text-muted-foreground">قص ليزر وخياطة أمان</p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${isCompleted ? "bg-card border-border shadow-sm" : "bg-muted/40 border-border/50 opacity-60"}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isCompleted ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>
                        3
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground">3. استلام السيارة والضمان</p>
                        <p className="text-[10px] text-muted-foreground">شهادة ضمان 5 سنوات</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Car & Service Info */}
                  <div className="bg-muted/15 p-5 rounded-2xl border border-border space-y-3 text-xs">
                    <h4 className="font-black text-foreground flex items-center gap-2 font-heading border-b border-border pb-2.5">
                      <Car className="w-4 h-4 text-primary" /> تفاصيل السيارة والخدمة المطلوبة
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold">الخدمة:</span>
                        <span className="font-black text-foreground">{SERVICE_TYPE_LABELS[booking.serviceType as keyof typeof SERVICE_TYPE_LABELS] || booking.serviceType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold">ماركة وموديل السيارة:</span>
                        <span className="font-black text-foreground">{booking.carType} {booking.carModel}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold">تاريخ إنشاء الطلب:</span>
                        <span className="font-medium text-foreground">{format(new Date(booking.createdAt), "yyyy/MM/dd (hh:mm a)", { locale: ar })}</span>
                      </div>
                      {cleanNotes && (
                        <div className="pt-2 border-t border-border">
                          <span className="text-muted-foreground font-bold block mb-1">ملاحظات وطلبات العميل:</span>
                          <p className="p-2.5 rounded-xl bg-background border border-border text-foreground font-medium">{cleanNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment & Receipt Info */}
                  <div className="bg-muted/15 p-5 rounded-2xl border border-border space-y-3 text-xs">
                    <h4 className="font-black text-foreground flex items-center gap-2 font-heading border-b border-border pb-2.5">
                      <CreditCard className="w-4 h-4 text-primary" /> التكلفة وطريقة السداد
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold">طريقة الدفع:</span>
                        <span className="font-black text-primary">{PAYMENT_METHOD_LABELS[booking.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || booking.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold">المبلغ المطلوب:</span>
                        <span className="font-black text-base text-primary font-heading">{booking.totalAmount > 0 ? `${booking.totalAmount.toLocaleString()} ج.م` : "يحدد بالمركز بعد المعاينة"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold">حالة السداد:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {PAYMENT_STATUS_LABELS[booking.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || booking.paymentStatus}
                        </span>
                      </div>

                      {/* Attached Receipt Box */}
                      {receipt && (
                        <div className="pt-2.5 border-t border-border flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                            <FileCheck className="w-4 h-4" />
                            <span>إيصال التحويل مرفق وموثق</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptUrl(receipt)}
                            className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-black rounded-xl text-[11px] flex items-center gap-1 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة الإيصال</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> مشمول بالضمان الذهبي 5 سنوات
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {booking.status === "PENDING" && (
                      <CancelBookingButton bookingId={booking.id} />
                    )}

                    <button
                      type="button"
                      onClick={() => setModalBooking(booking)}
                      className="text-xs font-bold text-foreground bg-muted hover:bg-muted/80 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>نافذة التفاصيل</span>
                    </button>

                    <Link
                      href={serviceUrl}
                      className="text-xs font-black text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-primary/20"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>حجز أو تعديل الخدمة</span>
                    </Link>

                    <a
                      href={`https://wa.me/201008499476?text=${encodeURIComponent(`مرحباً أورجينال، أود الاستفسار عن تفاصيل حجزي رقم #${booking.id.slice(-6).toUpperCase()} لخدمة ${SERVICE_TYPE_LABELS[booking.serviceType as keyof typeof SERVICE_TYPE_LABELS] || booking.serviceType}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تواصل واتساب</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* FULL BOOKING DETAILS MODAL */}
      <AnimatePresence>
        {modalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground font-heading">
                      تفاصيل الحجز #{modalBooking.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {SERVICE_TYPE_LABELS[modalBooking.serviceType as keyof typeof SERVICE_TYPE_LABELS] || modalBooking.serviceType}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalBooking(null)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Timeline */}
                <div className="bg-muted/25 p-5 rounded-2xl border border-border space-y-3">
                  <h4 className="text-xs font-black text-foreground">حالة الحجز ومراحل التجهيز:</h4>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black mb-1.5">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-foreground">تم الاستلام</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black mb-1.5 ${
                        modalBooking.status === "CONFIRMED" || modalBooking.status === "COMPLETED" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        2
                      </div>
                      <span className="text-xs font-bold text-foreground">المعاينة والتركيب</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black mb-1.5 ${
                        modalBooking.status === "COMPLETED" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        3
                      </div>
                      <span className="text-xs font-bold text-foreground">الاستلام والضمان</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-background p-4 rounded-2xl border border-border space-y-2">
                    <p className="text-muted-foreground">نوع السيارة: <strong className="text-foreground">{modalBooking.carType} {modalBooking.carModel}</strong></p>
                    <p className="text-muted-foreground">موعد الحضور: <strong className="text-foreground">{modalBooking.date ? format(new Date(modalBooking.date), "yyyy/MM/dd (hh:mm a)", { locale: ar }) : "—"}</strong></p>
                    <p className="text-muted-foreground">تاريخ الحجز: <strong className="text-foreground">{format(new Date(modalBooking.createdAt), "yyyy/MM/dd", { locale: ar })}</strong></p>
                  </div>

                  <div className="bg-background p-4 rounded-2xl border border-border space-y-2">
                    <p className="text-muted-foreground">طريقة الدفع: <strong className="text-primary font-bold">{PAYMENT_METHOD_LABELS[modalBooking.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || modalBooking.paymentMethod}</strong></p>
                    <p className="text-muted-foreground">التكلفة: <strong className="text-primary font-black text-sm">{modalBooking.totalAmount > 0 ? `${modalBooking.totalAmount.toLocaleString()} ج.م` : "تحدد بالمركز"}</strong></p>
                    <p className="text-muted-foreground">حالة السداد: <strong className="text-emerald-600 font-bold">{PAYMENT_STATUS_LABELS[modalBooking.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || modalBooking.paymentStatus}</strong></p>
                  </div>
                </div>

                {modalBooking.notes && (
                  <div className="bg-background p-4 rounded-2xl border border-border text-xs">
                    <span className="font-bold text-foreground block mb-1">الملاحظات المسجلة:</span>
                    <p className="text-muted-foreground leading-relaxed">{modalBooking.notes.replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "").trim()}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border flex justify-end gap-3 bg-muted/10">
                <button
                  onClick={() => setModalBooking(null)}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-black text-xs rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Zoom Modal for Receipts */}
      <AnimatePresence>
        {selectedReceiptUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
            <div className="relative bg-card rounded-3xl border border-border p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
                <h3 className="font-black text-sm text-foreground flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  <span>معاينة إيصال التحويل المرفق</span>
                </h3>
                <button
                  onClick={() => setSelectedReceiptUrl(null)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center bg-black/90 rounded-2xl p-2 min-h-[300px]">
                <img 
                  src={selectedReceiptUrl} 
                  alt="Receipt Full" 
                  className="max-h-[70vh] w-auto object-contain rounded-xl" 
                />
              </div>
              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setSelectedReceiptUrl(null)}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-black text-xs rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sofa,
  Sparkles,
  Wrench,
  SprayCan,
  CalendarDays,
  CreditCard,
  Banknote,
  Car,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
  ShieldCheck,
  Tag,
  Loader2,
  Upload,
  Copy,
  Check,
  FileCheck,
  ImageIcon,
  X
} from "lucide-react";
import toast from "react-hot-toast";

import { ServiceType, PaymentMethod, SERVICE_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/types";

const SERVICE_OPTIONS = [
  {
    id: "UPHOLSTERY" as ServiceType,
    title: SERVICE_TYPE_LABELS["UPHOLSTERY"],
    description: "تغيير أو تجديد فرش السيارات بأفضل أنواع الجلود والأقمشة الألمانية.",
    icon: Sofa,
  },
  {
    id: "POLISHING" as ServiceType,
    title: SERVICE_TYPE_LABELS["POLISHING"],
    description: "تلميع خارجي وداخلي مع إضافة طبقات نانو سيراميك لحماية الطلاء والفرش.",
    icon: Sparkles,
  },
  {
    id: "LEATHER_REPAIR" as ServiceType,
    title: SERVICE_TYPE_LABELS["LEATHER_REPAIR"],
    description: "معالجة التشققات وإعادة صبغ وتجديد جلود المقصورة والتابلوه.",
    icon: Wrench,
  },
  {
    id: "FULL_CLEANING" as ServiceType,
    title: SERVICE_TYPE_LABELS["FULL_CLEANING"],
    description: "غسيل وتنظيف عميق وتطهير شامل لجميع أجزاء المقصورة الداخلية.",
    icon: SprayCan,
  },
];

const TIME_SLOTS = [
  { id: "MORNING", label: "صباحاً (9:00 ص - 12:00 م)", hours: 9 },
  { id: "AFTERNOON", label: "ظهراً (12:00 م - 3:00 م)", hours: 12 },
  { id: "EVENING", label: "مساءً (3:00 م - 6:00 م)", hours: 15 },
];

function BookingContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected Product from Store Query
  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName");
  const productPrice = searchParams.get("productPrice");
  const productImage = searchParams.get("productImage");
  const productCategory = searchParams.get("productCategory");
  const defaultServiceType = (searchParams.get("serviceType") as ServiceType) || "UPHOLSTERY";
  const defaultNotes = searchParams.get("notes") || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [serviceType, setServiceType] = useState<ServiceType | null>(defaultServiceType);
  const [carType, setCarType] = useState("");
  const [carModel, setCarModel] = useState("");
  const [notes, setNotes] = useState(
    productName 
      ? `طلب تركيب منتج من المتجر: ${productName} (كود: #${productId?.slice(-6) || ""})${defaultNotes ? ` - ${defaultNotes}` : ""}` 
      : defaultNotes
  );
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>("CASH");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    instapayAccount: "",
    vodafoneNumber: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setPaymentSettings({
          instapayAccount: data.payment_instapay_account || "",
          vodafoneNumber: data.payment_vodafone_number || "",
        });
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("تم نسخ الرقم بنجاح!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingReceipt(true);
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.secure_url) {
        setReceiptUrl(data.secure_url);
        toast.success("تم رفع صورة إيصال الدفع بنجاح");
      } else {
        toast.error("فشل رفع الإيصال");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  // Helpers
  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const selectedService = SERVICE_OPTIONS.find((s) => s.id === serviceType);

  const handleSubmit = async () => {
    if (status === "unauthenticated") {
      toast.error("يرجى تسجيل الدخول أولاً لإتمام الحجز");
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (!serviceType || !carType || !carModel || !date || timeSlot === null || !paymentMethod) {
      toast.error("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }

    setLoading(true);

    try {
      let bookingIsoDate = new Date().toISOString();
      try {
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
          parsed.setHours(timeSlot ?? 12, 0, 0, 0);
          bookingIsoDate = parsed.toISOString();
        }
      } catch {}

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          carType,
          carModel,
          notes: productName ? `[تركيب منتج: ${productName}] ${notes}` : notes,
          date: bookingIsoDate,
          totalAmount: productPrice ? parseFloat(productPrice) : 0,
          paymentMethod,
          receiptUrl: receiptUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ أثناء إتمام الحجز");
      }

      toast.success("تم تأكيد الحجز بنجاح!");
      router.push("/dashboard/bookings");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -40 : 40,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header & Progress */}
      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black mb-4 border border-primary/20">
          <Sparkles className="w-4 h-4" /> ضمان ذهبي على كافة أعمال التركيب والتنجيد
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3 leading-tight font-heading">
          حجز موعد خدمة وتركيب السيارات
        </h1>
        <p className="text-muted-foreground font-medium text-sm md:text-base max-w-xl mx-auto">
          نقدم لك أرقى خدمات العناية والتركيب الفندقي لسيارتك بأيدي نخبة من المتخصصين المعتمدين.
        </p>

        {/* Selected Product Banner */}
        {productName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto shadow-sm"
          >
            <div className="flex items-center gap-4 text-right">
              <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden shrink-0 border border-border">
                {productImage ? (
                  <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 p-3 text-muted-foreground" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  المنتج المطلوب تركيبه
                </span>
                <h3 className="font-black text-foreground text-sm mt-0.5">{productName}</h3>
                {productPrice && (
                  <p className="text-xs text-muted-foreground font-bold">
                    السعر: <strong className="text-primary">{parseFloat(productPrice).toLocaleString()} ج.م</strong>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span>تركيب معتمد وضمان كامل</span>
            </div>
          </motion.div>
        )}
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between relative max-w-2xl mx-auto mt-10">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
          {[
            { num: 1, label: "الخدمة" },
            { num: 2, label: "السيارة" },
            { num: 3, label: "الموعد" },
            { num: 4, label: "الدفع" },
            { num: 5, label: "التأكيد" },
          ].map((item) => (
            <div key={item.num} className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-black text-xs md:text-sm transition-all duration-300 shadow-sm ${
                  step >= item.num
                    ? "bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border border-border"
                }`}
              >
                {step > item.num ? <CheckCircle2 className="w-5 h-5" /> : item.num}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground hidden sm:block">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Container */}
      <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden relative">
        <div className="p-6 md:p-10 relative min-h-[420px] z-10">
          <AnimatePresence mode="wait" custom={1}>
            
            {/* STEP 1: Service */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2 font-heading">
                    <Wrench className="w-5 h-5 text-primary" /> اختر الخدمة المطلوبة
                  </h2>
                  <p className="text-muted-foreground text-xs mt-1">حدد نوع التجهيز أو الصيانة المناسبة لسيارتك.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICE_OPTIONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = serviceType === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setServiceType(item.id)}
                        className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex items-start gap-4 relative overflow-hidden group ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                            : "border-border hover:border-primary/40 bg-background"
                        }`}
                      >
                        <div className={`p-3 rounded-xl transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-black text-sm text-foreground font-heading">{item.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Car Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2 font-heading">
                    <Car className="w-5 h-5 text-primary" /> بيانات السيارة والملاحظات
                  </h2>
                  <p className="text-muted-foreground text-xs mt-1">أدخل تفاصيل السيارة لنتمكن من تجهيز الخامات والباترون المناسب.</p>
                </div>

                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">نوع وصانع السيارة</label>
                    <input
                      type="text"
                      placeholder="مثال: مرسيدس، بي إم دبليو، تويوتا، كيا..."
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">الموديل وسنة الصنع</label>
                    <input
                      type="text"
                      placeholder="مثال: C200 - 2024 / سبورتاج 2023..."
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">ملاحظات أو تخصيصات إضافية (اختياري)</label>
                    <textarea
                      placeholder="ألوان الجلود المفضلة، نمط التطريز، سقف النجوم..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-background border border-border rounded-2xl p-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Date & Time */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2 font-heading">
                    <CalendarDays className="w-5 h-5 text-primary" /> تحديد الموعد المناسب
                  </h2>
                  <p className="text-muted-foreground text-xs mt-1">اختر اليوم والفترة الزمنية لتجهيز سيارتك بالمركز.</p>
                </div>

                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">تاريخ الحضور بالمركز</label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">الفترة الزمنية المفضلة</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setTimeSlot(slot.hours)}
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                            timeSlot === slot.hours
                              ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "border-border hover:border-primary/40 bg-background text-foreground"
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Payment & Receipt Attachment */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2 font-heading">
                    <CreditCard className="w-5 h-5 text-primary" /> طريقة السداد وإرفاق إيصال الدفع
                  </h2>
                  <p className="text-muted-foreground text-xs mt-1">اختر وسيلة الدفع مع إمكانية إرفاق صورة إيصال التحويل لتأكيد الحجز فورياً.</p>
                </div>
                
                <div className="space-y-4 max-w-xl mx-auto">
                  
                  {/* Payment Method 1: Cash */}
                  <div
                    onClick={() => setPaymentMethod("CASH")}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center gap-4 ${
                      paymentMethod === "CASH"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <input
                      type="radio"
                      name="bookingPayment"
                      checked={paymentMethod === "CASH"}
                      onChange={() => setPaymentMethod("CASH")}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <h3 className="font-black text-sm text-foreground">{PAYMENT_METHOD_LABELS["CASH"]}</h3>
                      <p className="text-xs text-muted-foreground">الدفع نقداً أو بالفيزا عند زيارة المركز ومعاينة النتيجة واستلام السيارة.</p>
                    </div>
                  </div>

                  {/* Payment Method 2: InstaPay */}
                  <div
                    onClick={() => setPaymentMethod("INSTAPAY")}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col gap-3 ${
                      paymentMethod === "INSTAPAY"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="bookingPayment"
                        checked={paymentMethod === "INSTAPAY"}
                        onChange={() => setPaymentMethod("INSTAPAY")}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-black text-sm text-foreground">{PAYMENT_METHOD_LABELS["INSTAPAY"]}</h3>
                        <p className="text-xs text-muted-foreground">التحويل اللحظي عبر تطبيق إنستاباي لحساب المركز المعتمد.</p>
                      </div>
                    </div>

                    {/* InstaPay Info & Copy */}
                    {paymentMethod === "INSTAPAY" && paymentSettings.instapayAccount && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-xl border border-border flex items-center justify-between text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">معرف أو رقم إنستاباي:</span>
                          <strong className="text-foreground font-mono">{paymentSettings.instapayAccount}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(paymentSettings.instapayAccount, "instapay");
                          }}
                          className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-bold flex items-center gap-1"
                        >
                          {copiedField === "instapay" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>نسخ</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment Method 3: Vodafone Cash */}
                  <div
                    onClick={() => setPaymentMethod("VODAFONE_CASH")}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col gap-3 ${
                      paymentMethod === "VODAFONE_CASH"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="bookingPayment"
                        checked={paymentMethod === "VODAFONE_CASH"}
                        onChange={() => setPaymentMethod("VODAFONE_CASH")}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-black text-sm text-foreground">{PAYMENT_METHOD_LABELS["VODAFONE_CASH"]}</h3>
                        <p className="text-xs text-muted-foreground">التحويل عبر محفظة فودافون كاش الذكية.</p>
                      </div>
                    </div>

                    {/* Vodafone Cash Info & Copy */}
                    {paymentMethod === "VODAFONE_CASH" && paymentSettings.vodafoneNumber && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-xl border border-border flex items-center justify-between text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">رقم محفظة فودافون كاش:</span>
                          <strong className="text-foreground font-mono" dir="ltr">{paymentSettings.vodafoneNumber}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(paymentSettings.vodafoneNumber, "vodafone");
                          }}
                          className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-bold flex items-center gap-1"
                        >
                          {copiedField === "vodafone" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>نسخ</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Receipt Upload Box (Required/Recommended for Electronic Payments) */}
                  {(paymentMethod === "INSTAPAY" || paymentMethod === "VODAFONE_CASH") && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-muted/30 border border-primary/30 rounded-2xl space-y-3 pt-4"
                    >
                      <div className="flex items-center gap-2 text-xs font-black text-foreground">
                        <Upload className="w-4 h-4 text-primary" />
                        <span>إرفاق صورة إيصال أو سكرين شوت التحويل (توثيق وأمان):</span>
                      </div>

                      <label className="block border-2 border-dashed border-border hover:border-primary/50 bg-background/50 p-4 rounded-2xl text-center cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptUpload}
                          disabled={isUploadingReceipt}
                          className="hidden"
                        />
                        {isUploadingReceipt ? (
                          <div className="flex items-center justify-center gap-2 text-xs text-primary font-bold py-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>جاري رفع صورة الإيصال...</span>
                          </div>
                        ) : receiptUrl ? (
                          <div className="flex items-center justify-between gap-2 p-2">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                              <FileCheck className="w-5 h-5 text-emerald-500" />
                              <span>تم إرفاق إيصال التحويل بنجاح</span>
                            </div>
                            <span className="text-[11px] text-primary font-black underline">تغيير الصورة</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <ImageIcon className="w-7 h-7 text-muted-foreground mx-auto" />
                            <p className="text-xs font-bold text-foreground">اضغط لرفع صورة إيصال التحويل</p>
                            <p className="text-[11px] text-muted-foreground">صورة واضحة لرسالة التحويل أو الإشعار</p>
                          </div>
                        )}
                      </label>

                      {receiptUrl && (
                        <div className="relative h-24 w-full rounded-xl overflow-hidden border border-border bg-black/5">
                          <img src={receiptUrl} alt="Receipt Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </motion.div>
                  )}

                </div>
              </motion.div>
            )}

            {/* STEP 5: Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-black text-foreground flex items-center justify-center gap-2 font-heading">
                    <FileText className="w-5 h-5 text-primary" /> مراجعة وتأكيد بيانات الحجز
                  </h2>
                  <p className="text-muted-foreground text-xs mt-1">تأكد من صحة تفاصيل الموعد والسيارة قبل الإرسال.</p>
                </div>
                
                <div className="max-w-xl mx-auto bg-muted/40 rounded-3xl p-6 border border-border space-y-4 text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground font-bold">الخدمة المطلوبة:</span>
                    <span className="font-black text-foreground">{selectedService?.title}</span>
                  </div>
                  {productName && (
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground font-bold">المنتج المراد تركيبه:</span>
                      <span className="font-black text-primary">{productName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground font-bold">بيانات السيارة:</span>
                    <span className="font-bold text-foreground">{carType} - {carModel}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground font-bold">الموعد المحدد:</span>
                    <span className="font-bold text-foreground">
                      {date} ({TIME_SLOTS.find(t => t.hours === timeSlot)?.label})
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground font-bold">طريقة الدفع:</span>
                    <span className="font-bold text-foreground">{paymentMethod && PAYMENT_METHOD_LABELS[paymentMethod]}</span>
                  </div>
                  {receiptUrl && (
                    <div className="flex justify-between items-center pb-3 border-b border-border text-emerald-600 font-bold">
                      <span>إيصال التحويل:</span>
                      <span className="flex items-center gap-1"><FileCheck className="w-4 h-4" /> تم إرفاق الإيصال</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1 text-sm">
                    <span className="font-bold text-foreground">التكلفة التقديرية:</span>
                    <span className="font-black text-primary">
                      {productPrice ? `${parseFloat(productPrice).toLocaleString()} ج.م` : "يحدد في المركز"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="bg-muted/30 p-5 md:px-8 border-t border-border flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-foreground bg-background border border-border hover:bg-muted transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-black text-xs text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>تأكيد الحجز النهائي</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4" dir="rtl">
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <BookingContent />
      </Suspense>
    </div>
  );
}

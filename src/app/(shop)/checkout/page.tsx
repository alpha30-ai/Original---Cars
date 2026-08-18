"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Truck, 
  Phone, 
  MapPin, 
  User, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  ShoppingBag,
  Sparkles,
  Upload,
  Image as ImageIcon,
  FileCheck,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { PaymentMethod } from "@/types";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
  });

  const [receiptUrl, setReceiptUrl] = useState("");
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [paymentSettings, setPaymentSettings] = useState({
    instapayAccount: "",
    vodafoneNumber: "",
    enableInstapay: false,
    enableVodafone: false,
    enableCod: true,
  });
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("يرجى تسجيل الدخول أولاً لإتمام الطلب");
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && status === "authenticated") {
      router.push("/shop");
    }
  }, [items, status, router]);

  // Pre-fill user data
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        phone: (session.user as any).phone || prev.phone,
        governorate: (session.user as any).governorate || prev.governorate,
        city: (session.user as any).city || prev.city,
        address: (session.user as any).address || prev.address,
      }));
    }
  }, [session]);

  // Fetch payment settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        const settings = {
          instapayAccount: data.payment_instapay_account || "",
          vodafoneNumber: data.payment_vodafone_number || "",
          enableInstapay: data.payment_enable_instapay === "true" || data.payment_enable_instapay === true,
          enableVodafone: data.payment_enable_vodafone === "true" || data.payment_enable_vodafone === true,
          enableCod: data.payment_enable_cod === "true" || data.payment_enable_cod === true || data.payment_enable_cod === undefined,
        };
        
        setPaymentSettings(settings);
        
        if (settings.enableCod) setPaymentMethod("CASH");
        else if (settings.enableInstapay) setPaymentMethod("INSTAPAY");
        else if (settings.enableVodafone) setPaymentMethod("VODAFONE_CASH");
        
        setIsSettingsLoading(false);
      })
      .catch(() => setIsSettingsLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("يرجى إكمال جميع بيانات الشحن والعنوان");
      return;
    }

    setIsLoading(true);

    const fullAddress = [
      formData.governorate,
      formData.city,
      formData.address
    ].filter(Boolean).join(" - ");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount,
          paymentMethod,
          address: fullAddress,
          city: formData.city,
          governorate: formData.governorate,
          phone: formData.phone,
          notes: formData.notes,
          receiptUrl: receiptUrl || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء الطلب");
      }

      setCreatedOrder(data.order);
      clearCart();
      toast.success("تم تأكيد وتوثيق طلبك بنجاح!");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ ما");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isSettingsLoading || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-xs font-bold text-muted-foreground">جاري تجهيز صفحة الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20" dir="rtl">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-8">
          <Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowRight className="w-4 h-4" /> العودة إلى سلة المشتريات
          </Link>
          <span>/</span>
          <span className="text-foreground">إتمام الطلب والدفع</span>
        </div>

        {/* Header Title */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground font-heading">إتمام وتأكيد الطلب</h1>
            <p className="text-xs text-muted-foreground mt-0.5">أدخل بيانات التوصيل واختر وسيلة الدفع المناسبة لك مع إمكانية إرفاق الإيصال</p>
          </div>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Shipping Address */}
            <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="w-7 h-7 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center">1</span>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
                  <MapPin className="w-5 h-5 text-primary" /> بيانات الشحن والتوصيل
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-foreground">الاسم بالكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل اسمك ثلاثياً..."
                      className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-semibold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-foreground">رقم الهاتف للتواصل وتأكيد الشحنة</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="010XXXXXXXX"
                      className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">المحافظة</label>
                  <input
                    type="text"
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    placeholder="مثال: القاهرة، الإسكندرية، الجيزة..."
                    className="w-full bg-background border border-border rounded-2xl py-3.5 px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">المدينة / الحي</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="مثال: التجمع الخامس، المعادي..."
                    className="w-full bg-background border border-border rounded-2xl py-3.5 px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-foreground">العنوان بالتفصيل</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="اسم الشارع، رقم العقار، رقم الشقة، علامة مميزة..."
                    className="w-full bg-background border border-border rounded-2xl p-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-foreground">ملاحظات إضافية للتوصيل (اختياري)</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="أي تعليمات خاصة للمندوب أو أوقات التوصيل المفضلة..."
                    className="w-full bg-background border border-border rounded-2xl py-3.5 px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method & Proof Receipt */}
            <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="w-7 h-7 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center">2</span>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
                  <CreditCard className="w-5 h-5 text-primary" /> اختيار وسيلة الدفع وإثبات السداد
                </h2>
              </div>

              <div className="space-y-4">
                
                {/* Cash on Delivery */}
                {paymentSettings.enableCod && (
                  <label
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "CASH"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={paymentMethod === "CASH"}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-4 h-4 text-primary mt-1"
                    />
                    <div className="space-y-1 flex-1">
                      <h3 className="font-black text-sm text-foreground">الدفع نقداً عند الاستلام (COD)</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        قم بالدفع لمندوب الشحن بعد استلام ومعاينة منتجاتك للتأكد من جودتها ومطابقتها.
                      </p>
                    </div>
                  </label>
                )}

                {/* InstaPay */}
                {paymentSettings.enableInstapay && (
                  <div
                    onClick={() => setPaymentMethod("INSTAPAY")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "INSTAPAY"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="INSTAPAY"
                        checked={paymentMethod === "INSTAPAY"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 text-primary mt-1"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-black text-sm text-foreground">إنستا باي (InstaPay)</h3>
                          <span className="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                            تحويل لحظي مباشر
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          التحويل السريع عبر تطبيق إنستا باي لكافة البنوك المصرية.
                        </p>

                        {paymentMethod === "INSTAPAY" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-4 bg-muted/70 rounded-2xl border border-border space-y-3"
                          >
                            <p className="text-xs font-bold text-foreground">عنوان الدفع / حساب إنستا باي:</p>
                            <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border" dir="ltr">
                              <span className="font-mono font-black text-sm text-foreground select-all">
                                {paymentSettings.instapayAccount || "instapay@original"}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(paymentSettings.instapayAccount || "instapay@original", "instapay")}
                                className="text-xs bg-muted hover:bg-muted/80 p-2 rounded-lg text-foreground flex items-center gap-1 font-bold"
                              >
                                {copiedField === "instapay" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedField === "instapay" ? "تم النسخ" : "نسخ"}</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Vodafone Cash */}
                {paymentSettings.enableVodafone && (
                  <div
                    onClick={() => setPaymentMethod("VODAFONE_CASH")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "VODAFONE_CASH"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VODAFONE_CASH"
                        checked={paymentMethod === "VODAFONE_CASH"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 text-primary mt-1"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-black text-sm text-foreground">فودافون كاش (Vodafone Cash)</h3>
                          <span className="text-[10px] bg-rose-500/10 text-rose-500 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/20">
                            محافظ إلكترونية
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          التحويل المباشر لمحفظة فودافون كاش أو أي محفظة كاش ذكية.
                        </p>

                        {paymentMethod === "VODAFONE_CASH" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-4 bg-muted/70 rounded-2xl border border-border space-y-3"
                          >
                            <p className="text-xs font-bold text-foreground">رقم محفظة التحويل:</p>
                            <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border" dir="ltr">
                              <span className="font-mono font-black text-sm text-foreground select-all">
                                {paymentSettings.vodafoneNumber || "01000000000"}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(paymentSettings.vodafoneNumber || "01000000000", "vodafone")}
                                className="text-xs bg-muted hover:bg-muted/80 p-2 rounded-lg text-foreground flex items-center gap-1 font-bold"
                              >
                                {copiedField === "vodafone" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedField === "vodafone" ? "تم النسخ" : "نسخ"}</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Payment Proof Receipt (For Electronic Payments) */}
                {paymentMethod !== "CASH" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-card rounded-2xl border border-primary/30 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary font-black text-xs">
                        <FileCheck className="w-4 h-4" />
                        <span>إرفاق صورة إيصال التحويل / السداد (لتأكيد فوري للطلب)</span>
                      </div>
                      {receiptUrl && (
                        <span className="text-emerald-500 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> تم إرفاق الإيصال
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <label className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleReceiptUpload}
                          disabled={isUploadingReceipt}
                        />
                        {isUploadingReceipt ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>{receiptUrl ? "تغيير صورة الإيصال" : "رفع لقطة شاشة / صورة الإيصال"}</span>
                      </label>

                      <input
                        type="url"
                        value={receiptUrl}
                        onChange={(e) => setReceiptUrl(e.target.value)}
                        placeholder="أو الصق رابط صورة الإيصال هنا..."
                        className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left font-sans"
                        dir="ltr"
                      />
                    </div>

                    {receiptUrl && (
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-border bg-muted group mt-2">
                        <img src={receiptUrl} alt="Payment Receipt" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setReceiptUrl("")}
                          className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

              </div>
            </div>

          </div>

          {/* Sticky Order Review Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
                <ShoppingBag className="w-5 h-5 text-primary" /> مراجعة الطلب
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-2xl border border-border/50">
                    <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0 border border-border">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 p-1 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-foreground truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.quantity} × {item.product.price.toLocaleString()} ج.م
                      </p>
                    </div>
                    <span className="text-xs font-black text-foreground shrink-0 font-heading">
                      {(item.quantity * item.product.price).toLocaleString()} ج.م
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="space-y-3 pt-4 border-t border-border text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-foreground">{totalAmount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>الشحن والتوصيل</span>
                  <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">مجاناً</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground block">المجموع الإجمالي</span>
                    <span className="text-2xl font-black text-primary font-heading">
                      {totalAmount.toLocaleString()} <span className="text-xs">ج.م</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isLoading || isUploadingReceipt}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري تأكيد الطلب...</span>
                  </>
                ) : (
                  <>
                    <span>تأكيد الطلب نهائياً</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-bold pt-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>بياناتك ومعلوماتك مشفرة ومحمية 100%</span>
              </div>

            </div>
          </div>

        </form>

      </div>

      {/* VIP Order Confirmation & Payment Success Modal */}
      <AnimatePresence>
        {createdOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-lg rounded-3xl border border-primary/30 p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />

              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  تم تسجيل الطلب وتوثيقه بنجاح
                </span>
                <h3 className="text-2xl font-black text-foreground font-heading">
                  شكراً لثقتك في أورجينال! ✨
                </h3>
                <p className="text-xs text-muted-foreground">
                  تم استلام بيانات الشحن والدفع بنجاح، وسيتواصل معك قسم تجهيز الطلبات لتأكيد ميعاد التوصيل.
                </p>
              </div>

              <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">رقم الطلب:</span>
                  <span className="font-mono font-black text-foreground select-all text-sm">
                    #{createdOrder.id?.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">المبلغ الإجمالي:</span>
                  <span className="font-black text-primary font-heading text-sm">
                    {createdOrder.totalAmount?.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">وسيلة الدفع:</span>
                  <span className="font-bold text-foreground">
                    {createdOrder.paymentMethod === "CASH" ? "الدفع عند الاستلام" : createdOrder.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/dashboard/orders"
                  className="flex-1 bg-primary text-primary-foreground py-3.5 px-5 rounded-2xl font-black text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>متابعة حالة الطلب بحسابي</span>
                </Link>

                <a
                  href={`https://wa.me/201008499476?text=${encodeURIComponent(`مرحباً أورجينال، أود تأكيد طلبي رقم #${createdOrder.id?.slice(-8).toUpperCase()}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>محادثة واتساب</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

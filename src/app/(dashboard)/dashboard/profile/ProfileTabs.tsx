"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Lock, Mail, Camera, Loader2, Check, 
  Phone, MapPin, ShoppingBag, 
  Calendar, Clock, ChevronLeft, CreditCard,
  CheckCircle2, Package, AlertCircle, Home,
  Sun, Moon, Trash2, ShieldAlert,
  Car, Wrench, Sparkles, X, MessageCircle,
  Truck, CheckCircle, ExternalLink, Printer, Eye, FileCheck, ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useTheme } from "next-themes";
import Link from "next/link";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "@/types";

const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  UPHOLSTERY: "تركيب فرش كراسي",
  POLISHING: "تلميع وحماية النانو",
  LEATHER_REPAIR: "إصلاح وتجديد الجلود",
  FULL_CLEANING: "تنظيف شامل للمقصورة",
  FULL_UPHOLSTERY: "تنجيد كامل",
  SEAT_REPAIR: "إصلاح مقاعد",
  CUSTOM_DESIGN: "تصميم مخصص",
  STEERING_WHEEL: "تنجيد عجلة القيادة",
  ROOF_LINING: "بطانة السقف",
  OTHER: "أخرى",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "تم التأكيد",
  PROCESSING: "جاري التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "PROCESSING":
    case "CONFIRMED":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "SHIPPED":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "DELIVERED":
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "CANCELLED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

type ProfileTabsProps = {
  user: any;
  orders: any[];
  bookings: any[];
};

export default function ProfileTabs({ user, orders, bookings }: ProfileTabsProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'bookings'>('profile');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || user.image || "");
  
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [city, setCity] = useState(user.city || "");
  const [governorate, setGovernorate] = useState(user.governorate || "");

  useEffect(() => {
    setMounted(true);
    setName(user.name || "");
    setEmail(user.email || "");
    setAvatarUrl(user.avatarUrl || user.image || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");
    setCity(user.city || "");
    setGovernorate(user.governorate || "");
  }, [user]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  const [deleteOtpSent, setDeleteOtpSent] = useState(false);
  const [deleteOtpCode, setDeleteOtpCode] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setAvatarUrl(data.secure_url);
        toast.success("تم رفع الصورة بنجاح");
      }
    } catch (error) {
      toast.error("فشل رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  const requestOTP = async () => {
    setIsRequestingOtp(true);
    try {
      const res = await fetch("/api/user/profile", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setOtpSent(true);
      } else {
        toast.error(data.error || "حدث خطأ");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSensitiveChange = (email && email !== user.email) || password;

    if (isSensitiveChange && !otpSent) {
      await requestOTP();
      return;
    }

    if (isSensitiveChange && !otpCode) {
      toast.error("يرجى إدخال كود التحقق (OTP)");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email: email !== user.email ? email : undefined,
          password: password ? password : undefined,
          avatarUrl,
          phone,
          address,
          city,
          governorate,
          otp: otpCode 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await update({ name: data.user.name, image: data.user.avatarUrl });
        toast.success("تم تحديث البيانات بنجاح");
        setPassword("");
        setOtpCode("");
        setOtpSent(false);
        router.refresh();
      } else {
        toast.error(data.error || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsSaving(false);
    }
  };

  const requestDeleteOTP = async () => {
    setIsRequestingOtp(true);
    try {
      const res = await fetch("/api/user/profile", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setDeleteOtpSent(true);
      } else {
        toast.error(data.error || "حدث خطأ");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteOtpSent) {
      await requestDeleteOTP();
      return;
    }
    if (!deleteOtpCode) {
      toast.error("يرجى إدخال كود التحقق (OTP)");
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user/profile?otp=${deleteOtpCode}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم حذف الحساب بنجاح");
        router.push('/');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(data.error || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'المعلومات الشخصية', icon: User },
    { id: 'orders', label: 'طلباتي', icon: ShoppingBag },
    { id: 'bookings', label: 'حجوزاتي', icon: Calendar },
  ];

  const getTimelineStep = (status: string) => {
    switch (status) {
      case "PENDING": return 1;
      case "CONFIRMED": return 2;
      case "PROCESSING":
      case "SHIPPED": return 3;
      case "DELIVERED":
      case "COMPLETED": return 4;
      default: return 1;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto relative pt-4 sm:pt-8 pb-12" dir="rtl">

      <div className="relative z-10 px-2 sm:px-4 space-y-6">
        
        {/* Header Breadcrumbs & Theme Toggle */}
        <div className="flex items-center justify-between bg-card/70 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-border/50 shadow-sm">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-foreground font-bold">حسابي</span>
          </nav>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-colors"
              title="تغيير المظهر"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
            </button>
          )}
        </div>

        {/* Stats Overview Row (Fully Responsive) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-card/90 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">إجمالي المشتريات</p>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-foreground mt-0.5 truncate">
                {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()} <span className="text-[10px] sm:text-xs font-normal">ج.م</span>
              </h4>
            </div>
          </div>

          <div className="bg-card/90 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">عدد الطلبات</p>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-foreground mt-0.5 truncate">{orders.length} طلبات</h4>
            </div>
          </div>

          <div className="bg-card/90 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">الحجوزات النشطة</p>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-foreground mt-0.5 truncate">
                {bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED").length} مواعيد
              </h4>
            </div>
          </div>

          <div className="bg-card/90 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">حالة الحساب</p>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-emerald-600 mt-0.5 truncate">نشط وموثق</h4>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Sticky Tab Switcher */}
        <div className="flex lg:hidden overflow-x-auto gap-2 p-1.5 bg-card/90 backdrop-blur-md rounded-2xl border border-border shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all shrink-0 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'bg-muted/50 text-foreground/80 hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'orders' && orders.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                    {orders.length}
                  </span>
                )}
                {tab.id === 'bookings' && bookings.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-accent/10 text-accent'}`}>
                    {bookings.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Desktop Sidebar (Hidden on small mobile tab view to avoid repetition) */}
          <div className="w-full lg:w-1/4 shrink-0 space-y-6">
            
            {/* User Brief Card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]" />
              
              <div className="relative inline-block mb-3 mt-1 sm:mb-4 sm:mt-2">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-background shadow-xl mx-auto bg-muted relative z-10 group-hover:scale-105 transition-transform duration-300">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-4 sm:p-5 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2 sm:p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform z-20 border-2 border-background"
                  title="تغيير الصورة"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-black text-foreground truncate">{name || 'مستخدم جديد'}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">{email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  عضو مسجل معتمد
                </div>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="font-black text-foreground text-sm flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-primary inline-block"></span>
                  القائمة الرئيسية
                </h3>
              </div>
              <div className="flex flex-col p-2 gap-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center justify-between w-full p-3.5 text-right transition-all rounded-xl relative overflow-hidden group ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-foreground/80 hover:bg-muted font-medium text-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-background group-hover:text-primary'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{tab.label}</span>
                      </div>
                      {tab.id === 'orders' && orders.length > 0 && (
                        <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-bold relative z-10">{orders.length}</span>
                      )}
                      {tab.id === 'bookings' && bookings.length > 0 && (
                        <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full font-bold relative z-10">{bookings.length}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              
              {/* PROFILE SETTINGS TAB */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-border bg-muted/10">
                      <h2 className="text-base sm:text-xl font-black text-foreground font-heading">إعدادات الحساب والبيانات الشخصية</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">تحديث بياناتك الشخصية وعناوين التوصيل بكل سهولة</p>
                    </div>
                    
                    <form onSubmit={handleSave} className="p-4 sm:p-6 md:p-8 space-y-6">
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">الاسم بالكامل</label>
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 py-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">البريد الإلكتروني</label>
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 py-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                            dir="ltr"
                          />
                          {email !== user.email && (
                            <p className="text-[11px] text-amber-500 mt-1.5 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              تغيير البريد يتطلب تأكيد (OTP)
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">كلمة المرور الجديدة (اختياري)</label>
                          <input
                            type="password"
                            value={password}
                            placeholder="اترك الحقل فارغاً إذا لم ترد التغيير"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 py-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                            dir="ltr"
                          />
                          {password && (
                            <p className="text-[11px] text-amber-500 mt-1.5 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              تغيير كلمة المرور يتطلب تأكيد (OTP)
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border">
                        <h3 className="text-sm sm:text-base font-bold text-foreground mb-4">بيانات الشحن والعنوان</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">رقم الهاتف</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="مثال: 01012345678"
                              className="w-full rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 py-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left font-mono"
                              dir="ltr"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">المحافظة</label>
                            <input
                              type="text"
                              value={governorate}
                              onChange={(e) => setGovernorate(e.target.value)}
                              placeholder="مثال: القاهرة"
                              className="w-full rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 py-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">المدينة</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="مثال: مدينة نصر"
                              className="w-full rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 py-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-1.5 block text-xs sm:text-sm font-bold text-foreground">العنوان التفصيلي</label>
                            <textarea
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="اسم الشارع، رقم العمارة، رقم الشقة..."
                              rows={2}
                              className="w-full rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 py-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {otpSent && (
                        <div className="bg-primary/5 border border-primary/20 p-4 sm:p-6 rounded-2xl">
                          <h3 className="font-bold text-xs sm:text-sm text-primary mb-1 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            يرجى إدخال كود التحقق (OTP)
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            تم إرسال كود التأكيد إلى بريدك الإلكتروني.
                          </p>
                          <input
                            type="text"
                            placeholder="6 أرقام"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full max-w-xs rounded-xl border border-primary/30 bg-background px-4 py-2.5 text-center text-lg font-black tracking-widest focus:border-primary focus:outline-none"
                            maxLength={6}
                          />
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={isSaving || isRequestingOtp}
                          className="rounded-xl sm:rounded-2xl bg-primary px-6 sm:px-8 py-3 sm:py-3.5 font-black text-xs sm:text-sm text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-70 flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                          {(isSaving || isRequestingOtp) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          {(!otpSent && (email !== user.email || password)) ? "إرسال كود التأكيد (OTP)" : "حفظ التعديلات"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-card rounded-2xl sm:rounded-3xl border border-red-500/20 shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-red-500/10 bg-red-500/5 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-red-500">حذف الحساب نهائياً</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                          بمجرد حذف حسابك، سيتم مسح بياناتك وسجل طلباتك من الخادم.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      {deleteOtpSent && (
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-foreground mb-1.5">كود تأكيد الحذف (OTP)</label>
                          <input
                            type="text"
                            placeholder="6 أرقام"
                            value={deleteOtpCode}
                            onChange={(e) => setDeleteOtpCode(e.target.value)}
                            className="w-full max-w-xs rounded-xl border border-red-500/30 bg-background px-4 py-2 text-center text-lg font-black tracking-widest focus:border-red-500 focus:outline-none mb-1"
                            maxLength={6}
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || isRequestingOtp}
                        className="rounded-xl bg-background border border-red-500 text-red-500 px-5 py-2.5 font-bold text-xs transition-all hover:bg-red-500 hover:text-white disabled:opacity-70 flex items-center gap-2"
                      >
                        {(isDeleting || (isRequestingOtp && deleteOtpSent)) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {!deleteOtpSent ? "طلب حذف الحساب" : "تأكيد الحذف النهائي"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border-b border-border bg-muted/10 flex justify-between items-center">
                    <div>
                      <h2 className="text-base sm:text-xl font-black text-foreground font-heading">طلباتي من المتجر</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">تتبع مراحل الشحن وفواتير المنتجات</p>
                    </div>
                    <ShoppingBag className="w-6 h-6 text-primary opacity-40 hidden sm:block" />
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="text-base font-black text-foreground mb-1">ليس لديك أي طلبات حالياً</h3>
                        <p className="text-muted-foreground mb-6 text-xs">اكتشف منتجاتنا المميزة وأضف لمسة الفخامة لسيارتك.</p>
                        <Link href="/shop" className="inline-block bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md">
                          تسوق الآن
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/40 transition-all bg-card shadow-sm cursor-pointer select-none"
                          >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-xs font-bold text-foreground" dir="ltr">#{order.id.slice(-6).toUpperCase()}</span>
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border ${getStatusColor(order.status)}`}>
                                    {ORDER_STATUS_LABELS[order.status] || order.status}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(order.createdAt), 'dd MMMM yyyy (hh:mm a)', { locale: ar })}
                                </p>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                                <span className="font-black text-sm sm:text-base text-primary font-heading">
                                  {order.totalAmount.toLocaleString()} ج.م
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrder(order);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold"
                                >
                                  عرض الفاتورة
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* BOOKINGS TAB */}
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border-b border-border bg-muted/10 flex justify-between items-center">
                    <div>
                      <h2 className="text-base sm:text-xl font-black text-foreground font-heading">مواعيدي وحجوزات المركز</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">سجل مواعيد تركيب وتجهيز المقصورة</p>
                    </div>
                    <Calendar className="w-6 h-6 text-primary opacity-40 hidden sm:block" />
                  </div>

                  <div className="p-4 sm:p-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="text-base font-black text-foreground mb-1">لا توجد لديك أي حجوزات سابقة</h3>
                        <p className="text-muted-foreground mb-6 text-xs">احجز موعداً لتجهيز سيارتك بأرقى الخامات الألمانية.</p>
                        <Link href="/booking" className="inline-block bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md">
                          احجز موعداً الآن
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            onClick={() => setSelectedBooking(booking)}
                            className="border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/50 transition-all bg-card shadow-sm cursor-pointer select-none"
                          >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-black text-sm text-foreground">
                                    {SERVICE_TYPE_LABELS[booking.serviceType] || booking.serviceType}
                                  </h4>
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border ${getStatusColor(booking.status)}`}>
                                    {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  الموعد: {booking.date ? format(new Date(booking.date), 'dd MMMM yyyy', { locale: ar }) : '—'}
                                  {booking.carType && ` • ${booking.carType} ${booking.carModel || ''}`}
                                </p>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                                <span className="font-black text-sm sm:text-base text-primary font-heading">
                                  {booking.totalAmount > 0 ? `${booking.totalAmount.toLocaleString()} ج.م` : 'يحدد بالمركز'}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBooking(booking);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold"
                                >
                                  التفاصيل
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Interactive Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-foreground">
                      طلب #{selectedOrder.id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {format(new Date(selectedOrder.createdAt), 'dd MMMM yyyy', { locale: ar })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                      <span className="font-bold text-foreground">{item.product?.name || "منتج"} × {item.quantity}</span>
                      <span className="font-black text-primary">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                    </div>
                  ))}
                </div>

                <div className="bg-background p-4 rounded-xl border border-border space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">وسيلة الدفع:</span>
                    <strong className="text-foreground">{PAYMENT_METHOD_LABELS[selectedOrder.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || selectedOrder.paymentMethod}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">حالة السداد:</span>
                    <strong className="text-emerald-600">{PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || selectedOrder.paymentStatus}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-black text-foreground">المبلغ الإجمالي:</span>
                    <strong className="font-black text-sm text-primary font-heading">{selectedOrder.totalAmount.toLocaleString()} ج.م</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-primary text-primary-foreground font-black text-xs rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-foreground">
                      حجز #{selectedBooking.id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {SERVICE_TYPE_LABELS[selectedBooking.serviceType] || selectedBooking.serviceType}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                <div className="bg-background p-4 rounded-xl border border-border space-y-2">
                  <p className="text-muted-foreground">السيارة: <strong className="text-foreground">{selectedBooking.carType} {selectedBooking.carModel}</strong></p>
                  <p className="text-muted-foreground">موعد الحضور: <strong className="text-foreground">{selectedBooking.date ? format(new Date(selectedBooking.date), "yyyy/MM/dd (hh:mm a)", { locale: ar }) : "—"}</strong></p>
                  <p className="text-muted-foreground">طريقة الدفع: <strong className="text-primary font-bold">{PAYMENT_METHOD_LABELS[selectedBooking.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || selectedBooking.paymentMethod}</strong></p>
                  <p className="text-muted-foreground">المبلغ: <strong className="text-primary font-black">{selectedBooking.totalAmount > 0 ? `${selectedBooking.totalAmount.toLocaleString()} ج.م` : "يحدد بالمركز"}</strong></p>
                </div>

                {selectedBooking.notes && (
                  <div className="bg-background p-3.5 rounded-xl border border-border text-xs">
                    <span className="font-bold text-foreground block mb-1">الملاحظات:</span>
                    <p className="text-muted-foreground leading-relaxed">{selectedBooking.notes.replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "").trim()}</p>
                  </div>
                )}

                <a
                  href={`https://wa.me/201008499476?text=${encodeURIComponent(`مرحباً أورجينال، أود الاستفسار عن حجزي رقم #${selectedBooking.id.slice(-6).toUpperCase()}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل عبر واتساب</span>
                </a>
              </div>

              <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2 bg-primary text-primary-foreground font-black text-xs rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

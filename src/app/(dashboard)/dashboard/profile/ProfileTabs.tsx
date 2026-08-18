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
      return "bg-green-500/10 text-green-600 border-green-500/20";
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

      {/* Floating background graphics (Desktop Only) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden lg:block">
        <motion.div 
          animate={{ y: [0, -15, 0], x: [0, 15, 0], opacity: [0.05, 0.2, 0.05] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[5%]"
        >
          <Car className="w-24 h-24 text-primary/30" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, 15, 0], opacity: [0.05, 0.2, 0.05] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] left-[5%]"
        >
          <Wrench className="w-20 h-20 text-accent/30" />
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.3, 0.05] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[20%]"
        >
          <Sparkles className="w-16 h-16 text-primary/40" />
        </motion.div>
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6">
        
        {/* Header Breadcrumbs & Theme Toggle */}
        <div className="flex items-center justify-between mb-6 bg-card/70 backdrop-blur-md p-4 rounded-3xl border border-border/50 shadow-sm">
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-foreground font-bold">حسابي</span>
          </nav>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
            </button>
          )}
        </div>

        {/* Stats Overview Row (Adaptive for Mobile & Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-border shadow-sm flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">إجمالي المشتريات</p>
              <h4 className="text-sm sm:text-lg font-black text-foreground mt-0.5 truncate font-heading">
                {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()} <span className="text-[10px] sm:text-xs font-normal">ج.م</span>
              </h4>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-border shadow-sm flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">عدد الطلبات</p>
              <h4 className="text-sm sm:text-lg font-black text-foreground mt-0.5 truncate font-heading">{orders.length} طلبات</h4>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-border shadow-sm flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">الحجوزات النشطة</p>
              <h4 className="text-sm sm:text-lg font-black text-foreground mt-0.5 truncate font-heading">
                {bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED").length} مواعيد
              </h4>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-border shadow-sm flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">حالة الحساب</p>
              <h4 className="text-sm sm:text-lg font-black text-green-600 mt-0.5 truncate font-heading">نشط وموثق</h4>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Quick Tabs (Shows only on mobile/tablet for effortless switching) */}
        <div className="flex lg:hidden overflow-x-auto gap-2 p-1.5 bg-card/90 backdrop-blur-md rounded-2xl border border-border mb-6 shadow-sm no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[105px] py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all shrink-0 ${
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
          
          {/* Sidebar (Full desktop luxury menu) */}
          <div className="w-full lg:w-1/4 shrink-0 space-y-6">
            
            {/* User Brief Card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border shadow-sm text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient" />
              
              <div className="relative inline-block mb-4 mt-2">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-background shadow-xl mx-auto bg-muted relative z-10 group-hover:scale-105 transition-transform duration-300">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-5 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform z-20 border-2 border-background"
                  title="تغيير الصورة"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-black text-foreground truncate">{name || 'مستخدم جديد'}</h2>
                <p className="text-sm text-muted-foreground truncate mt-1">{email}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  عضو مسجل معتمد
                </div>
              </div>
            </div>

            {/* Desktop Navigation Menu (Preserved in full glory) */}
            <div className="hidden lg:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative">
              <div className="p-5 border-b border-border bg-gradient-to-l from-muted/50 to-transparent">
                <h3 className="font-black text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-primary inline-block"></span>
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
                      className={`flex items-center justify-between w-full p-4 text-right transition-all rounded-xl relative overflow-hidden group ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-foreground/80 hover:bg-muted font-medium'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabIndicator" 
                          className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-xl"
                        />
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-background group-hover:text-primary'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {tab.label}
                      </div>
                      {tab.id === 'orders' && orders.length > 0 && (
                        <span className="bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full font-bold relative z-10 border border-primary/20">{orders.length}</span>
                      )}
                      {tab.id === 'bookings' && bookings.length > 0 && (
                        <span className="bg-accent/20 text-accent text-xs px-2.5 py-1 rounded-full font-bold relative z-10 border border-accent/20">{bookings.length}</span>
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-border bg-muted/10">
                      <h2 className="text-xl font-black text-foreground">إعدادات الحساب</h2>
                      <p className="text-sm text-muted-foreground mt-1">تحديث بياناتك الشخصية ومعلومات التواصل</p>
                    </div>
                    
                    <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-foreground">الاسم بالكامل</label>
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-foreground">البريد الإلكتروني</label>
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                            dir="ltr"
                          />
                          {email !== user.email && (
                            <p className="text-xs text-amber-500 mt-2 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              تغيير البريد يتطلب تأكيد (OTP)
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-bold text-foreground">كلمة المرور الجديدة (اختياري)</label>
                          <input
                            type="password"
                            value={password}
                            placeholder="اترك الحقل فارغاً إذا لم ترد التغيير"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                            dir="ltr"
                          />
                          {password && (
                            <p className="text-xs text-amber-500 mt-2 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              تغيير كلمة المرور يتطلب تأكيد (OTP)
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border">
                        <h3 className="text-lg font-bold text-foreground mb-6">بيانات الشحن والعنوان</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="mb-2 block text-sm font-bold text-foreground">رقم الهاتف</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="مثال: 01012345678"
                              className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left font-mono"
                              dir="ltr"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-bold text-foreground">المحافظة</label>
                            <input
                              type="text"
                              value={governorate}
                              onChange={(e) => setGovernorate(e.target.value)}
                              placeholder="مثال: القاهرة"
                              className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-bold text-foreground">المدينة</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="مثال: مدينة نصر"
                              className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-bold text-foreground">العنوان التفصيلي</label>
                            <textarea
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="اسم الشارع، رقم العمارة، رقم الشقة..."
                              rows={3}
                              className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {otpSent && (
                        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                          <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            يرجى إدخال كود التحقق
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            لقد قمت بتعديل بيانات حساسة. تم إرسال كود (OTP) إلى بريدك الإلكتروني الحالي لتأكيد الهوية.
                          </p>
                          <input
                            type="text"
                            placeholder="أدخل الكود المكون من 6 أرقام"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full max-w-sm rounded-2xl border border-primary/30 bg-background px-4 py-3 text-center text-xl font-bold tracking-widest focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                            maxLength={6}
                          />
                        </div>
                      )}

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={isSaving || isRequestingOtp}
                          className="rounded-2xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                          {(isSaving || isRequestingOtp) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                          {(!otpSent && (email !== user.email || password)) ? "إرسال كود التأكيد (OTP)" : "حفظ التغييرات"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-card rounded-3xl border border-red-500/20 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-red-500/10 bg-red-500/5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-red-500 mb-1">حذف الحساب نهائياً</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                          بمجرد حذف حسابك، لا يمكنك التراجع. سيتم مسح جميع بياناتك الشخصية وسجل طلباتك وحجوزاتك بشكل دائم من خوادمنا.
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      {deleteOtpSent && (
                        <div className="mb-6">
                          <label className="block text-sm font-bold text-foreground mb-2">كود تأكيد الحذف (OTP)</label>
                          <input
                            type="text"
                            placeholder="أدخل الكود المكون من 6 أرقام"
                            value={deleteOtpCode}
                            onChange={(e) => setDeleteOtpCode(e.target.value)}
                            className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-background px-4 py-3 text-center text-xl font-bold tracking-widest focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-2"
                            maxLength={6}
                          />
                          <p className="text-xs text-muted-foreground">تم إرسال كود التحقق إلى بريدك الإلكتروني.</p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || isRequestingOtp}
                        className="rounded-2xl bg-background border-2 border-red-500 text-red-500 px-6 py-3 font-bold transition-all hover:bg-red-500 hover:text-white disabled:opacity-70 flex items-center gap-2"
                      >
                        {(isDeleting || (isRequestingOtp && deleteOtpSent)) ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="p-6 md:p-8 border-b border-border bg-muted/10 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black text-foreground">طلباتي من المتجر</h2>
                      <p className="text-sm text-muted-foreground mt-1">تتبع مراحل تجهيز وشحن طلباتك والاطلاع على الفواتير</p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-primary opacity-30 hidden sm:block" />
                  </div>
                  
                  <div className="p-6 md:p-8">
                    {orders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2">ليس لديك أي طلبات حالياً</h3>
                        <p className="text-muted-foreground mb-8 text-sm">اكتشف منتجاتنا المميزة وأضف لمسة الفخامة لسيارتك.</p>
                        <Link href="/shop" className="inline-block bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-2xl hover:bg-primary/90 transition-all shadow-md">
                          تسوق الآن
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {orders.map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="border border-border rounded-3xl p-6 hover:border-primary/40 transition-all group bg-card shadow-sm cursor-pointer hover:shadow-md select-none"
                          >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm font-black text-foreground" dir="ltr">#{order.id.slice(-8).toUpperCase()}</span>
                                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusColor(order.status)}`}>
                                    {ORDER_STATUS_LABELS[order.status] || order.status}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  تاريخ الطلب: {format(new Date(order.createdAt), 'dd MMMM yyyy (hh:mm a)', { locale: ar })}
                                </p>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-0 border-border">
                                <div className="text-left md:text-right">
                                  <span className="text-xs text-muted-foreground block">الإجمالي</span>
                                  <span className="font-black text-lg text-primary font-heading">{order.totalAmount.toLocaleString()} ج.م</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrder(order);
                                  }}
                                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1.5"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>تفاصيل الفاتورة</span>
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="p-6 md:p-8 border-b border-border bg-muted/10 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black text-foreground">حجوزاتي ومواعيد المركز</h2>
                      <p className="text-sm text-muted-foreground mt-1">سجل مواعيد تركيب وتجهيز المقصورة مع الضمان المعتمد</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary opacity-30 hidden sm:block" />
                  </div>

                  <div className="p-6 md:p-8">
                    {bookings.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                          <Calendar className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2">لا توجد حجوزات سابقة حتى الآن</h3>
                        <p className="text-muted-foreground mb-8 text-sm">احجز موعداً الآن لتجديد وتجهيز مقصورة سيارتك بأفضل الخامات.</p>
                        <Link href="/booking" className="inline-block bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-2xl hover:bg-primary/90 transition-all shadow-md">
                          احجز موعداً الآن
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            onClick={() => setSelectedBooking(booking)}
                            className="border border-border rounded-3xl p-6 hover:border-primary/50 transition-all group bg-card shadow-sm cursor-pointer hover:shadow-md select-none"
                          >
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-black text-lg text-foreground group-hover:text-primary transition-colors">
                                    {SERVICE_TYPE_LABELS[booking.serviceType] || booking.serviceType}
                                  </h4>
                                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusColor(booking.status)}`}>
                                    {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs text-muted-foreground">
                                  <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-foreground mr-1">موعد الحجز:</span>
                                    {format(new Date(booking.date), 'dd MMMM yyyy', { locale: ar })}
                                  </p>
                                  {(booking.carType || booking.carModel) && (
                                    <p className="flex items-center gap-2">
                                      <Car className="w-4 h-4 text-primary" />
                                      <span className="font-bold text-foreground mr-1">المركبة:</span>
                                      {booking.carType} {booking.carModel}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-0.5">مبلغ التقدير</p>
                                  <p className="font-black text-xl text-primary font-heading">{booking.totalAmount > 0 ? `${booking.totalAmount.toLocaleString()} ج.م` : 'يحدد في المركز'}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBooking(booking);
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-black transition-all flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>عرض كامل التفاصيل</span>
                                </button>
                              </div>
                            </div>
                            
                            {booking.notes && (
                              <div className="mt-4 p-4 bg-muted/40 rounded-2xl border border-border/50">
                                <p className="text-xs font-bold text-foreground mb-1">تفاصيل وملاحظات إضافية:</p>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{booking.notes.replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "").trim()}</p>
                              </div>
                            )}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-3xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 md:p-8 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-foreground">
                      تفاصيل الطلب #{selectedOrder.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      تاريخ الطلب: {format(new Date(selectedOrder.createdAt), 'dd MMMM yyyy - hh:mm a', { locale: ar })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 md:p-8 overflow-y-auto space-y-8">
                
                {/* Visual Order Progress Tracker */}
                <div className="bg-muted/20 p-5 sm:p-6 rounded-3xl border border-border space-y-4">
                  <h4 className="text-sm font-black text-foreground">مراحل تتبع الطلب</h4>
                  <div className="grid grid-cols-4 gap-2 text-center relative pt-2">
                    {[
                      { step: 1, title: "تم الطلب", desc: "تم استلام طلبك" },
                      { step: 2, title: "تم التأكيد", desc: "جاري المراجعة" },
                      { step: 3, title: "الشحن والتجهيز", desc: "مع شركة الشحن" },
                      { step: 4, title: "تم التوصيل", desc: "استلمت طلبك" },
                    ].map((s) => {
                      const currentStep = getTimelineStep(selectedOrder.status);
                      const isPastOrCurrent = currentStep >= s.step;
                      return (
                        <div key={s.step} className="flex flex-col items-center relative z-10">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-black mb-2 transition-colors ${
                            isPastOrCurrent 
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                              : "bg-muted text-muted-foreground border border-border"
                          }`}>
                            {isPastOrCurrent ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s.step}
                          </div>
                          <span className="text-[11px] sm:text-xs font-bold text-foreground">{s.title}</span>
                          <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">{s.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    قائمة المنتجات في الفاتورة ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border">
                        <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border flex items-center justify-center">
                          {item.product?.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground opacity-50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm text-foreground truncate">{item.product?.name || "منتج"}</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.price.toLocaleString()} ج.م للقطعة × {item.quantity}
                          </p>
                        </div>
                        <div className="font-black text-sm sm:text-base text-primary font-heading">
                          {(item.price * item.quantity).toLocaleString()} ج.م
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Info Card */}
                  <div className="bg-background p-5 rounded-2xl border border-border space-y-3 text-xs">
                    <h5 className="font-black text-foreground text-sm flex items-center gap-2 border-b border-border/50 pb-2">
                      <Truck className="w-4 h-4 text-primary" />
                      بيانات الشحن والتسليم
                    </h5>
                    <p><strong className="text-muted-foreground">المستلم:</strong> {selectedOrder.user?.name || user.name}</p>
                    <p><strong className="text-muted-foreground">رقم الهاتف:</strong> {selectedOrder.phone || user.phone || 'غير محدد'}</p>
                    <p><strong className="text-muted-foreground">العنوان:</strong> {selectedOrder.address ? selectedOrder.address.replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "").trim() : 'غير محدد'}</p>
                  </div>

                  {/* Payment Info Card */}
                  <div className="bg-background p-5 rounded-2xl border border-border space-y-3 text-xs">
                    <h5 className="font-black text-foreground text-sm flex items-center gap-2 border-b border-border/50 pb-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      طريقة الدفع والحساب
                    </h5>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">وسيلة السداد:</span>
                      <strong className="text-foreground">{PAYMENT_METHOD_LABELS[selectedOrder.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || selectedOrder.paymentMethod}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">حالة الدفع:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                        selectedOrder.paymentStatus === 'PAID'
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border/50">
                      <span className="font-bold text-foreground">الإجمالي النهائي:</span>
                      <strong className="text-primary font-black text-base font-heading">{selectedOrder.totalAmount.toLocaleString()} ج.م</strong>
                    </div>
                  </div>
                </div>

                {/* Direct Order Help via WhatsApp */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-foreground">هل لديك أي استفسار حول هذا الطلب؟</h5>
                      <p className="text-[11px] text-muted-foreground">فريق دعم أورجينال جاهز لمساعدتك عبر واتساب فوراً.</p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/201008499476?text=${encodeURIComponent(`مرحباً أورجينال، لدي استفسار بخصوص طلبي رقم #${selectedOrder.id.slice(-8).toUpperCase()}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm shrink-0 w-full sm:w-auto justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    تواصل مع الدعم عبر واتساب
                  </a>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors text-xs"
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                      تفاصيل الحجز #{selectedBooking.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {SERVICE_TYPE_LABELS[selectedBooking.serviceType] || selectedBooking.serviceType}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
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
                        selectedBooking.status === "CONFIRMED" || selectedBooking.status === "COMPLETED" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        2
                      </div>
                      <span className="text-xs font-bold text-foreground">المعاينة والتركيب</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black mb-1.5 ${
                        selectedBooking.status === "COMPLETED" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground border border-border"
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
                    <p className="text-muted-foreground">نوع السيارة: <strong className="text-foreground">{selectedBooking.carType} {selectedBooking.carModel}</strong></p>
                    <p className="text-muted-foreground">موعد الحضور: <strong className="text-foreground">{selectedBooking.date ? format(new Date(selectedBooking.date), "yyyy/MM/dd (hh:mm a)", { locale: ar }) : "—"}</strong></p>
                    <p className="text-muted-foreground">تاريخ الحجز: <strong className="text-foreground">{format(new Date(selectedBooking.createdAt), "yyyy/MM/dd", { locale: ar })}</strong></p>
                  </div>

                  <div className="bg-background p-4 rounded-2xl border border-border space-y-2">
                    <p className="text-muted-foreground">طريقة الدفع: <strong className="text-primary font-bold">{PAYMENT_METHOD_LABELS[selectedBooking.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || selectedBooking.paymentMethod}</strong></p>
                    <p className="text-muted-foreground">التكلفة: <strong className="text-primary font-black text-sm">{selectedBooking.totalAmount > 0 ? `${selectedBooking.totalAmount.toLocaleString()} ج.م` : "تحدد بالمركز"}</strong></p>
                    <p className="text-muted-foreground">حالة السداد: <strong className="text-emerald-600 font-bold">{PAYMENT_STATUS_LABELS[selectedBooking.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || selectedBooking.paymentStatus}</strong></p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="bg-background p-4 rounded-2xl border border-border text-xs">
                    <span className="font-bold text-foreground block mb-1">الملاحظات المسجلة:</span>
                    <p className="text-muted-foreground leading-relaxed">{selectedBooking.notes.replace(/\[إيصال:\s*https?:\/\/[^\]]+\]/g, "").trim()}</p>
                  </div>
                )}

                {/* Direct Booking Help via WhatsApp */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-foreground">تنسيق الموعد مع المركز</h5>
                      <p className="text-[11px] text-muted-foreground">يمكنك التواصل المباشر مع مهندسينا لتأكيد تجهيز الخامات.</p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/201008499476?text=${encodeURIComponent(`مرحباً أورجينال، لدي استفسار بخصوص حجزي رقم #${selectedBooking.id.slice(-8).toUpperCase()} لخدمة ${SERVICE_TYPE_LABELS[selectedBooking.serviceType] || selectedBooking.serviceType}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm shrink-0 w-full sm:w-auto justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    تواصل عبر واتساب
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border flex justify-end gap-3 bg-muted/10">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-black text-xs rounded-xl shadow-md shadow-primary/20"
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

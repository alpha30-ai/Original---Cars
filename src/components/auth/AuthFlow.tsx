"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Car, 
  Wrench, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthFlow({ initialMode = "login" }: { initialMode?: "login" | "register" | "forgot-password" }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">(initialMode);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const switchMode = (newMode: "login" | "register" | "forgot-password") => {
    setMode(newMode);
    window.history.pushState({}, "", `/${newMode}`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      if (res.error === "unverified") {
        toast.error("حسابك غير مفعل، يتم تحويلك لتأكيد البريد...");
        router.push(`/verify?email=${email}`);
      } else {
        toast.error(res.error);
      }
    } else {
      toast.success("أهلاً بك في أورجينال! تم تسجيل الدخول بنجاح.");
      router.push("/");
      router.refresh();
    }
    setLoginLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ أثناء التسجيل");
      toast.success("تم إنشاء حسابك بنجاح! يرجى تفعيل الحساب برمز التأكيد.");
      router.push(`/verify?email=${regEmail}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ");
      toast.success("تم إرسال كود استعادة كلمة المرور إلى بريدك الإلكتروني");
      router.push(`/reset-password?email=${forgotEmail}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-background" dir="rtl">
      
      {/* Luxury Mesh & Glow Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[140px]" />
      </div>

      {/* Floating Graphic Accents */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden hidden lg:block">
        <motion.div 
          animate={{ y: [0, -15, 0], opacity: [0.05, 0.2, 0.05] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20"
        >
          <Car className="w-28 h-28 text-primary/30" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.05, 0.2, 0.05] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-20"
        >
          <Wrench className="w-24 h-24 text-accent/30" />
        </motion.div>
      </div>

      {/* Main Glassmorphic Auth Card (Comfortable and well-proportioned) */}
      <div className="w-full max-w-5xl relative z-10 flex flex-col md:flex-row bg-card/95 backdrop-blur-2xl rounded-3xl border border-border shadow-2xl overflow-hidden my-6">
        
        {/* Left Side: Brand Story & Perks */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-muted/40 w-[44%] border-l border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span dir="ltr" className="font-black text-3xl tracking-wider text-foreground select-none inline-block">
                  <span className="text-primary">O</span>RIGINAL
                </span>
                <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Luxury Car Care</span>
              </div>
            </Link>

            <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-4 leading-snug">
              {mode === "login" && "مرحباً بك في عالم الفخامة لسيارتك"}
              {mode === "register" && "انضم الآن إلى عملاء أورجينال المتميزين"}
              {mode === "forgot-password" && "استعادة حسابك بسرعة وأمان"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mode === "login" && "سجل دخولك لمتابعة طلباتك، حجوزات تنجيد وتجديد المقصورة، والاطلاع على أحدث منتجات المتجر."}
              {mode === "register" && "أنشئ حسابك للاستمتاع بتجربة تسوق راقية وخدمات تركيب وعناية فائقة بأيدي محترفين."}
              {mode === "forgot-password" && "أدخل بريدك الإلكتروني المسجل وسنرسل لك كود آمن لتحديث كلمة المرور."}
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-border/60">
            <div className="flex items-center gap-3 text-sm font-bold text-foreground">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>ضمان أصلي ومعتمد على كافة الخدمات والمنتجات</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-foreground">
              <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>تشفير كامل وأمان لبياناتك وحسابك</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="flex-1 p-8 sm:p-12 md:p-14 flex flex-col justify-center">
          
          {/* Top Mobile Brand */}
          <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <span dir="ltr" className="font-black text-2xl text-foreground">
                <span className="text-primary">O</span>RIGINAL
              </span>
            </Link>
            <Link href="/" className="text-xs font-bold text-muted-foreground flex items-center gap-1 hover:text-primary">
              الرئيسية <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1.5 bg-muted rounded-2xl mb-8 border border-border">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                mode === "login" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                mode === "register" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* LOGIN FORM */}
            {mode === "login" && (
              <motion.div
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-black text-foreground">تسجيل الدخول</h3>
                  <p className="text-sm text-muted-foreground mt-1">أدخل بريدك الإلكتروني وكلمة المرور للمتابعة</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left font-sans"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-foreground">كلمة المرور</label>
                      <button
                        type="button"
                        onClick={() => switchMode("forgot-password")}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-background border border-border rounded-2xl py-3.5 pl-11 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-6"
                  >
                    {loginLoading ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : "تسجيل الدخول"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* REGISTER FORM */}
            {mode === "register" && (
              <motion.div
                key="register"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <h3 className="text-2xl font-black text-foreground">إنشاء حساب جديد</h3>
                  <p className="text-sm text-muted-foreground mt-1">سجل بياناتك للانضمام إلى منصة أورجينال</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">الاسم الكامل</label>
                    <div className="relative">
                      <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="أحمد محمد"
                        className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left font-sans"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">كلمة المرور</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-background border border-border rounded-2xl py-3.5 pl-11 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                  >
                    {regLoading ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : "تأكيد وإنشاء الحساب"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* FORGOT PASSWORD FORM */}
            {mode === "forgot-password" && (
              <motion.div
                key="forgot-password"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <h3 className="text-2xl font-black text-foreground">استعادة كلمة المرور</h3>
                  <p className="text-sm text-muted-foreground mt-1">أدخل بريدك الإلكتروني لاستلام رمز إعادة التعيين</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">البريد الإلكتروني المسجل</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left font-sans"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-6"
                  >
                    {forgotLoading ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : "إرسال كود الاستعادة"}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="w-full text-center text-xs font-bold text-muted-foreground hover:text-foreground mt-3"
                  >
                    العودة إلى تسجيل الدخول
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

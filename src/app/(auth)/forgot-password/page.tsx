"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowRight, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني");
      } else {
        toast.error(data.error || "حدث خطأ ما");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background selection:bg-primary/30" dir="rtl">
      {/* Right Side - Form (Takes 50% on desktop) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center md:text-right">
            <Link href="/" className="inline-block mb-8">
              <span className="font-black text-3xl text-foreground tracking-tight hover:text-primary transition-colors">أورجينال</span>
            </Link>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">استعادة كلمة المرور</h1>
            </div>
            <p className="text-muted-foreground text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground">البريد الإلكتروني</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-4 pr-12 text-foreground placeholder-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-left"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full relative overflow-hidden bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-primary/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      إرسال رابط الاستعادة <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">تم الإرسال بنجاح!</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                يرجى التحقق من بريدك الإلكتروني ({email}). قد تستغرق الرسالة بضع دقائق للوصول. لا تنسَ تفقد مجلد البريد المزعج (Spam).
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-sm font-bold text-primary hover:underline underline-offset-4"
              >
                حاول باستخدام بريد مختلف
              </button>
            </motion.div>
          )}

          <p className="mt-8 text-center md:text-right text-muted-foreground text-sm">
            تذكرت كلمة المرور؟{" "}
            <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4 transition-all">
              تسجيل الدخول
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Left Side - Image (Takes 50% on desktop, hidden on mobile) */}
      <div className="hidden md:block w-1/2 relative bg-zinc-950 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Car Steering Wheel"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/20 via-transparent to-background" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        
        <div className="absolute bottom-12 right-12 left-12 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 text-white">
          <h2 className="text-2xl font-black mb-2">الأمان أولاً</h2>
          <p className="text-white/80 leading-relaxed">نحن نهتم بأمان حسابك ومعلوماتك. إذا نسيت كلمة المرور، لا تقلق، يمكنك استعادتها بسهولة عبر بريدك الإلكتروني.</p>
        </div>
      </div>
    </div>
  );
}

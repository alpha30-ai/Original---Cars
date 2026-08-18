"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { KeyRound, Lock, Hash, Mail, ArrowRight, ShieldCheck, Sparkles, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "تم تغيير كلمة المرور بنجاح");
        router.push("/login");
      } else {
        toast.error(data.message || "فشل تغيير كلمة المرور");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-foreground">البريد الإلكتروني</label>
        <div className="relative">
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            required
            readOnly={!!defaultEmail}
            className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left read-only:opacity-70 font-sans"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
            placeholder="name@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-foreground">كود الاستعادة (6 أرقام)</label>
        <div className="relative">
          <Hash className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            required
            maxLength={6}
            className="w-full bg-background border border-border rounded-2xl py-3.5 pl-4 pr-11 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-center tracking-[0.5em] font-mono text-xl font-black"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            dir="ltr"
            placeholder="000000"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-foreground">كلمة المرور الجديدة</label>
        <div className="relative">
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            className="w-full bg-background border border-border rounded-2xl py-3.5 pl-11 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            dir="ltr"
            placeholder="••••••••"
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
        disabled={loading || code.length !== 6}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-primary/20"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          "تأكيد وتغيير كلمة المرور"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background relative overflow-hidden" dir="rtl">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 bg-card/95 backdrop-blur-2xl rounded-3xl border border-border shadow-2xl p-8 sm:p-12">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span dir="ltr" className="font-black text-3xl text-foreground tracking-wider select-none inline-block">
              <span className="text-primary">O</span>RIGINAL
            </span>
          </Link>
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-foreground">تعيين كلمة مرور جديدة</h1>
          <p className="text-xs text-muted-foreground mt-1">أدخل الكود المرسل لبريدك الإلكتروني وكلمة المرور الجديدة</p>
        </div>

        <Suspense fallback={<div className="text-center p-8 text-muted-foreground font-bold animate-pulse">جاري التحميل...</div>}>
          <ResetForm />
        </Suspense>

        <p className="mt-8 text-center text-xs text-muted-foreground font-medium">
          <Link href="/login" className="font-bold text-primary hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}

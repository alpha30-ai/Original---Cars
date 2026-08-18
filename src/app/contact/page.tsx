"use client";

import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Loader2,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("استفسار عام");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("تم إرسال رسالتك بنجاح! سيتواصل معك فريق خدمة العملاء قريباً.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 1000);
  };

  const faqs = [
    {
      q: "ما هي مدة تفصيل وتركيب الفرش الكامل للسيارة؟",
      a: "تستغرق عملية تفصيل وتركيب الفرش الكامل بين 24 إلى 48 ساعة كحد أقصى لضمان الدقة وتفصيل المقاعد بالشكل الهندسي الفندقي."
    },
    {
      q: "هل توفرون ضماناً على الخامات والألوان؟",
      a: "نعم، نقدم ضماناً معتمداً يصل إلى 5 سنوات على جلود النابا والجلود الألمانية ضد التقشير وتغير اللون والعيوب المصنعية."
    },
    {
      q: "هل يمكن تفصيل لون وتطريز مخصص لسيارتي؟",
      a: "بالتأكيد! يمكنك اختيار ألوان الجلد، نوع التطريز (Diamond Stitching)، لون الخيوط، وإضافة لوجو سيارتك محفوراً بالليزر أو مطرزاً."
    },
    {
      q: "هل يوجد شحن لكافة المحافظات للمنتجات الجاهزة؟",
      a: "نعم، متجر أورجينال يشحن لجميع محافظات جمهورية مصر العربية مع إمكانية المعاينة قبل الاستلام والدفع عند الاستلام."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden" dir="rtl">
      
      {/* Background Mesh & Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>نحن في خدمتك دائماً</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
            تواصل مع فريق <span className="text-primary">أورجينال</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            نسعد بالإجابة على استفساراتكم، تقديم الاستشارات لاختيار أفضل الخامات لسيارتك، واستقبال مواعيد الحجز والتركيب.
          </p>
        </div>

        {/* Contact Info & Interactive Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contact Details Cards (1 Col) */}
          <div className="space-y-4">
            
            {/* Phone & WhatsApp Card */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-foreground text-base mb-1">الاتصال المباشر والواتساب</h3>
                <p className="text-xs text-muted-foreground mb-4">فريق المبيعات والدعم الفني متواجد لمساعدتك</p>
                <div className="space-y-2">
                  <a 
                    href="https://wa.me/201008499476" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black text-xs hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>محادثة فورية واتساب</span>
                    </div>
                    <span dir="ltr">+20 100 849 9476</span>
                  </a>
                  <a 
                    href="tel:+201008499476" 
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted text-foreground font-bold text-xs hover:bg-muted/80 transition-all border border-border"
                  >
                    <span>اتصال هاتفي مباشر</span>
                    <span dir="ltr">+20 100 849 9476</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-black text-foreground text-base">البريد الإلكتروني</h3>
              <p className="text-xs text-muted-foreground">للاستفسارات العامة والتعاون التجاري</p>
              <p className="font-mono text-xs font-bold text-foreground bg-muted p-3 rounded-xl select-all text-left" dir="ltr">
                info@original-auto.com
              </p>
            </div>

            {/* Working Hours & Location */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-black text-foreground text-base">أوقات العمل في المركز</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                يومياً من السبت إلى الخميس: <strong>10:00 صباحاً - 10:00 مساءً</strong><br />
                الجمعة: <strong>02:00 ظهراً - 10:00 مساءً</strong>
              </p>
              <div className="flex items-center gap-2 text-xs text-foreground font-bold pt-2 border-t border-border/50">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>المركز الرئيسي لفرش السيارات، القاهرة</span>
              </div>
            </div>

          </div>

          {/* Contact Form (2 Cols) */}
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-black text-primary tracking-widest uppercase block mb-1">نموذج التواصل السريع</span>
              <h2 className="text-2xl font-black text-foreground">أرسل استفسارك أو طلبك الخاص</h2>
              <p className="text-xs text-muted-foreground mt-1">سيتواصل معك خبراؤنا عبر الهاتف أو الواتساب خلال دقائق معدودة.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">الاسم بالكامل *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك..."
                    className="w-full bg-background border border-border rounded-2xl py-3.5 px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">رقم الهاتف للتواصل (واتساب) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full bg-background border border-border rounded-2xl py-3.5 px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">البريد الإلكتروني (اختياري)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-background border border-border rounded-2xl py-3.5 px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left font-sans"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">نوع الخدمة أو الاستفسار</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-background border border-border rounded-2xl py-3.5 px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                  >
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="تنجيد وتفصيل كراسي كاملة">تنجيد وتفصيل كراسي كاملة</option>
                    <option value="تجديد تابلوه وأبواب">تجديد تابلوه وأبواب</option>
                    <option value="بطانة سقف ألكانتارا (نجوم)">بطانة سقف ألكانتارا (نجوم)</option>
                    <option value="استفسار عن طلب متجر">استفسار عن طلب متجر</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">تفاصيل الرسالة أو موديل السيارة وملاحظاتك *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب استفسارك بالتفصيل، نوع وموديل سيارتك، والخامات المفضلة لديك..."
                  className="w-full bg-background border border-border rounded-2xl p-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال الرسالة الآن</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* FAQs Section */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-black text-primary tracking-widest uppercase">الأسئلة المتكررة</span>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">إجابات على أكثر الأسئلة شيوعاً</h2>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-border rounded-2xl overflow-hidden bg-background transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-right font-bold text-xs md:text-sm text-foreground flex items-center justify-between gap-4 hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 shrink-0 ${activeFaq === idx ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

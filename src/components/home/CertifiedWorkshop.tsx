"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Award, 
  Crown, 
  Car, 
  MapPin, 
  PhoneCall,
  Send,
  Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const WORKSHOP_STEPS = [
  {
    number: "01",
    title: "المعاينة واختيار الخامات والباترون",
    desc: "جلسة مخصصة لاختيار درجات الجلود الألمانية والألكانتارا ونمط التطريز المناسب لموديل سيارتك.",
    icon: Crown,
  },
  {
    number: "02",
    title: "القص بالليزر والتطريز CNC الرقمي",
    desc: "قص هندسي دقيق بمقاييس ميكرومترية لضمان تطابق تام 100% مع أبعاد كراسي الوكالة.",
    icon: Wrench,
  },
  {
    number: "03",
    title: "خياطة الأمان المعتمدة للوسائد الهوائية",
    desc: "درزات أمان متطورة تضمن سلامتك وانفتاح الوسائد الهوائية (Airbags) في أجزاء من الثانية فور الطوارئ.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "الفحص النهائي وتسليم شهادة الضمان 5 سنوات",
    desc: "تنظيف وتعقيم الكابينة وتفعيل شهادة الضمان الذهبي الموثقة ضد عيوب الصناعة والتقشير.",
    icon: Award,
  }
];

export default function CertifiedWorkshop() {
  const router = useRouter();
  const [carType, setCarType] = useState("");
  const [carModel, setCarModel] = useState("");
  const [serviceType, setServiceType] = useState("UPHOLSTERY");
  const [phone, setPhone] = useState("");

  const handleQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      serviceType,
      carType: carType ? `${carType} ${carModel}`.trim() : "",
      phone,
    }).toString();
    router.push(`/booking?${query}`);
  };

  return (
    <section className="py-16 sm:py-24 bg-card/40 relative overflow-hidden border-t border-border" dir="rtl">
      
      {/* Background Ambiance Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 max-w-7xl space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20">
            <Wrench className="w-4 h-4" />
            <span>مركز الخدمة والتركيب المعتمد</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground font-heading leading-snug">
            أعد هندسة مقصورة سيارتك <span className="text-primary">بأيدي كبار الحرفيين</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed font-medium">
            تجهيز وتجديد مقصورة سيارتك بأحدث التقنيات الألمانية مع شهادة ضمان ذهبي 5 سنوات
          </p>
        </div>

        {/* 4-Step Craftsmanship Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {WORKSHOP_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-black text-primary/80 bg-muted px-2.5 py-1 rounded-lg">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-sm font-black text-foreground font-heading group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-foreground/75 dark:text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Spacious Interactive Workshop Booking Concierge Box */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Form Side (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground font-heading">
                احجز موعد تجهيز فوري بالمركز المعتمد
              </h3>
              <p className="text-xs sm:text-sm text-foreground/75 dark:text-muted-foreground font-medium">
                املأ بيانات سيارتك وسيقوم مسؤول الحجوزات بتجهيز الخامات والباترون المناسب قبل وصولك.
              </p>
            </div>

            <form onSubmit={handleQuickBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">نوع وصانع السيارة</label>
                  <input
                    type="text"
                    required
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    placeholder="مثال: مرسيدس، بي إم، كيا، تويوتا..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">الموديل / سنة الصنع</label>
                  <input
                    type="text"
                    required
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="مثال: C200 - 2024 / سبورتاج 2023..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">نوع التجهيز والخدمة</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-bold cursor-pointer"
                  >
                    <option value="UPHOLSTERY">تنجيد فرش كامل (جلد نابا ألماني)</option>
                    <option value="STARLIGHT_ROOF">سقف ألكانتارا ونجوم رولز رويس</option>
                    <option value="FLOOR_MATS_7D">دواسات جلدية 7D وتفصيل تابلوه</option>
                    <option value="DOORS_STEERING">تفصيل أبواب وطارات وخياطة ليزر CNC</option>
                    <option value="DETAILING_CARE">عناية نانو سيراميك وحماية المقاعد</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">رقم الهاتف / الواتساب</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-bold text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5 shrink-0"
                >
                  <Calendar className="w-4 h-4" />
                  <span>متابعة تأكيد الحجز واختيار الموعد</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <Link
                  href="/ai-assistant"
                  className="w-full sm:w-auto bg-muted hover:bg-muted/80 text-foreground px-6 py-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-border shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>استشارة المساعد الذكي</span>
                </Link>
              </div>
            </form>

          </div>

          {/* Workshop Visual & Concierge Info Card (5 Cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl border border-border min-h-[360px] sm:min-h-[420px] group">
            <img
              src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200"
              alt="Certified Workshop Atelier"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-black px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>متاح استقبال الحجوزات اليوم</span>
            </div>

            <div className="absolute bottom-4 right-4 left-4 sm:bottom-6 sm:right-6 sm:left-6 z-20 bg-black/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl text-white space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-base font-heading">مركز أورجينال المعتمد</h4>
                  <p className="text-[10px] sm:text-[11px] text-zinc-300">القاهرة - العبور - الحي الأول</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> 10:00 ص - 11:00 م
                </span>
                <span className="text-primary font-black">ضمان معتمد 5 سنوات</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

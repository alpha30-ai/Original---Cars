"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  Crown, 
  ShoppingBag, 
  Award, 
  CheckCircle2, 
  Star 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] lg:min-h-[92vh] w-full flex items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-16 select-none bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/60 transition-colors duration-500" dir="rtl">
      
      {/* 1. Dynamic Ambient Light Glows (Harmonized with Theme Primary & Accent) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary Ambient Glow on Top Right */}
        <div className="absolute -top-24 right-0 w-[550px] h-[550px] bg-primary/10 dark:bg-primary/15 rounded-full blur-[140px]" />
        {/* Accent Glow on Bottom Left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 dark:bg-accent/15 rounded-full blur-[140px]" />
        {/* Subtle Luxury Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* 2. Main Hero Content Container */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Right Column: Hero Content & CTAs (7 Cols) */}
          <div className="lg:col-span-7 text-right space-y-6 sm:space-y-7">
            
            {/* Luxury Status Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 sm:gap-2.5 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_currentColor]" />
              <span className="font-black text-xs tracking-wide">
                المركز الأول المعتمد لفرش وتجهيز مقصورات السيارات الفاخرة
              </span>
            </motion.div>

            {/* Powerful Dynamic Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.18] font-heading"
            >
              أعد ابتكار فخامة سيارتك <br />
              <span className="text-primary font-black">بأرقى الخامات الألمانية الأصلية</span>
            </motion.h1>

            {/* High-Contrast Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed font-medium max-w-2xl"
            >
              تنجيد وتجديد كامل للمقاعد بجلود النابا الطبيعية، أسقف ألكانتارا مضيئة بنجوم رولز رويس، وتفصيل دواسات 7D مع خياطة أمان معتمدة للوسائد الهوائية (Airbags Safe) وضمان ذهبي 5 سنوات.
            </motion.p>

            {/* 3 High-Impact Trust Counters (Synchronized with Theme Colors) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 max-w-xl"
            >
              {/* Counter 1 */}
              <div className="bg-card/90 backdrop-blur-xl p-2.5 sm:p-4 rounded-2xl border-2 border-primary/20 shadow-lg shadow-primary/5 text-center flex flex-col justify-center items-center h-full min-h-[72px] sm:min-h-[88px]">
                <span className="block font-black text-sm sm:text-2xl text-primary font-heading whitespace-nowrap">+5,000</span>
                <span className="text-[10px] sm:text-xs text-foreground font-black block mt-0.5 sm:mt-1 truncate w-full">سيارة مجددة</span>
              </div>
              
              {/* Counter 2 */}
              <div className="bg-card/90 backdrop-blur-xl p-2.5 sm:p-4 rounded-2xl border-2 border-primary/20 shadow-lg shadow-primary/5 text-center flex flex-col justify-center items-center h-full min-h-[72px] sm:min-h-[88px]">
                <span className="block font-black text-sm sm:text-2xl text-primary font-heading whitespace-nowrap">100%</span>
                <span className="text-[10px] sm:text-xs text-foreground font-black block mt-0.5 sm:mt-1 truncate w-full">جلود ألمانية</span>
              </div>
              
              {/* Counter 3 */}
              <div className="bg-card/90 backdrop-blur-xl p-2.5 sm:p-4 rounded-2xl border-2 border-primary/20 shadow-lg shadow-primary/5 text-center flex flex-col justify-center items-center h-full min-h-[72px] sm:min-h-[88px]">
                <span className="block font-black text-sm sm:text-2xl text-primary font-heading whitespace-nowrap">5 سنوات</span>
                <span className="text-[10px] sm:text-xs text-foreground font-black block mt-0.5 sm:mt-1 truncate w-full">ضمان ذهبي</span>
              </div>
            </motion.div>
            
            {/* Action CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 pt-2"
            >
              <Link
                href="/booking"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5 group shrink-0"
              >
                <Wrench className="w-4 h-4" />
                <span>احجز موعد تركيب وتجهيز لسيارتك</span>
              </Link>

              <Link
                href="/shop"
                className="w-full sm:w-auto bg-card hover:bg-muted text-foreground border-2 border-border hover:border-primary/40 px-8 py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 group shrink-0"
              >
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>تصفح متجر أورجينال الفاخر</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Quick Micro-Features Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-[11px] sm:text-xs font-bold text-muted-foreground border-t border-border/80"
            >
              <span className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> خياطة متوافقة مع الإيرباج (Airbags)
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> عزل صوتي وحراري فندقي
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> تطريز ليزر CNC دقيق
              </span>
            </motion.div>

          </div>

          {/* Left Column: Visual Supercar Showcase Card with Floating Badges (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-card aspect-[4/3] sm:aspect-[16/12] group"
            >
              {/* Ultra-Luxury Saddle Brown & Nappa Cockpit Image */}
              <img
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200"
                alt="Handcrafted Bespoke Supercar Leather Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Floating Top Badge 1: German Nappa */}
              <div className="absolute top-4 right-4 z-20 bg-card/90 backdrop-blur-xl border border-primary/30 text-foreground text-[11px] font-black px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <span>جلود نابا ألمانية طبيعية</span>
              </div>

              {/* Floating Top Badge 2: Starlight Roof */}
              <div className="absolute top-4 left-4 z-20 bg-purple-950/80 backdrop-blur-xl border border-purple-500/40 text-purple-200 text-[11px] font-black px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>سقف نجوم رولز رويس</span>
              </div>

              {/* Floating Bottom Card: Certified Warranty & Workshop */}
              <div className="absolute bottom-4 right-4 left-4 z-20 bg-card/95 backdrop-blur-xl border-2 border-primary/30 p-4 rounded-2xl shadow-2xl flex items-center justify-between text-right">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black shrink-0 shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-foreground font-heading">
                      ضمان ذهبي موثق 5 سنوات
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold">
                      ضد التقشير وتغير الألوان والعيوب المصنعية
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-2.5 py-1 rounded-xl shrink-0">
                  معتمد 100%
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
}

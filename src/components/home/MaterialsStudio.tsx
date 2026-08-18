"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Crown, 
  Scissors, 
  Award,
  Flame,
  Check
} from "lucide-react";
import Link from "next/link";

const MATERIALS_LIST = [
  {
    id: "nappa",
    name: "جلد نابا ألماني طبيعي (Nappa)",
    tag: "الخامة الأكثر طلباً VIP",
    tagColor: "bg-amber-400 text-black font-black",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800",
    description: "أرقى أنواع الجلود الطبيعية المستوردة من بافاريا، ملمس حريري فائق النعومة ومعالجة نانو ضد الحرارة وتغير الألوان.",
    features: [
      "مقاومة كاملة للأشعة فوق البنفسجية UV",
      "خياطة أمان معتمدة للوسائد الهوائية (Airbags)",
      "مسامية وتبريد مريح في حرارة الصيف",
      "ضمان ذهبي معتمد 5 سنوات"
    ],
    warranty: "5 سنوات ضمان معتمد",
    origin: "ألمانيا 🇩🇪",
    link: "/booking"
  },
  {
    id: "alcantara",
    name: "أسقف ألكانتارا ونجوم رولز رويس",
    tag: "فخامة الملوك VIP",
    tagColor: "bg-purple-600 text-white font-black",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800",
    description: "كسوة سقف وأعمدة السيارة بألكانتارا إيطالية أصلية مع توزيع ألياف ضوئية ذكية بنجوم مضيئة نيزكية وتحكم بالموبايل.",
    features: [
      "أقمشة ألكانتارا إيطالية أصلية 100%",
      "ألياف بصرية ذكية مقاومة للحرارة",
      "تحكم بالريموت وتطبيق الهاتف الذكي",
      "عزل صوتي وحراري إضافي للكابينة"
    ],
    warranty: "3 سنوات ضمان إلكترونيات",
    origin: "إيطاليا 🇮🇹",
    link: "/booking"
  },
  {
    id: "cnc-stitching",
    name: "تطريز ماسي وتفريغ ليزر CNC",
    tag: "دقة هندسية ميكرومترية",
    tagColor: "bg-emerald-500 text-black font-black",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800",
    description: "تطريز مخصص بنقوش هندسية دقيقة بماكينات الليزر CNC وخيوط ماديرا الألمانية المقاومة للاهتراء لدعم تبريد وتدفئة المقاعد.",
    features: [
      "خيوط ماديرا الألمانية فائقة المتانة",
      "نقوش ماسية ولوجوهات مخصصة بالليزر",
      "مطابقة تامة لبترونات ومقاييس الوكالة",
      "تبطين فندقي ميموري فوم عالي الكثافة"
    ],
    warranty: "5 سنوات ضمان الخياطة",
    origin: "ألمانيا 🇩🇪",
    link: "/booking"
  }
];

export default function MaterialsStudio() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-b border-border" dir="rtl">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20">
            <Layers className="w-4 h-4" />
            <span>استوديو الخامات والجلود الأوروبية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground font-heading leading-snug">
            خامات عالمية <span className="text-primary">وحرفية متناهية الدقة</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed font-medium">
            مقارنة دقيقة لأرقى خامات فرش وتجهيز السيارات المعتمدة داخل مركز أورجينال
          </p>
        </div>

        {/* 3 Balanced Symmetric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MATERIALS_LIST.map((mat, idx) => (
            <motion.div
              key={mat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-card rounded-3xl border border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Preview Header with High Contrast Badges */}
              <div>
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <img
                    src={mat.image}
                    alt={mat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <span className={`absolute top-3.5 right-3.5 ${mat.tagColor} text-[10px] sm:text-xs px-3 py-1.5 rounded-xl shadow-xl font-heading`}>
                    {mat.tag}
                  </span>

                  <span className="absolute top-3.5 left-3.5 bg-black/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                    {mat.origin}
                  </span>

                  {/* Guaranteed High-Contrast White Text on Black Backing */}
                  <div className="absolute bottom-3.5 right-3.5 left-3.5 bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center justify-between text-white text-xs font-black shadow-lg">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{mat.warranty}</span>
                    </span>
                    <span className="text-[10px] text-white font-black bg-white/20 px-2 py-0.5 rounded-md">معتمد 100%</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 md:p-7 space-y-4">
                  <h3 className="text-base sm:text-lg font-black text-foreground font-heading group-hover:text-primary transition-colors">
                    {mat.name}
                  </h3>
                  <p className="text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed font-medium">
                    {mat.description}
                  </p>

                  <div className="pt-2 space-y-2.5 border-t border-border/80">
                    <h4 className="text-xs font-black text-foreground">المواصفات الفنية المعتمدة:</h4>
                    <ul className="space-y-2">
                      {mat.features.map((feat, fIdx) => (
                        <li key={fIdx} className="p-2.5 rounded-xl bg-muted/40 border border-border/70 flex items-center gap-2.5 text-xs text-foreground font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-6 pt-0">
                <Link
                  href={mat.link}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <Crown className="w-4 h-4" />
                  <span>طلب تجهيز سيارتك</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

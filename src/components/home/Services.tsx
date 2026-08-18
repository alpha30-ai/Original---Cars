"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Scissors, 
  ShieldCheck, 
  Gem, 
  Crown, 
  Layers, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Award,
  Zap,
  Wrench,
  ShieldAlert
} from "lucide-react";

const whyChooseUsFeatures = [
  {
    icon: Gem,
    badge: "خامات أصلية 100%",
    title: "جلود نابا ألمانية وألكانتارا إيطالية",
    description: "نستورد أرقى جلود النابا الطبيعية والألكانتارا المعتمدة من كبرى المصانع الألمانية والإيطالية المعالجة ضد الحرارة وأشعة الشمس.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-primary",
  },
  {
    icon: Scissors,
    badge: "دقة ليزرية CNC",
    title: "قص هندسي وتفصيل مطابق للوكالة",
    description: "باستخدام أحدث ماكينات القص الرقمي بالليزر CNC، نضمن مطابقة تامة بنسبة 100% لبترونات مقاعد وأبواب سيارتك الأصلية.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: ShieldCheck,
    badge: "أمان متكامل",
    title: "خياطة متوافقة مع الوسائد الهوائية (Airbags)",
    description: "نظام درزات خاص ومختبر بدقة يضمن سلامتك وانفتاح الوسائد الهوائية الجانبية في أجزاء من الثانية فور حدوث أي طارئ لا قدر الله.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Crown,
    badge: "راحة فندقية",
    title: "تبطين طبي عالي الكثافة (Memory Foam)",
    description: "طبقات فوم طبي ميموري عالية الكثافة تدعم العمود الفقري وفقرات الظهر لتوفير تجربة قيادة فندقية فاخرة في السفر الطويل.",
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-500",
  },
  {
    icon: Award,
    badge: "ضمان ذهبي",
    title: "شهادة ضمان معتمدة وموثقة 5 سنوات",
    description: "نقدم ضماناً شاملاً وموثقاً لمدة 5 سنوات ضد عيوب الصناعة أو التقشير أو تغير درجات اللون، مع صيانة دورية مجانية.",
    color: "from-amber-600/20 to-amber-600/5",
    iconColor: "text-primary",
  },
  {
    icon: Sparkles,
    badge: "حرفية استثنائية",
    title: "أسقف ألكانتارا ونجوم رولز رويس",
    description: "تجهيز السقف بالألكانتارا الأصلية وتوزيع ألياف بصرية ذكية بنجوم مضيئة نيزكية مع ريموت وتحكم عبر تطبيق الموبايل.",
    color: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-500",
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-card/50 relative overflow-hidden border-y border-border" dir="rtl">
      
      {/* Ambient Lighting Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20"
          >
            <Crown className="w-4 h-4" />
            <span>معايير الفخامة والجودة الألمانية</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground font-heading leading-tight"
          >
            لماذا يختار أصحاب السيارات الفاخرة <br className="hidden sm:inline" />
            <span className="text-primary">مركز أورجينال؟</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
          >
            نحن لا نقوم فقط بتنجيد المقاعد، بل نعيد هندسة مقصورة سيارتك بالكامل لتصبح تجربة ملوكية تضاهي أفخم السيارات العالمية.
          </motion.p>
        </div>

        {/* 6 High-Prestige Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUsFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-card rounded-3xl p-8 border border-border hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 group relative overflow-hidden"
              >
                {/* Subtle Card Background Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="text-lg font-black text-foreground font-heading group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>معتمد ومطابق لأعلى المواصفات الأوروبية</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

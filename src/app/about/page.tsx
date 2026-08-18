import Link from "next/link";
import { 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Wrench, 
  Award, 
  CheckCircle2, 
  Clock, 
  Car, 
  ArrowLeft,
  Crown,
  Layers,
  HeartHandshake,
  Cpu,
  Scissors,
  CheckCircle,
  Gem,
  Palette,
  Eye
} from "lucide-react";

export const metadata = {
  title: "من نحن | أورجينال لفرش وعناية السيارات الفاخرة",
  description: "تعرف على قصة أورجينال، الشركة الرائدة في تجليد وتنجيد فرش السيارات الفارهة بالجلود الألمانية والإيطالية المعتمدة.",
};

export default function AboutPage() {
  const processSteps = [
    {
      num: "01",
      title: "المسح والرفع ثلاثي الأبعاد 3D",
      desc: "أخذ القياسات الدقيقة لمقاعد وتابلوه السيارة بدقة ملليمترية لضمان تطابق الفرش كأنه الأصلي من المصنع."
    },
    {
      num: "02",
      title: "اختيار جلود النابا والألكانتارا",
      desc: "فحص واختيار أفضل شيتات الجلد الطبيعي الخالية من العيوب، والمعالجة لمقاومة درجات الحرارة والأشعة فوق البنفسجية."
    },
    {
      num: "03",
      title: "القص الدقيق بالليزر CNC",
      desc: "تقطيع باترونات الجلد بواسطة ماكينات الليزر الهندسية لمنع أي تشوه في الحواف وضمان دقة المنحنيات."
    },
    {
      num: "04",
      title: "التطريز الماسي وتفريغ الهواء",
      desc: "حياكة النقوش الماسية (Diamond Stitching) باستخدام خيوط ألمانية شديدة التحمل مع تفريغ الهواء للمقاعد المكيفة."
    },
    {
      num: "05",
      title: "التبطين الإسفنجي عالي الكثافة",
      desc: "دعم المقاعد بإسفنج طبي فندقي عالي الكثافة (Memory Foam) لراحة قصوى أثناء السفر والقيادة الطويلة."
    },
    {
      num: "06",
      title: "التركيب والشد الاحترافي",
      desc: "تثبيت وتلبيس الفرش على الشاسيه الأصلي للمقعد بواسطة فنيين متمرسين مع الحفاظ الكامل على الوسائد الهوائية (Airbags)."
    },
    {
      num: "07",
      title: "الفحص النهائي وشهادة الضمان",
      desc: "مراجعة الجودة من قبل مهندس الجودة، وتطبيق طبقة حماية نانو، وتسليم شهادة الضمان الذهبي لمدة 5 سنوات."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 sm:pt-40 pb-20 sm:pb-28 relative overflow-hidden" dir="rtl">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 md:px-8 max-w-6xl relative z-10 space-y-16 sm:space-y-24">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20 shadow-sm">
            <Crown className="w-4 h-4" />
            <span>قصة الريادة والشغف</span>
          </div>
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-foreground leading-tight font-heading">
            نحن <span className="text-primary">أورجينال</span>، حيث تلتقي الفخامة بالدقة الألمانية
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
            منذ تأسيسنا ونحن نضع معايير جديدة لتجهيز مقصورات السيارات الفارهة وتفصيل الفرش الجلدي بأعلى معايير الإتقان والتطريز الهندسي.
          </p>
        </div>

        {/* Story & Vision Big Card (Optimized for Mobile & Large Screens) */}
        <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-14 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div className="space-y-4 sm:space-y-6">
              <span className="text-xs font-black text-primary tracking-widest uppercase block">رسالتنا ورؤيتنا</span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground leading-snug font-heading">
                إعادة تعريف الراحة والفخامة داخل مقصورة سيارتك
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
                في أورجينال، نؤمن بأن مقصورة سيارتك هي مساحتك الخاصة التي تستحق أرقى أنواع الخامات. لا نعتمد على الحلول الجاهزة، بل نقوم بتفصيل وتصميم الفرش والتابلوه والأسقف يدوياً باستخدام جلود نابا وجلود ألمانية وألكانتارا أصلية تمنحك إحساس الطائرة الخاصة والسيارات الفارهة.
              </p>
              
              {/* 3 High-Trust Counters (Clean Responsive Layout) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="bg-muted/40 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border text-center">
                  <h4 className="font-black text-base sm:text-2xl text-primary mb-0.5 sm:mb-1 font-heading">+10</h4>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold truncate">سنوات خبرة</p>
                </div>
                <div className="bg-muted/40 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border text-center">
                  <h4 className="font-black text-base sm:text-2xl text-primary mb-0.5 sm:mb-1 font-heading">+5,000</h4>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold truncate">سيارة مجددة</p>
                </div>
                <div className="bg-muted/40 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border text-center">
                  <h4 className="font-black text-base sm:text-2xl text-primary mb-0.5 sm:mb-1 font-heading">100%</h4>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold truncate">خامات أصلية</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl relative border border-border aspect-[16/10] sm:aspect-[4/3] group">
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" 
                alt="Original Workshop" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 text-white">
                <span className="text-[10px] sm:text-xs font-bold text-primary block mb-0.5 sm:mb-1 font-heading">الورشة المركزية المعتمدة</span>
                <h3 className="font-black text-sm sm:text-lg">أحدث أجهزة التفصيل والقص بالليزر</h3>
              </div>
            </div>
          </div>
        </div>

        {/* The 7-Step Craftsmanship Process */}
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-primary font-black tracking-widest uppercase text-[11px] sm:text-xs bg-primary/10 px-3.5 sm:px-4 py-1.5 rounded-full border border-primary/20">
              دورة العمل المعتمدة
            </span>
            <h2 className="text-xl sm:text-4xl font-black text-foreground font-heading">
              مراحل التفصيل اليدوي <span className="text-primary">السبعة في أورجينال</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              كل سيارة تدخل مركزنا تمر بـ 7 مراحل فحص وتفصيل صارمة لضمان أعلى معايير الجودة الألمانية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {processSteps.map((step, idx) => (
              <div 
                key={idx} 
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border shadow-sm hover:border-primary/50 transition-all hover:-translate-y-1 space-y-2.5 sm:space-y-3 ${
                  idx === 6 ? "md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/10 via-card to-primary/5 border-primary/30" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground font-black text-xs sm:text-sm flex items-center justify-center font-heading">
                    {step.num}
                  </span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-black text-sm sm:text-base text-foreground font-heading">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars / Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          
          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 sm:space-y-4 hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Crown className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground font-heading">خامات أوروبية معتمدة 100%</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              نستورد مباشرة أفضل جلود النابا الألمانية، الجلود الإيطالية الطبيعية، والألكانتارا المقاومة للحرارة والاهتراء لضمان بقاء الفرش كالجديد لسنوات.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 sm:space-y-4 hover:border-accent/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
              <Wrench className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground font-heading">أيدي حرفية متمرسة</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              فريقنا يضم نخبة من أمهر الفنيين المتخصصين في تفصيل وتنجيد كراسي وأسقف وتابلوهات السيارات الرياضية والفارهة بدقة ملليمترية.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 sm:space-y-4 hover:border-green-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground font-heading">الضمان الذهبي الشامل</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              نقدم شهادة ضمان معتمدة وموثقة تصل إلى 5 سنوات على كافة أعمال التنجيد والفرش والتطريز مع خدمة المتابعة الدورية بعد التركيب.
            </p>
          </div>

        </div>

        {/* CTA Bottom Banner */}
        <div className="bg-gradient-to-l from-primary via-primary/90 to-accent rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-14 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl sm:text-2xl md:text-4xl font-black font-heading">جاهز لتجربة الفخامة لسيارتك؟</h3>
            <p className="text-xs sm:text-sm text-primary-foreground/90 font-medium max-w-xl">
              تصفح متجرنا الحصري أو احجز موعدك الآن مع خبرائنا في المركز المعتمد.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center w-full md:w-auto">
            <Link
              href="/shop"
              className="w-full sm:w-auto text-center bg-white text-black hover:bg-white/90 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg hover:-translate-y-0.5"
            >
              تصفح المتجر
            </Link>
            <Link
              href="/booking"
              className="w-full sm:w-auto text-center bg-black/30 hover:bg-black/40 text-white border border-white/20 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg hover:-translate-y-0.5"
            >
              حجز موعد تنجيد
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

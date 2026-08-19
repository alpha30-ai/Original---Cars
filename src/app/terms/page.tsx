import Link from "next/link";
import { 
  FileText, 
  ShieldCheck, 
  Wrench, 
  Award, 
  RotateCcw, 
  Scale, 
  CreditCard, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Home, 
  Clock, 
  CheckCircle2,
  Crown,
  AlertTriangle,
  Scissors
} from "lucide-react";

export const metadata = {
  title: "الشروط والأحكام | أورجينال لفرش وعناية السيارات الفاخرة",
  description: "تعرف على الشروط والأحكام المنظمة لخدمات تفصيل فرش السيارات، حجوزات المركز، ومبيعات المتجر الإلكتروني في مركز أورجينال.",
};

export default function TermsPage() {
  const lastUpdated = "19 أغسطس 2026";

  const keyGuarantees = [
    {
      icon: Award,
      title: "ضمان ذهبي موثق 5 سنوات",
      desc: "تغطية شاملة ضد عيوب الصناعة، تقشير الجلد، أو تغير درجات الألوان لجميع أعمال الفرش والتفصيل."
    },
    {
      icon: ShieldCheck,
      title: "أمان الوسائد الهوائية (Airbags)",
      desc: "خياطة هندسية معتمدة ومطابقة لمواصفات الأمان لضمان عمل الإيرباج فور الطوارئ دون أي عائق."
    },
    {
      icon: Scale,
      title: "شفافية الأسعار والمواعيد",
      desc: "تسعير واضح ومحدد للخامات قبل البدء مع الالتزام التام بمواعيد التسليم المتفق عليها في المركز."
    }
  ];

  const sections = [
    {
      id: "intro",
      icon: Scale,
      title: "1. مقدمة وقبول الاتفاقية",
      content: [
        "تشكل هذه الشروط والأحكام عقداً قانونياً ملزماً بين العميل ومركز (أورجينال - ORIGINAL Car Upholstery & Luxury Care).",
        "باستخدامك للموقع الإلكتروني أو حجز أي خدمة أو شراء أي منتج، فإنك تقر بموافقتك الكاملة على كافة بنود هذه الاتفاقية وسياسة الخصوصية التابعة لها.",
        "تحتفظ إدارة أورجينال بحق تحديث أو تعديل هذه الشروط في أي وقت، ويسري التعديل فور نشره على هذه الصفحة."
      ]
    },
    {
      id: "services-booking",
      icon: Wrench,
      title: "2. خدمات تفصيل وتنجيد السيارات وحجوزات المركز",
      content: [
        "يتم تأكيد الموعد المحجوز عبر المنصة بعد مراجعة الجدول الزمني للمركز وإبلاغ العميل بتأكيد الحضور عبر الهاتف أو الواتساب.",
        "يتم اختيار الخامات (جلود نابا طبيعية ألمانية، إيطالية، ألكانتارا أصلية، أو أرضيات 7D) ونمط التطريز أثناء جلسة المعاينة الفنية المبدئية.",
        "يلتزم العميل بالحضور في الموعد المحدد، وفي حال التأخر لأكثر من ساعتين دون إخطار مسبق، يحق للمركز إعادة جدولة الموعد بحسب الطاقة الاستيعابية."
      ]
    },
    {
      id: "shop-orders",
      icon: CreditCard,
      title: "3. الطلبات ومبيعات المتجر الإلكتروني والدفع",
      content: [
        "جميع المنتجات المعروضة في المتجر تخضع للمعاينة ومطابقة الموديل لسنة صنع السيارة لضمان دقة المقاسات 100%.",
        "وسائل الدفع المعتمدة تشمل: التحويل عبر إنستاباي (InstaPay)، فودافون كاش، أو الدفع المباشر عند الاستلام في المركز بعد المعاينة.",
        "في حالة الدفع الإلكتروني، يُشترط إرفاق صورة إيصال التحويل واضحة عبر صفحة إتمام الطلب لتأكيد الحجز وبدء التجهيز الفوري."
      ]
    },
    {
      id: "cancellation",
      icon: RotateCcw,
      title: "4. سياسة الإلغاء وتعديل المواعيد والاسترجاع",
      content: [
        "تعديل أو إلغاء الحجز: يمكن للعميل إلغاء أو تعديل موعد الحجز مجاناً قبل 24 ساعة على الأقل من الموعد المحدد.",
        "الطلبات المخصصة والتفصيل الخاص: المنتجات التي تم قصها بالليزر أو تفصيلها بمقاسات أو ألوان مخصصة بطلب العميل تخضع لشروط التعديل والصيانة المجانية بدلاً من الاسترجاع النقدي.",
        "منتجات المتجر الجاهزة: يحق للعميل استبدال أو إرجاع المنتجات الجاهزة غير المستخدمة خلال 14 يوماً من تاريخ الاستلام بشرط بقائها في حالتها وعبوتها الأصلية."
      ]
    },
    {
      id: "warranty",
      icon: Award,
      title: "5. شروط ومحددات الضمان الذهبي (5 سنوات)",
      content: [
        "يغطي الضمان الذهبي المعتمد: عيوب التصنيع، تفكك الخياطة، تقشر الجلد، أو بهتان الألوان الناتج عن عيوب في الخامة الأصلية.",
        "محددات الضمان: لا يغطي الضمان الأضرار الناتجة عن سوء الاستخدام المتعمد، القطع بآلات حادة، الحروق، أو استخدام مواد تنظيف كيميائية كاوية غير معتمدة من المركز.",
        "تلتزم أورجينال بإصلاح أو استبدال أي جزء متضرر خاضع للضمان مجاناً خلال فترة سريان الشهادة."
      ]
    },
    {
      id: "safety",
      icon: ShieldCheck,
      title: "6. معايير السلامة والوسائد الهوائية (Airbags Safe)",
      content: [
        "نلتزم بأعلى معايير الأمان العالمية في خياطة مقاعد السيارات المزودة بوسائد هوائية جانبية (Side Airbags).",
        "تُستخدم خيوط تفريغ أمان خاصة مبرمجة هندسياً لتسمح للوسائد الهوائية بالانفتاح الفوري في أجزاء من الثانية دون أي إعاقة."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 sm:pt-40 pb-20 sm:pb-28 relative overflow-hidden" dir="rtl">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-10 space-y-12 sm:space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground bg-card/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border/60 w-fit">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">الشروط والأحكام</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20 shadow-sm">
            <Crown className="w-4 h-4" />
            <span>الاتفاقية والضمان المعتمد</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground font-heading leading-tight">
            الشروط والأحكام <span className="text-primary">وضمان الجودة</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            توضح هذه الصفحة الحقوق والالتزامات المتبادلة بين مركز <strong>أورجينال</strong> وعملائنا الكرام لضمان أفضل تجربة تفصيل وعناية لسيارتك.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>آخر تحديث معتمد: {lastUpdated}</span>
          </div>
        </div>

        {/* 3 Core Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {keyGuarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-card/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-border hover:border-primary/40 transition-all shadow-sm space-y-2.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm sm:text-base text-foreground font-heading">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Sections Cards */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((sec) => {
            const SecIcon = sec.icon;
            return (
              <div 
                key={sec.id}
                className="bg-card border border-border rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-4 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3.5 border-b border-border/60 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <SecIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base sm:text-xl font-black text-foreground font-heading">
                    {sec.title}
                  </h2>
                </div>

                <ul className="space-y-3 pt-1">
                  {sec.content.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Support & Contact Card */}
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/20 rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-right">
            <h3 className="text-lg sm:text-xl font-black text-foreground font-heading flex items-center justify-center sm:justify-start gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span>هل لديك أي استفسار حول الضمان أو الشروط؟</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              مهندسو وفريق خدمة عملاء أورجينال جاهزون للرد على كافة أسئلتك وتوضيح تفاصيل الضمان وتجهيز مقصورة سيارتك.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center">
            <a
              href="https://wa.me/201008499476?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%AD%D9%88%D9%84%20%D8%A7%D9%84%D8%B4%D8%B1%D9%88%D8%B7%20%D9%88%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85%20%D9%88%D8%A7%D9%84%D8%B6%D9%85%D8%A7%D9%86"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع الدعم عبر واتساب</span>
            </a>
            
            <Link
              href="/booking"
              className="px-6 py-3.5 bg-primary text-primary-foreground font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md w-full sm:w-auto"
            >
              <Wrench className="w-4 h-4" />
              <span>احجز موعد في المركز</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

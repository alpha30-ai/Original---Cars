import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileCheck, 
  UserCheck, 
  Database, 
  Cookie, 
  Mail, 
  MessageCircle, 
  Home, 
  ChevronLeft,
  Sparkles,
  Shield,
  HelpCircle,
  Clock
} from "lucide-react";

export const metadata = {
  title: "سياسة الخصوصية وحماية البيانات | أورجينال لفرش السيارات الفاخرة",
  description: "تعرف على كيفية حماية وتشفير بياناتك الشخصية في مركز أورجينال لفرش وتجهيز مقصورات السيارات الفارهة.",
};

export default function PrivacyPage() {
  const lastUpdated = "19 أغسطس 2026";

  const keyPrinciples = [
    {
      icon: Lock,
      title: "تشفير وأمان البيانات",
      desc: "تشفير تام من طرف إلى طرف (End-to-End Encryption) لكافة كلمات المرور والبيانات الشخصية."
    },
    {
      icon: Eye,
      title: "عدم بيع أو مشاركة البيانات",
      desc: "لا نقوم نهائياً ببيع أو تأجير أو مشاركة بياناتك مع أي طرف ثالث لأغراض إعلانية أو تسويقية."
    },
    {
      icon: UserCheck,
      title: "التحكم الكامل والشفافية",
      desc: "يحق لك في أي وقت تعديل أو تحديث أو طلب الحذف النهائي لحسابك وسجل طلباتك من خوادمنا."
    }
  ];

  const sections = [
    {
      id: "collection",
      icon: Database,
      title: "1. البيانات والمعلومات التي نجمعها",
      content: [
        "المعلومات الشخصية الأساسية: تشمل الاسم، رقم الهاتف، البريد الإلكتروني، وعنوان الشحن عند إنشاء حساب أو إتمام طلب شراء.",
        "بيانات السيارة والحجز: موديل وسنة صنع ونوع سيارتك والخدمة المطلوبة (مثل تفصيل فرش كراسي، سقف ألكانتارا، أو تلميع نانو) لضمان مطابقة المقاسات بدقة.",
        "بيانات إثبات الدفع: إيصالات التحويل البنكي أو المحافظ الإلكترونية (إنستاباي وفودافون كاش) للتحقق اليدوي من سداد الفواتير.",
        "البيانات التقنية: عنوان IP ونوع المتصفح ونظام التشغيل لتحسين أداء المنصة وتأمين الحسابات ضد محاولات الاختراق."
      ]
    },
    {
      id: "usage",
      icon: FileCheck,
      title: "2. كيف نستخدم معلوماتك الشخصية؟",
      content: [
        "معالجة وتأكيد حجوزات تفصيل وتنجيد السيارات وتجهيز الخامات الألمانية المطلوبة في الورشة المركزية.",
        "شحن وتوصيل منتجات المتجر (مثل دواسات 7D وأطقم العناية) إلى عنوانك بدقة.",
        "إرسال إشعارات حالة الطلب ورموز التحقق (OTP) عبر البريد الإلكتروني الموثق.",
        "تقديم الدعم الفني وخدمة ما بعد البيع ومتابعة شهادات الضمان الذهبي الممتد لـ 5 سنوات."
      ]
    },
    {
      id: "security",
      icon: ShieldCheck,
      title: "3. التدابير الأمنية وحماية الخصوصية",
      content: [
        "نعتمد بروتوكولات حماية متقدمة تشمل شهادات تشفير SSL/TLS وخوادم سحابية محمية بأنظمة جدار ناري صارمة.",
        "تشفير كلمات المرور باستخدام خوارزميات التجزئة المتقدمة (Bcrypt / Argon2) بحيث لا يمكن لأي موظف الاطلاع عليها.",
        "تقييد صلاحيات الوصول إلى بيانات العملاء فقط للمهندسين والمشرفين المصرح لهم رسمياً بتنفيذ طلبك."
      ]
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "4. ملفات تعريف الارتباط (Cookies)",
      content: [
        "نستخدم الكوكيز الضرورية للحفاظ على جلسة تسجيل الدخول الآمنة وتذكر تفضيلاتك (مثل اختيار الوضع الليلي أو اللغات).",
        "تساعدنا ملفات تعريف الارتباط في حفظ محتويات سلة التسوق الخاصة بك لتسهيل إتمام الشراء في زيارتك القادمة.",
        "يمكنك التحكم في إعدادات الكوكيز أو تعطيلها عبر متصفحك، مع العلم أن بعض ميزات الموقع قد تتأثر بذلك."
      ]
    },
    {
      id: "rights",
      icon: UserCheck,
      title: "5. حقوق المستخدم والتحكم في الحساب",
      content: [
        "حق الوصول والتعديل: يمكنك تعديل بياناتك الشخصية وعناوينك في أي وقت عبر صفحة (حسابي).",
        "حق الحذف النهائي (Right to be Forgotten): توفر منصة أورجينال خاصية حذف الحساب نهائياً مع إرسال كود OTP تأكيدي لمسح كافة السجلات بضغطة زر.",
        "حق الاعتراض والاستفسار: يمكنك التواصل مع مسؤول حماية البيانات عبر قنوات الدعم المباشرة."
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
          <span className="text-foreground font-bold">سياسة الخصوصية</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs border border-emerald-500/20 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>حماية موثوقة للبيانات والخصوصية</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground font-heading leading-tight">
            سياسة الخصوصية <span className="text-primary">وحماية البيانات</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            في مركز <strong>أورجينال (ORIGINAL)</strong>، نلتزم بأعلى المعايير العالمية في حماية خصوصيتك وسرية بياناتك ومعلومات سيارتك.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>آخر تحديث معتمد: {lastUpdated}</span>
          </div>
        </div>

        {/* 3 Core Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {keyPrinciples.map((item, idx) => {
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
              <span>هل لديك أي استفسار حول سياسة الخصوصية؟</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              فريق الدعم القانوني والفني في أورجينال متواجد على مدار الساعة للإجابة عن كافة أسئلتك وتأكيد حماية بياناتك.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center">
            <a
              href="https://wa.me/201008499476?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%AD%D9%88%D9%84%20%D8%B3%D9%8A%D8%A7%D8%B3%D8%A9%20%D8%A7%D9%84%D8%AE%D8%B5%D9%88%D8%B5%D9%8A%D8%A9%20%D9%88%D8%AD%D9%85%D8%A7%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل عبر واتساب</span>
            </a>
            
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-card hover:bg-muted text-foreground border border-border font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span>صفحة التواصل</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

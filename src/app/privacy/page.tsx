import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <LayoutWrapper>
      <div className="pt-32 pb-20 min-h-screen relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--primary),0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary),0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-black text-foreground mb-6">سياسة الخصوصية</h1>
            <p className="text-lg text-muted-foreground">نحن في أورجينال نأخذ خصوصيتك على محمل الجد. هذه الصفحة توضح كيفية تعاملنا مع بياناتك.</p>
          </div>

          <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden prose prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground max-w-none">
            <h2>1. جمع المعلومات</h2>
            <p>نقوم بجمع المعلومات الشخصية التي تقدمها لنا طواعية عند التسجيل أو الحجز، مثل الاسم، رقم الهاتف، والبريد الإلكتروني، وتفاصيل مركبتك لتتمكن من حجز الخدمات.</p>

            <h2>2. استخدام المعلومات</h2>
            <p>نستخدم معلوماتك لمعالجة حجوزاتك، التواصل معك بخصوص حالة الطلب، وتحسين تجربة المستخدم على المنصة. لن نقوم ببيع أو تأجير معلوماتك لأي جهات خارجية تجارية بأي شكل من الأشكال.</p>

            <h2>3. حماية البيانات</h2>
            <p>نطبق مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية عندما تقوم بإدخال أو إرسال أو الوصول إلى معلوماتك الشخصية. يتم تخزين جميع البيانات في خوادم مؤمنة ومشفرة.</p>

            <h2>4. ملفات تعريف الارتباط (Cookies)</h2>
            <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك، تذكر تفضيلاتك (مثل الوضع المظلم)، ومتابعة الجلسات لضمان عدم الحاجة لتسجيل الدخول في كل مرة تقوم فيها بزيارة الموقع.</p>
            
            <p className="mt-8 text-sm text-muted-foreground/70 text-center">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

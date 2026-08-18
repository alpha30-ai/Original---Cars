import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <LayoutWrapper>
      <div className="pt-32 pb-20 min-h-screen relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--primary),0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary),0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-foreground mb-6">الشروط والأحكام</h1>
            <p className="text-lg text-muted-foreground">توضح هذه الصفحة الشروط والأحكام الخاصة باستخدام منصة وخدمات أورجينال.</p>
          </div>

          <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden prose prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground max-w-none">
            <h2>1. مقدمة</h2>
            <p>مرحباً بك في أورجينال. تشكل هذه الشروط والأحكام اتفاقية قانونية ملزمة بينك وبين منصة أورجينال. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط.</p>

            <h2>2. الحجوزات والخدمات</h2>
            <p>جميع الحجوزات التي تتم عبر الموقع تخضع للتأكيد. يحق لأورجينال تغيير المواعيد أو إلغائها بناءً على ظروف العمل مع إبلاغ العميل مسبقاً. الخامات المستخدمة تعتمد على المخزون المتوفر وفي حالة عدم توفر خامة معينة سيتم اقتراح بدائل مناسبة.</p>

            <h2>3. سياسة الإلغاء والاسترجاع</h2>
            <p>يمكن إلغاء الحجز قبل 24 ساعة على الأقل من الموعد المحدد لاسترداد المبلغ كاملاً (إن وجد). أي إلغاء يتم بعد ذلك قد يكون خاضعاً لرسوم معينة. الضمان الذهبي يغطي عيوب الصناعة والتركيب فقط، ولا يغطي سوء الاستخدام.</p>

            <h2>4. الخصوصية وحماية البيانات</h2>
            <p>نحن نلتزم بحماية بياناتك الشخصية ولن نقوم بمشاركتها مع أي جهة خارجية إلا وفقاً لما تقتضيه القوانين. يرجى مراجعة صفحة سياسة الخصوصية لمزيد من التفاصيل.</p>
            
            <p className="mt-8 text-sm text-muted-foreground/70 text-center">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

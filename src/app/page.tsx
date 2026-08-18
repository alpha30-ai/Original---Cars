import Hero from "@/components/home/Hero";
import MaterialsStudio from "@/components/home/MaterialsStudio";
import Services from "@/components/home/Services";
import CertifiedWorkshop from "@/components/home/CertifiedWorkshop";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import { prisma } from "@/lib/prisma";
import { Product, Category } from "@prisma/client";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  ChevronLeft, 
  Truck, 
  Clock,
  Crown,
  Layers,
  Award,
  Flame,
  Zap,
  Gem,
  Palette,
  Car,
  Bot,
  MessageSquare,
  Scissors,
  Check,
  Shield,
  SlidersHorizontal
} from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  let products: (Product & { category: Category | null })[] = [];
  let categories: Category[] = [];
  
  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      prisma.product.findMany({
        take: 8,
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      }),
      prisma.category.findMany({
        take: 8,
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);
    products = fetchedProducts;
    categories = fetchedCategories;
  } catch (error) {
    console.error("Database connection error on Home page:", error);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col w-full overflow-hidden" dir="rtl">
      
      {/* 1. Dynamic Supercar Atelier Hero Section */}
      <Hero />
      
      {/* 2. Luxury Trust & Craftsmanship Strip */}
      <section className="py-6 sm:py-8 bg-card border-b border-border relative z-20 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-6">
            
            <div className="flex items-center gap-3.5 p-4 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border/60 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Crown className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-foreground font-heading">خامات ألمانية معتمدة 100%</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">جلود نابا طبيعية وألكانتارا أصلية</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border/60 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-foreground font-heading">تفصيل وقص ليزر CNC</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">مطابقة تامة لمقاسات الوكالة</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border/60 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-foreground font-heading">متوافق مع الوسائد الهوائية</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">خياطة أمان معتمدة (Airbags Safe)</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border/60 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-foreground font-heading">ضمان ذهبي 5 سنوات</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">ضد التقشير وتغير الألوان والعيوب</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Realistic Auto Upholstery Categories Showcase (Fixed Grid + Dynamic Sliding Carousel) */}
      <CategoryShowcase categories={categories} />

      {/* 4. Featured Products & Best Sellers Collection */}
      <section className="py-24 bg-muted/20 relative overflow-hidden border-y border-border/60">
        <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-primary font-black tracking-widest uppercase mb-2 block text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> المنتجات الأكثر طلباً في مصر
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground font-heading">
                تشكيلة <span className="text-primary">أورجينال الفاخرة</span>
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">مجموعة مختارة بعناية من أفضل أطقم الفرش والإكسسوارات الفندقية.</p>
            </div>
            
            <Link 
              href="/shop" 
              className="flex items-center gap-2 font-black text-xs text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-primary/20 group shrink-0"
            >
              <span>عرض كامل المتجر ({products.length})</span> 
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-card p-12 text-center rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground font-bold text-xs">لم يتم إضافة منتجات بعد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. Interactive Materials & Craftsmanship Studio (Upgraded) */}
      <MaterialsStudio />

      {/* 6. Dedicated AI Assistant Banner */}
      <section className="py-16 bg-gradient-to-r from-primary/15 via-card to-accent/15 border-y border-border relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xl shadow-primary/30">
              <Bot className="w-9 h-9" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-xl border border-primary/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>مستشارك الفني الذكي</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground font-heading">
                هل تحتاج استشارة لاختيار الفرش الأنسب لسيارتك؟
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                تحدث مع مساعدنا الذكي في صفحة متخصصة للإجابة الفورية عن الخامات، الأسعار، وحساب التكلفة التقريبية.
              </p>
            </div>
          </div>
          <Link
            href="/ai-assistant"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-black text-xs md:text-sm transition-all shadow-xl shadow-primary/20 flex items-center gap-2 shrink-0 hover:-translate-y-0.5"
          >
            <span>استشارة المساعد الذكي AI</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Why Choose Us (Upgraded) */}
      <Services />

      {/* 8. VIP Workshop Booking Concierge Section (Upgraded) */}
      <CertifiedWorkshop />

    </div>
  );
}

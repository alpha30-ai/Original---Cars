import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Truck, 
  Tag as TagIcon, 
  ShoppingCart, 
  Zap, 
  CheckCircle2, 
  Star, 
  ChevronLeft, 
  Info, 
  Package, 
  Store,
  Sparkles,
  Wrench,
  Clock,
  RotateCcw,
  MessageCircle,
  Award,
  Crown,
  Layers,
  Flame,
  ArrowLeft
} from "lucide-react";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductCard from "@/components/shop/ProductCard";
import ProductReviews from "@/components/shop/ProductReviews";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (Smart multi-category fallback)
  let relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {})
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  // If fewer than 4 in same category, supplement with latest active products
  if (relatedProducts.length < 4) {
    const existingIds = [id, ...relatedProducts.map(p => p.id)];
    const additional = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: existingIds }
      },
      take: 4 - relatedProducts.length,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
    relatedProducts = [...relatedProducts, ...additional];
  }

  const allImages = [];
  if (product.imageUrl) allImages.push(product.imageUrl);
  if (product.images && Array.isArray(product.images)) {
    allImages.push(...product.images);
  }
  const uniqueImages = Array.from(new Set(allImages));
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const savings = hasDiscount && product.oldPrice ? product.oldPrice - product.price : 0;

  // Booking URL with full product information
  const bookingUrl = `/booking?serviceType=UPHOLSTERY&productId=${encodeURIComponent(product.id)}&productName=${encodeURIComponent(product.name)}&productPrice=${encodeURIComponent(product.price.toString())}&productImage=${encodeURIComponent(product.imageUrl || (product.images?.[0] || ''))}&productCategory=${encodeURIComponent(product.category?.name || '')}`;

  return (
    <div className="min-h-screen bg-background pb-24 pt-32 sm:pt-36" dir="rtl">
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 md:px-8 mb-6 max-w-7xl">
        <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-card/60 p-3 rounded-2xl border border-border/60 w-fit backdrop-blur-md">
          <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5 text-primary" />
          <Link href="/shop" className="hover:text-primary transition-colors">المتجر</Link>
          {product.category && (
            <>
              <ChevronLeft className="w-3.5 h-3.5 text-primary" />
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronLeft className="w-3.5 h-3.5 text-primary" />
          <span className="text-foreground line-clamp-1 max-w-[240px]">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-16">
        
        {/* Main 2-Column Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Right Column (Col 1-6): Image Gallery & Technical Specs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm overflow-hidden">
              <ProductGallery images={uniqueImages} productName={product.name} />
            </div>

            {/* Automotive Specifications Matrix */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
              <h3 className="font-black text-foreground text-sm flex items-center gap-2 font-heading">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>المواصفات الفنية المعتمدة للمنتج</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-muted/40 p-3 rounded-2xl border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">نوع الخامة:</span>
                  <strong className="text-foreground font-bold">جلد نابا ألماني / ألكانتارا</strong>
                </div>
                <div className="bg-muted/40 p-3 rounded-2xl border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">مقاومة الحرارة:</span>
                  <strong className="text-foreground font-bold">معالجة ضد الأشعة UV</strong>
                </div>
                <div className="bg-muted/40 p-3 rounded-2xl border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">مدة التركيب بالمركز:</span>
                  <strong className="text-foreground font-bold">من 2 إلى 4 ساعات تقريبياً</strong>
                </div>
                <div className="bg-muted/40 p-3 rounded-2xl border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">التوافق:</span>
                  <strong className="text-foreground font-bold">كافة موديلات وفئات السيارات</strong>
                </div>
              </div>

              {/* Guarantees Strip */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-primary/5 p-3 rounded-2xl border border-primary/20 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground text-xs">ضمان أورجينال 5 سنوات</h4>
                    <p className="text-[10px] text-muted-foreground">خامات أوروبية معتمدة</p>
                  </div>
                </div>

                <div className="bg-muted/40 p-3 rounded-2xl border border-border flex items-center gap-2.5">
                  <RotateCcw className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground text-xs">معاينة قبل الاستلام</h4>
                    <p className="text-[10px] text-muted-foreground">مطابقة تامة للمواصفات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column (Col 7-12): Pricing, Details, CTAs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm space-y-6">
              
              {/* Category & Stock Tag */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary bg-primary/10 px-3.5 py-1.5 rounded-xl border border-primary/20">
                  {product.category?.name || "منتجات أورجينال"}
                </span>
                {product.stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl flex items-center gap-1 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> متوفر في المخزون
                  </span>
                ) : (
                  <span className="text-xs font-bold text-destructive bg-destructive/10 px-3 py-1 rounded-xl border border-destructive/20">
                    نفذت الكمية حالياً
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-snug font-heading">
                {product.name}
              </h1>

              {/* Ratings and SKU */}
              <div className="flex flex-wrap items-center gap-4 text-xs pb-2 border-b border-border/80">
                <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-black text-foreground">4.9</span>
                  <span className="text-muted-foreground font-medium">(تقييمات معتمدة)</span>
                </div>
                <div className="text-muted-foreground">
                  كود المنتج: <span className="font-mono font-bold text-foreground">#{product.id.slice(-8).toUpperCase()}</span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/60 space-y-2">
                {hasDiscount && (
                  <div className="bg-rose-500/10 text-rose-500 text-xs font-black px-3 py-1 rounded-lg border border-rose-500/20 inline-block mb-1">
                    وفر الآن {savings.toLocaleString()} ج.م
                  </div>
                )}
                
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground font-heading">{product.price.toLocaleString()}</span>
                  <span className="text-lg font-bold text-primary">ج.م</span>
                  {hasDiscount && (
                    <span className="text-base line-through text-muted-foreground font-bold mr-2">
                      {product.oldPrice?.toLocaleString()} ج.م
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  السعر شامل ضريبة القيمة المضافة وشهادة الضمان الذهبي
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <AddToCartButton 
                  product={JSON.parse(JSON.stringify(product))} 
                  className="w-full h-14 text-sm font-black rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2" 
                />
                
                <Link
                  href={bookingUrl}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground rounded-2xl font-bold text-xs transition-colors border border-border shadow-sm"
                >
                  <Wrench className="w-4 h-4 text-primary" />
                  <span>طلب حجز موعد لتركيب هذا المنتج</span>
                </Link>

                <a
                  href={`https://wa.me/201008499476?text=${encodeURIComponent(`مرحباً أورجينال، أود الاستفسار عن المنتج: ${product.name} (كود: #${product.id.slice(-6).toUpperCase()})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 rounded-2xl font-bold text-xs transition-colors border border-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>استفسار فوري عبر واتساب</span>
                </a>
              </div>

              {/* Delivery and Workshop details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border pt-5 text-xs">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">شحن لكافة المحافظات</div>
                    <div className="text-muted-foreground text-[11px]">توصيل سريع خلال 2 - 4 أيام</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Wrench className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">تركيب احترافي معتمد</div>
                    <div className="text-muted-foreground text-[11px]">بمركز أورجينال بأيدي فنيين</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 border-t border-border pt-5">
                <h3 className="font-black text-foreground text-sm flex items-center gap-2 font-heading">
                  <Info className="w-4 h-4 text-primary" /> وصف وتفاصيل المنتج
                </h3>
                <div className="text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-4 rounded-2xl border border-border/50">
                  {product.description || "خامات فائقة الجودة مصنعة خصيصاً لتناسب مقصورة سيارتك بأعلى دقة وفخامة."}
                </div>
              </div>

              {/* Tags */}
              {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-foreground text-xs">الكلمات الدلالية:</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-muted text-muted-foreground rounded-xl text-xs font-semibold border border-border">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Full-Width Customer Reviews Section (Spanning Full Width of Page) */}
        <div className="w-full pt-6">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="w-full space-y-8 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground font-heading">منتجات وتجهيزات مشابهة</h2>
                <p className="text-xs text-muted-foreground mt-1">اكتشف المزيد من الخامات والتجهيزات الفاخرة لسيارتك</p>
              </div>
              <Link 
                href="/shop" 
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

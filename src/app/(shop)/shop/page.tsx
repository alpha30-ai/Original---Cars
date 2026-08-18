import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  let products: any[] = [];
  let categories: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        categories: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Fallback if no categories exist in the database but products have oldCategory
    if (categories.length === 0) {
      const uniqueOldCats = Array.from(new Set(products.map(p => p.oldCategory).filter(Boolean)));
      categories = uniqueOldCats.map(cat => ({
        id: cat,
        name: cat === 'general' ? 'عام' : cat,
        slug: cat,
        _count: {
          products: products.filter(p => p.oldCategory === cat).length
        }
      }));
    }
  } catch (error) {
    console.error("Database connection error:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Shop Header */}
      <div className="relative pt-32 pb-16 overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2066&auto=format&fit=crop" 
            alt="Luxury Cars"
            className="w-full h-full object-cover opacity-30 grayscale mix-blend-overlay"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-20">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-sm mb-6 border border-white/20 shadow-xl">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="uppercase tracking-widest">متجر أورجينال الفاخر</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
              تصفح <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent">الرفاهية</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-0 font-medium leading-relaxed">
              اكتشف مجموعتنا الحصرية من فرش السيارات الألمانية، جودة استثنائية وتفاصيل متقنة تليق بك.
            </p>
          </div>
        </div>
      </div>

      <div id="shop-products" className="container mx-auto px-6 lg:px-12 py-16">
        <ShopClient products={products} categories={categories} />
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  X, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Tag, 
  Sparkles,
  Grid3X3,
  LayoutGrid,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { CategoryIconRenderer } from "@/lib/categoryIcons";

export default function ShopClient({ products, categories }: { products: any[], categories: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  const quickPills = [
    { label: "جلود نابا ألمانية", query: "نابا" },
    { label: "أسقف ألكانتارا", query: "ألكانتارا" },
    { label: "نانو وحماية", query: "نانو" },
    { label: "إكسسوارات وتابلوه", query: "تابلوه" },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category Filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => 
        p.categoryId === selectedCategory || 
        p.oldCategory === selectedCategory || 
        (p.categories && p.categories.some((c: any) => c.id === selectedCategory || c.slug === selectedCategory || c.name === selectedCategory))
      );
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Stock Filter
    if (stockFilter === "in_stock") {
      filtered = filtered.filter((p) => p.stock > 0);
    } else if (stockFilter === "discount") {
      filtered = filtered.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }

    // Sort By
    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, stockFilter]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start" dir="rtl">
      
      {/* Mobile Filter Button */}
      <div className="lg:hidden w-full flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-primary/20"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>تصفية النتائج ({filteredProducts.length})</span>
        </button>

        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="newest">الأحدث أولاً</option>
            <option value="price_asc">السعر: من الأقل</option>
            <option value="price_desc">السعر: من الأعلى</option>
          </select>
        </div>
      </div>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Filter Sidebar */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-card border-l border-border transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-72 lg:bg-card/70 lg:backdrop-blur-md lg:rounded-3xl lg:border lg:p-6 p-6 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } overflow-y-auto shrink-0 shadow-sm`}
      >
        <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b border-border">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
            <SlidersHorizontal className="w-5 h-5 text-primary" /> تصفية المتجر
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Search Box */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">بحث في المنتجات</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو المواصفات..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-3 pr-10 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">حالة العرض</h3>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-xl">
              {[
                { id: "all", label: "الكل" },
                { id: "in_stock", label: "المتوفر" },
                { id: "discount", label: "الخصومات" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStockFilter(tab.id)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all text-center ${
                    stockFilter === tab.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">أقسام وتصنيفات المتجر</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-right px-3.5 py-2.5 rounded-xl transition-all font-bold text-xs flex items-center justify-between ${
                  selectedCategory === "all" 
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>جميع الأقسام</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const catId = cat.id || cat.slug || cat.name;
                const isSelected = selectedCategory === catId || selectedCategory === cat.slug || selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(catId)}
                    className={`text-right px-3.5 py-2.5 rounded-xl transition-all font-bold text-xs flex items-center justify-between ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <CategoryIconRenderer imageUrl={cat.imageUrl} slug={cat.slug} name={cat.name} className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.name}</span>
                    </span>
                    {cat._count?.products !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                        {cat._count.products}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== "all" || searchQuery || stockFilter !== "all" || sortBy !== "newest") && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setStockFilter("all");
                setSortBy("newest");
              }}
              className="w-full text-xs font-bold text-destructive hover:bg-destructive/10 py-2.5 rounded-xl transition-colors border border-destructive/20"
            >
              إعادة ضبط الفلاتر
            </button>
          )}

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Quick Keyword Search Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> كلمات شائعة:
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill.query}
              onClick={() => setSearchQuery(pill.query)}
              className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary transition-colors shadow-sm"
            >
              #{pill.label}
            </button>
          ))}
        </div>

        {/* Desktop Sorting Bar */}
        <div className="hidden lg:flex items-center justify-between bg-card p-4 rounded-3xl border border-border shadow-sm">
          <div className="text-xs font-bold text-muted-foreground">
            تم العثور على <span className="font-black text-foreground mx-1 text-sm font-heading">{filteredProducts.length}</span> منتج متوفر
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> ترتيب حسب:
            </span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="newest">الأحدث إضافتاً</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-card p-16 text-center rounded-3xl border border-dashed border-border shadow-sm flex flex-col items-center justify-center py-24">
            <Search className="w-14 h-14 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-black text-foreground mb-2 font-heading">لا توجد منتجات مطابقة لخيارات البحث</h2>
            <p className="text-xs text-muted-foreground max-w-sm mb-6">
              جرب تغيير كلمة البحث أو اختيار تصنيف مختلف لعرض المزيد من المنتجات.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setStockFilter("all");
              }}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              عرض جميع المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

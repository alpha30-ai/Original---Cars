"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@prisma/client";
import { CategoryIconRenderer } from "@/lib/categoryIcons";
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 sm:py-20 bg-background relative z-10">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="bg-card p-10 sm:p-12 rounded-3xl border border-dashed border-border max-w-md mx-auto">
            <p className="text-muted-foreground font-bold text-xs sm:text-sm">جاري إضافة وتجهيز أقسام المتجر قريباً.</p>
          </div>
        </div>
      </section>
    );
  }

  // Split categories: top 4 featured (fixed grid) & all categories (sliding carousel)
  const featuredCategories = categories.slice(0, 4);

  // Automatic continuous self-scrolling
  useEffect(() => {
    if (categories.length <= 4 || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // In RTL, scrollLeft can be negative or positive depending on browser implementation
        if (Math.abs(container.scrollLeft) >= maxScroll - 5) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: -260, behavior: "smooth" });
        }
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [categories.length, isPaused]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-background relative z-10 border-b border-border/60" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-10 sm:space-y-12 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <span className="text-primary font-black tracking-widest uppercase text-[11px] sm:text-xs bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الأقسام والتصنيفات المتخصصة</span>
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground font-heading">
              اكتشف <span className="text-primary">أقسام تجهيز وفرش سيارتك</span>
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
              تصفح التشكيلات الراقية لفرش السيارات، الجلود الألمانية، أسقف الألكانتارا، ودواسات 7D الفاخرة.
            </p>
          </div>

          <Link
            href="/shop"
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-black text-xs sm:text-sm text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-primary/20 shrink-0 group"
          >
            <span>تصفح جميع الأقسام ({categories.length})</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 1. Fixed Core Categories Grid (الجزء الثابت) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {featuredCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <Link 
                href={`/shop?category=${cat.slug}`} 
                className="group flex flex-col items-center text-center p-4 sm:p-7 rounded-3xl bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full justify-between"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center relative shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border border-primary/20 mb-3 sm:mb-4 shrink-0">
                  <CategoryIconRenderer imageUrl={cat.imageUrl} slug={cat.slug} name={cat.name} className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                
                <div className="space-y-1 w-full">
                  <h3 className="font-black text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors font-heading truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center justify-center gap-1 font-bold group-hover:text-foreground">
                    <span>تصفح المنتجات</span>
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 2. Self-Scrolling Slider for All Categories (الجزء المتحرك تلقائياً بدون شريط تمرير) */}
        {categories.length > 4 && (
          <div className="space-y-3.5 pt-6 border-t border-border/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-foreground font-heading flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>المزيد من التجهيزات والأقسام المتخصصة:</span>
              </h3>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => scroll("right")}
                  aria-label="Previous categories"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border flex items-center justify-center transition-colors shadow-sm text-foreground active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("left")}
                  aria-label="Next categories"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border flex items-center justify-center transition-colors shadow-sm text-foreground active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hidden Scrollbar Container with Auto-Scroll and Pause-on-Hover */}
            <div
              ref={scrollContainerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((cat) => (
                <Link
                  key={`scroll-${cat.id}`}
                  href={`/shop?category=${cat.slug}`}
                  className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card hover:bg-muted/40 border border-border hover:border-primary/40 shadow-sm transition-all shrink-0 min-w-[210px] sm:min-w-[240px] group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <CategoryIconRenderer imageUrl={cat.imageUrl} slug={cat.slug} name={cat.name} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-xs sm:text-xs text-foreground font-heading group-hover:text-primary transition-colors truncate">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                      <span>عرض التشكيلة</span>
                      <ArrowLeft className="w-2.5 h-2.5 group-hover:-translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

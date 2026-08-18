"use client";

import Link from "next/link";
import { Zap, Star, ShoppingBag, Eye, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, index = 0 }: { product: any; index?: number }) {
  const displayImage = product.imageUrl || (product.images && product.images[0]) || null;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  
  const discountPercentage = hasDiscount 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      className="group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col hover:-translate-y-1.5"
    >
      {/* Top Badges */}
      <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 z-20 pointer-events-none">
        {hasDiscount && (
          <div className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md backdrop-blur-md">
            خصم {discountPercentage}%
          </div>
        )}
        {product.stock <= 0 ? (
          <div className="bg-background/90 text-destructive text-[10px] font-black px-2.5 py-1 rounded-xl border border-destructive/30 backdrop-blur-md shadow-sm">
            نفذت الكمية
          </div>
        ) : product.stock <= 5 ? (
          <div className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md">
            متبقي {product.stock} فقط
          </div>
        ) : null}
      </div>

      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
        <div className="bg-background/90 text-primary text-[10px] font-black px-2.5 py-1 rounded-xl shadow-sm border border-primary/20 backdrop-blur-md flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>أصلي معتمد</span>
        </div>
      </div>
      
      {/* Full-width Image Area (Fills upper card completely from edge to edge without cutting product) */}
      <div className="relative w-full aspect-[16/11] sm:aspect-[4/3] bg-muted/30 overflow-hidden flex items-center justify-center">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" />
        
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={product.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 z-0" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2 bg-muted/20">
            <ShoppingBag className="w-12 h-12" />
            <span className="font-bold text-xs">لا توجد صورة للمنتج</span>
          </div>
        )}

        {/* Subtle Vignette on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center z-10">
          <span className="bg-card text-foreground font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-border transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-4 h-4 text-primary" /> معاينة وتفاصيل المنتج
          </span>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10 bg-card border-t border-border/60">
        
        {/* Category Tag */}
        {product.category && (
          <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg w-fit mb-2">
            {product.category.name}
          </span>
        )}

        <h3 className="text-foreground text-sm font-black leading-snug mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors font-heading">
          <Link href={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-black text-foreground">4.9</span>
          <span className="text-[11px] text-muted-foreground font-medium">(أعلى تقييم موثق)</span>
        </div>
        
        <div className="mt-auto flex flex-col gap-3 pt-3 border-t border-border/60">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-foreground font-heading">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-primary">ج.م</span>
            </div>

            {hasDiscount && (
              <span className="text-xs line-through text-muted-foreground font-semibold">
                {product.oldPrice.toLocaleString()} ج.م
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <div className="relative z-20 w-full">
            <AddToCartButton 
              product={product} 
              className="w-full py-3 rounded-2xl font-black text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:shadow-lg active:scale-98"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

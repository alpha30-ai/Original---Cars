"use client";

import { useCart } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck, Sparkles, RefreshCw, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, totalAmount, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-16 flex flex-col items-center justify-center px-4" dir="rtl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-28 h-28 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 border border-primary/20 shadow-inner"
        >
          <ShoppingBag className="w-14 h-14" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">سلة المشتريات فارغة</h1>
        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md text-center leading-relaxed">
          لم تقم بإضافة أي منتجات إلى سلتك بعد. استكشف مجموعتنا الفاخرة من فرش السيارات والجلود الألمانية والإكسسوارات.
        </p>
        <Link
          href="/shop"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5"
        >
          <span>تصفح المتجر الآن</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20" dir="rtl">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-border gap-4">
          <div>
            <span className="text-primary font-black text-xs tracking-widest uppercase mb-1 block">حقيبة التسوق</span>
            <h1 className="text-3xl font-black text-foreground">سلة المشتريات ({totalItems} منتج)</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/shop" 
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted px-4 py-2 rounded-xl transition-colors"
            >
              <ArrowRight className="w-4 h-4" /> متابعة التسوق
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> إفراغ السلة
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const displayImage = item.product.imageUrl || (item.product.images && item.product.images[0]);
                
                return (
                  <motion.div
                    layout
                    key={item.product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 md:p-6 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-center group relative overflow-hidden"
                  >
                    <Link 
                      href={`/product/${item.product.id}`} 
                      className="w-full sm:w-28 h-28 bg-muted rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-border group-hover:scale-105 transition-transform"
                    >
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
                      )}
                    </Link>

                    <div className="flex-1 flex flex-col justify-between w-full">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-bold text-foreground text-base hover:text-primary transition-colors line-clamp-1">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.product.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-black text-primary text-base">
                              {item.product.price.toLocaleString()} <span className="text-[10px] text-muted-foreground">ج.م</span>
                            </span>
                            {item.product.oldPrice && item.product.oldPrice > item.product.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                {item.product.oldPrice.toLocaleString()} ج.م
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground hover:text-destructive p-2 rounded-xl hover:bg-destructive/10 transition-colors"
                          title="حذف المنتج من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border border-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-card rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 flex items-center justify-center bg-card rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-sm disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-left">
                          <span className="text-[10px] text-muted-foreground block">المجموع الفرعي</span>
                          <span className="text-sm font-black text-foreground">
                            {(item.quantity * item.product.price).toLocaleString()} ج.م
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-foreground">ملخص الحساب</h2>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>المجموع الفرعي ({totalItems} قطع)</span>
                  <span className="font-bold text-foreground text-sm">{totalAmount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>رسوم التوصيل والشحن</span>
                  <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">مجاناً</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>الضمان الذهبي (شامل)</span>
                  <span className="font-bold text-foreground">مجاناً</span>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground block">المبلغ الإجمالي</span>
                    <span className="text-2xl font-black text-primary">
                      {totalAmount.toLocaleString()} <span className="text-xs">ج.م</span>
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-sm flex justify-center items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>متابعة الشراء وإنهاء الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* Guarantees List */}
              <div className="pt-6 border-t border-border/60 space-y-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>دفع آمن ومعتمد (إنستا باي - فودافون كاش - عند الاستلام)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-primary shrink-0" />
                  <span>إمكانية الاسترجاع والاستبدال خلال 14 يوماً</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-primary shrink-0" />
                  <span>شحن سريع ومعاينة المنتج قبل الاستلام</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

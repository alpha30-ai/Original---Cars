"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cartStore";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (product.stock <= 0) {
      toast.error("هذا المنتج غير متوفر حالياً");
      return;
    }
    addToCart(product);
    toast.success(`تمت إضافة "${product.name}" إلى السلة`);
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent navigating if wrapped in a link/card logic
        handleAdd();
      }}
      disabled={product.stock <= 0}
      className={`bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/20 ${className || 'flex-1 px-8 py-4 text-lg'}`}
    >
      <ShoppingCart className={className ? "w-5 h-5" : "w-6 h-6"} />
      أضف للسلة
    </button>
  );
}

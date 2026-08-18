import ProductCard from "@/components/shop/ProductCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductSlider({ title, products, link }: { title: string, products: any[], link: string }) {
  return (
    <section className="py-8 bg-background mb-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <Link href={link} className="bg-muted text-foreground px-4 py-2 rounded text-sm font-bold hover:bg-border transition-colors flex items-center gap-2">
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Horizontal Slider */}
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4">
          {products.map((product) => (
            <div key={product.id} className="w-[180px] md:w-[220px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

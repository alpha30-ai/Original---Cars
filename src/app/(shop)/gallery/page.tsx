"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ZoomIn, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Car, 
  Wrench, 
  ArrowLeft,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Crown,
  Search
} from "lucide-react";
import Link from "next/link";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  createdAt?: string;
}

const GALLERY_CATEGORIES = [
  { id: "ALL", label: "كافة الأعمال" },
  { id: "SEATS", label: "تنجيد المقاعد والكراسي" },
  { id: "ROOF", label: "أسقف ألكانتارا مضيئة" },
  { id: "DASHBOARD", label: "تجديد التابلوه والأبواب" },
  { id: "NANO", label: "حماية ونانو سيراميك" },
];

export default function PublicGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery?active=true");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch) return false;
      }
      return true;
    });
  }, [items, searchQuery]);

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(filteredItems[selectedIndex + 1]);
    } else {
      setSelectedIndex(0);
      setSelectedImage(filteredItems[0]);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(filteredItems[selectedIndex - 1]);
    } else {
      setSelectedIndex(filteredItems.length - 1);
      setSelectedImage(filteredItems[filteredItems.length - 1]);
    }
  };

  return (
    <main className="min-h-screen bg-background font-sans pt-36 sm:pt-44 pb-28 relative overflow-hidden" dir="rtl">
      
      {/* Background Lighting Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20 shadow-sm">
            <Crown className="w-4 h-4" />
            <span>معرض الإبداع والفخامة المعتمد</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground leading-tight font-heading">
            معرض أعمال <span className="text-primary">أورجينال الحصرية</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
            استعرض أحدث التحف الفنية المنفذة داخل ورشتنا المركزية: تنجيد جلود نابا، بطانات ألكانتارا، وتجديد المقصورات بأعلى دقة فندقية.
          </p>
        </div>

        {/* Categories Bar & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 sm:p-5 rounded-3xl border border-border shadow-sm">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث في الأعمال أو نوع السيارة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border border-border rounded-2xl pl-4 pr-10 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
            />
          </div>

          {/* Quick Stats & Booking CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-bold text-muted-foreground">
              عرض <strong className="text-foreground font-black font-heading">{filteredItems.length}</strong> عمل منفذ
            </span>
            <Link
              href="/booking"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>طلب تنفيذ لسيارتك</span>
            </Link>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-xs font-bold text-muted-foreground">جاري تحميل معرض الأعمال الفاخرة...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
            <Car className="w-14 h-14 opacity-30 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-xl font-black text-foreground mb-1 font-heading">لا توجد أعمال مطابقة للبحث</h3>
            <p className="text-xs text-muted-foreground">جرب البحث بكلمات أخرى أو عرض كامل المعرض.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                onClick={() => openLightbox(item, index)}
                className="group cursor-pointer bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col relative"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn className="w-6 h-6" />
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/10">
                    أورجينال VIP
                  </span>
                </div>

                {/* Details Footer */}
                <div className="p-5 flex flex-col flex-1 justify-between bg-card">
                  <div>
                    <h3 className="font-black text-foreground text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1 font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description || "تنفيذ وتفصيل فرش جلدي فائق الفخامة وتجديد كامل للمقصورة."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-primary font-bold">
                    <span>عرض التفاصيل والصورة</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6" dir="rtl">
            
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={closeLightbox} />

            {/* Top Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 left-6 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left/Right Nav Arrows */}
            <button
              onClick={prevImage}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 sm:p-4 rounded-full backdrop-blur-md transition-colors"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={nextImage}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 sm:p-4 rounded-full backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Modal Content Box */}
            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-card rounded-3xl border border-border shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row pointer-events-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Left */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center p-4 relative min-h-[300px] md:min-h-[500px]">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="max-h-[70vh] w-full object-contain rounded-2xl"
                />
                <span className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-mono">
                  {selectedIndex + 1} / {filteredItems.length}
                </span>
              </div>

              {/* Details Right */}
              <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-card">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>عمل منفذ في أورجينال</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-foreground leading-snug font-heading">
                    {selectedImage.title}
                  </h2>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {selectedImage.description || "تم تنفيذ هذا العمل باستخدام أجود جلود النابا مع خياطة وتطريز ألماني دقيق يبرز جمالية المقصورة."}
                  </p>

                  <div className="pt-4 border-t border-border space-y-2 text-xs text-foreground font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>خامات مستوردة وضمان شامل 5 سنوات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>قص بالليزر وتفصيل هندسي CNC</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border mt-6">
                  <Link
                    href={`/booking?serviceType=UPHOLSTERY&notes=${encodeURIComponent(`أرغب في تنفيذ عمل لسيارتي مثل: ${selectedImage.title}`)}`}
                    onClick={closeLightbox}
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <span>احجز موعد لسيارتك مثل هذا العمل</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </main>
  );
}

"use client";

import { useState } from "react";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] lg:aspect-square bg-muted relative flex items-center justify-center rounded-3xl border border-dashed border-border shadow-inner">
        <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
          <ImageIcon className="w-16 h-16 opacity-30" />
          <span className="font-bold text-xl tracking-wide">لا توجد صورة للمنتج</span>
        </div>
      </div>
    );
  }

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <div className="w-full aspect-[4/3] lg:aspect-square bg-card relative rounded-3xl border border-border shadow-md overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative flex items-center justify-center p-0"
          >
            {/* Ambient Background Glow */}
            <div 
              className="absolute inset-0 opacity-40 blur-3xl scale-110 transition-all duration-1000 z-0"
              style={{
                backgroundImage: `url(${images[currentIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <img
              src={images[currentIndex]}
              alt={`${productName} - صورة ${currentIndex + 1}`}
              className="w-full h-full object-cover relative z-10"
            />
            
            {/* Optional gradient overlay for text/UI contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-white hover:text-black w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-white hover:text-black w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all snap-start group/thumb ${
                currentIndex === idx 
                ? "border-primary shadow-lg ring-4 ring-primary/20 scale-105" 
                : "border-transparent opacity-60 hover:opacity-100 bg-muted"
              }`}
            >
              <img src={img} alt={`صورة مصغرة ${idx + 1}`} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

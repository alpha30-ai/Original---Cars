import React from "react";
import { 
  Car, 
  Sofa, 
  Scissors, 
  Layers, 
  Wrench, 
  Sparkles, 
  SprayCan, 
  Shield, 
  Crown, 
  Gem, 
  Gauge, 
  Zap, 
  Flame, 
  Star, 
  Award, 
  Key, 
  Navigation, 
  Cpu, 
  Music, 
  Fan, 
  Palette, 
  Shirt, 
  ShoppingBag, 
  Package, 
  Tag, 
  BatteryCharging, 
  Settings,
  LucideIcon
} from "lucide-react";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Car,
  Sofa,
  Scissors,
  Layers,
  Wrench,
  Sparkles,
  SprayCan,
  Shield,
  Crown,
  Gem,
  Gauge,
  Zap,
  Flame,
  Star,
  Award,
  Key,
  Navigation,
  Cpu,
  Music,
  Fan,
  Palette,
  Shirt,
  ShoppingBag,
  Package,
  Tag,
  BatteryCharging,
  Settings,
};

export function getCategoryIconName(imageUrl: string | null | undefined, slug?: string, name?: string): string {
  if (imageUrl && imageUrl.startsWith("icon:")) {
    const raw = imageUrl.replace("icon:", "").trim();
    if (CATEGORY_ICON_MAP[raw]) return raw;
  }
  
  // Smart keyword mapping fallback
  const text = `${slug || ""} ${name || ""}`.toLowerCase();
  if (text.includes("nappa") || text.includes("نابا") || text.includes("جلد")) return "Layers";
  if (text.includes("alcantara") || text.includes("ألكانتارا") || text.includes("سقف") || text.includes("نجوم")) return "Sparkles";
  if (text.includes("7d") || text.includes("دواسات") || text.includes("أرضيات")) return "Car";
  if (text.includes("dashboard") || text.includes("تابلوه") || text.includes("طارة") || text.includes("أبواب")) return "Gauge";
  if (text.includes("ambient") || text.includes("إضاءة") || text.includes("ليد")) return "Zap";
  if (text.includes("carbon") || text.includes("كاربون")) return "Cpu";
  if (text.includes("nano") || text.includes("نانو") || text.includes("سيراميك")) return "SprayCan";
  if (text.includes("care") || text.includes("عناية") || text.includes("حماية") || text.includes("منظفات")) return "Shield";
  if (text.includes("vip") || text.includes("ملكي") || text.includes("فاخر")) return "Crown";
  if (text.includes("تطريز") || text.includes("ليزر") || text.includes("خياطة") || text.includes("تفصيل")) return "Scissors";

  return "Sofa";
}

export function CategoryIconRenderer({ 
  imageUrl, 
  slug, 
  name, 
  className = "w-6 h-6" 
}: { 
  imageUrl?: string | null; 
  slug?: string; 
  name?: string; 
  className?: string 
}) {
  if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("/"))) {
    return (
      <img 
        src={imageUrl} 
        alt={name || "Category"} 
        className={`${className} object-cover rounded-xl`} 
      />
    );
  }

  const iconName = getCategoryIconName(imageUrl, slug, name);
  const IconComponent = CATEGORY_ICON_MAP[iconName] || Sofa;
  return <IconComponent className={className} />;
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_REALISTIC_CATEGORIES = [
  {
    name: "فرش جلود نابا طبيعي ألماني",
    slug: "german-nappa-leather",
    imageUrl: "icon:Layers",
    isActive: true,
  },
  {
    name: "أسقف ألكانتارا ونجوم رولز رويس",
    slug: "alcantara-starlight-headliner",
    imageUrl: "icon:Star",
    isActive: true,
  },
  {
    name: "تجديد وتفصيل التابلوه والأبواب",
    slug: "dashboard-door-panels",
    imageUrl: "icon:Gauge",
    isActive: true,
  },
  {
    name: "دواسات وأرضيات جلدية 7D VIP",
    slug: "7d-luxury-floor-mats",
    imageUrl: "icon:Sofa",
    isActive: true,
  },
  {
    name: "إضاءات محيطية ليد Ambient Lighting",
    slug: "ambient-interior-lighting",
    imageUrl: "icon:Zap",
    isActive: true,
  },
  {
    name: "كربون فايبر وتطعيمات داخلية",
    slug: "carbon-fiber-interior",
    imageUrl: "icon:Shield",
    isActive: true,
  },
  {
    name: "حماية ونانو سيراميك داخلي وخارجي",
    slug: "nano-ceramic-protection",
    imageUrl: "icon:SprayCan",
    isActive: true,
  },
  {
    name: "مستحضرات العناية بالجلود الطبيعية",
    slug: "leather-care-maintenance",
    imageUrl: "icon:Sparkles",
    isActive: true,
  },
];

export async function POST() {
  try {
    const results = [];
    for (const cat of DEFAULT_REALISTIC_CATEGORIES) {
      const existing = await prisma.category.findUnique({
        where: { slug: cat.slug },
      });

      if (!existing) {
        const created = await prisma.category.create({
          data: cat,
        });
        results.push(created);
      }
    }

    return NextResponse.json({
      success: true,
      message: `تم إضافة ${results.length} تصنيف فاخر بنجاح`,
      addedCount: results.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

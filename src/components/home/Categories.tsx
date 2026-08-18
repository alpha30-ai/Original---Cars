import Link from "next/link";

const CATEGORIES = [
  { name: "فرش كراسي", icon: "https://images.unsplash.com/photo-1549316975-728b9cc82219?w=150&h=150&fit=crop", link: "/shop?category=upholstery" },
  { name: "دواسات 5D", icon: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=150&h=150&fit=crop", link: "/shop?category=mats" },
  { name: "غلاف دركسيون", icon: "https://images.unsplash.com/photo-1586252985331-526bfd8a4ba1?w=150&h=150&fit=crop", link: "/shop?category=steering" },
  { name: "تلميع وحماية", icon: "https://images.unsplash.com/photo-1589148769363-2280d96d2745?w=150&h=150&fit=crop", link: "/booking" },
  { name: "إكسسوارات", icon: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=150&h=150&fit=crop", link: "/shop?category=accessories" },
  { name: "عروض", icon: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150&h=150&fit=crop", link: "/shop?category=offers" },
];

export default function Categories() {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-bold mb-6 text-foreground">تسوق حسب الفئة</h3>
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} href={cat.link} className="flex flex-col items-center gap-3 shrink-0 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-accent transition-colors p-1 bg-card shadow-sm">
                <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

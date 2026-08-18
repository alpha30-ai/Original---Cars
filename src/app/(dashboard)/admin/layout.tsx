"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Calendar,
  Users,
  Image as ImageIcon,
  Paintbrush,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Store,
  CreditCard,
  Camera,
  MessageSquare,
  Sparkles,
  Layers,
  ShieldCheck,
  Tag,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const sidebarLinks = [
  { href: "/admin", label: "الرئيسية والإحصائيات", icon: LayoutDashboard },
  { href: "/admin/products", label: "إدارة المنتجات", icon: Package },
  { href: "/admin/categories", label: "الأقسام والتصنيفات", icon: Tag },
  { href: "/admin/orders", label: "طلبات المتجر", icon: ShoppingBag },
  { href: "/admin/bookings", label: "حجوزات الخدمات", icon: Calendar },
  { href: "/admin/reviews", label: "مراجعة التعليقات", icon: MessageSquare },
  { href: "/admin/users", label: "العملاء والمستخدمين", icon: Users },
  { href: "/admin/gallery", label: "معرض الأعمال", icon: Camera },
  { href: "/admin/ai", label: "الذكاء الاصطناعي", icon: Sparkles },
  { href: "/admin/appearance", label: "تخصيص المظهر", icon: Paintbrush },
  { href: "/admin/payments", label: "طرق السداد والمدفوعات", icon: CreditCard },
  { href: "/admin/backup", label: "الاستعادة والنسخ الاحتياطي", icon: Database },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (userRole && userRole !== "ADMIN" && userRole !== "admin") {
        router.push("/");
      }
    }
  }, [status, session, router]);

  const handleLogout = async () => {
    toast.loading("جاري تسجيل الخروج...", { id: "logout" });
    await signOut({ callbackUrl: "/login" });
    toast.success("تم تسجيل الخروج بنجاح", { id: "logout" });
  };

  if (status === "loading" || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans" dir="rtl">
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                  <LogOut className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">تسجيل الخروج</h3>
                  <p className="text-xs text-muted-foreground mt-1">هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة الإدارة؟</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm shadow-md shadow-destructive/20"
                >
                  تأكيد الخروج
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-border bg-card lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-foreground">لوحة التحكم الإدارية</span>
                    <span className="text-[10px] text-muted-foreground font-bold">ADMIN PANEL</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent 
                pathname={pathname} 
                session={session} 
                theme={theme} 
                setTheme={setTheme} 
                closeMobile={() => setIsMobileSidebarOpen(false)} 
                onRequestLogout={() => {
                  setIsMobileSidebarOpen(false);
                  setShowLogoutModal(true);
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-l border-border bg-card transition-all duration-300 ease-in-out relative z-20 shadow-sm ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex h-20 items-center justify-center border-b border-border px-4 overflow-hidden">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-foreground">لوحة التحكم الإدارية</span>
                <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-wider">ADMIN CONTROL</span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          )}
        </div>
        <SidebarContent 
          pathname={pathname} 
          session={session} 
          theme={theme} 
          setTheme={setTheme}
          isCollapsed={!isSidebarOpen} 
          onRequestLogout={() => setShowLogoutModal(true)}
        />
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex w-full items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isSidebarOpen ? (
              <>
                <ChevronRight className="h-5 w-5 ml-2" />
                <span className="text-xs font-bold">تصغير القائمة</span>
              </>
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-black text-foreground">
              لوحة التحكم الإدارية
            </span>
          </div>
          <div className="w-8" />
        </div>
        
        {/* Main scrollable view */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ 
  pathname, 
  session, 
  theme, 
  setTheme,
  isCollapsed = false,
  closeMobile,
  onRequestLogout
}: { 
  pathname: string, 
  session: any, 
  theme?: string,
  setTheme: (theme: string) => void,
  isCollapsed?: boolean,
  closeMobile?: () => void,
  onRequestLogout?: () => void
}) {
  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      <nav className="space-y-1 px-3">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className={`flex items-center rounded-xl px-3.5 py-2.5 text-xs transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground font-black shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground font-bold"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}
              title={isCollapsed ? link.label : undefined}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? "" : "ml-3"}`} />
              {!isCollapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 mt-auto space-y-2.5 pt-4 border-t border-border">
        {/* Visit Store Button */}
        <Link
          href="/"
          target="_blank"
          className={`flex items-center rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground bg-muted/60 hover:bg-primary/10 hover:text-primary transition-all border border-border ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          title={isCollapsed ? "عرض المتجر" : undefined}
        >
          <Store className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? "" : "ml-2.5 text-primary"}`} />
          {!isCollapsed && <span className="truncate">عرض المتجر للعملاء</span>}
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`flex w-full items-center rounded-xl px-3.5 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          title={isCollapsed ? "تغيير المظهر" : undefined}
        >
          {theme === "dark" ? (
            <Sun className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? "" : "ml-2.5 text-amber-500"}`} />
          ) : (
            <Moon className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? "" : "ml-2.5 text-indigo-500"}`} />
          )}
          {!isCollapsed && <span className="truncate">{theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</span>}
        </button>

        {/* User Info */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} p-2.5 bg-muted/40 rounded-2xl border border-border`}>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="h-8 w-8 rounded-xl object-cover ring-1 ring-primary/30 shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Users className="h-4 w-4" />
            </div>
          )}
          {!isCollapsed && (
            <div className="mr-2.5 flex flex-col overflow-hidden text-right">
              <span className="truncate text-xs font-black text-foreground">
                {session?.user?.name || "مدير النظام"}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {session?.user?.email || "admin@original.com"}
              </span>
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onRequestLogout}
          className={`flex w-full items-center rounded-xl px-3.5 py-2.5 text-xs font-bold text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-all ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          title={isCollapsed ? "تسجيل الخروج" : undefined}
        >
          <LogOut className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? "" : "ml-2.5"}`} />
          {!isCollapsed && <span className="truncate">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );
}

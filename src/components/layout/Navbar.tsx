'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, ShoppingCart, Sun, Moon, User, 
  LogOut, Settings, LayoutDashboard, ChevronDown,
  Car, Wrench, Sparkles, Info, Phone, Search,
  ShieldCheck, Package, Bot
} from 'lucide-react'

import { useCart } from '@/store/cartStore'

const Logo = ({ logoMode, logoText, logoImage, logoTextStyle, logoFont }: { logoMode: string, logoText: string, logoImage: string, logoTextStyle?: string, logoFont?: string }) => {
  const styleMap: Record<string, string> = {
    'gradient-1': 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent',
    'gradient-2': 'bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent',
    'neon': 'text-primary drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]',
    'solid': 'text-foreground',
    '3d': 'text-transparent bg-clip-text bg-gradient-to-b from-primary to-accent drop-shadow-[0_4px_2px_rgba(0,0,0,0.3)] font-black',
    'outline': 'text-transparent [-webkit-text-stroke:1px_theme(colors.primary.DEFAULT)]',
    'elegant': 'text-foreground tracking-[0.2em] font-light uppercase',
    'bold-shadow': 'text-primary drop-shadow-[3px_3px_0_theme(colors.foreground.DEFAULT)] font-black',
  };
  
  const textClass = styleMap[logoTextStyle || 'gradient-1'] || styleMap['gradient-1'];
  
  const fontMap: Record<string, string> = {
    'font-cairo': 'font-cairo',
    'font-tajawal': 'font-tajawal',
    'font-almarai': 'font-almarai',
    'font-readex': 'font-readex',
    'font-amiri': 'font-amiri',
    'font-serif': 'font-serif',
    'font-mono': 'font-mono',
  };
  const fontClass = fontMap[logoFont || 'font-cairo'] || 'font-cairo';

  return (
    <Link href="/" className="flex items-center gap-3 z-50 relative group">
      {logoMode === 'image' && logoImage ? (
        <div className="relative p-1 rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-accent/30 transition-all duration-500 group-hover:scale-105 shadow-md">
          <img src={logoImage} alt={logoText || "أورجينال"} className="h-10 w-auto rounded-xl object-cover" />
        </div>
      ) : (
        <div className="flex flex-col items-start">
          <span className={`font-black text-2xl md:text-3xl tracking-tight transition-all duration-300 group-hover:scale-105 ${textClass} ${fontClass}`}>
            {logoText || "ORIGINAL"}
          </span>
          <span className="text-[9px] font-black tracking-widest text-primary uppercase -mt-1 hidden sm:block">
            Luxury Auto Care
          </span>
        </div>
      )}
    </Link>
  )
}

export default function Navbar({ settings = {} }: { settings?: Record<string, string> }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const pathname = usePathname()
  
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { totalItems } = useCart();

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const logoMode = settings.site_logo_type || settings.logo_mode || 'text'
  const logoText = settings.site_logo_text || 'ORIGINAL'
  const logoImage = settings.site_logo_image || ''
  const logoTextStyle = settings.site_logo_text_style || 'gradient-1'
  const logoFont = settings.site_logo_font || 'font-cairo'
  const headerShape = settings.header_shape || 'default'

  const navLinks = [
    { name: 'الرئيسية', href: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'المتجر', href: '/shop', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'المساعد الذكي', href: '/ai-assistant', icon: <Bot className="w-4 h-4 text-primary" />, isAi: true },
    { name: 'احجز خدمة', href: '/booking', icon: <Wrench className="w-4 h-4" /> },
    { name: 'معرض الأعمال', href: '/gallery', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'من نحن', href: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'تواصل معنا', href: '/contact', icon: <Phone className="w-4 h-4" /> },
  ]

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-card/90 backdrop-blur-2xl border-b border-border shadow-xl h-20 flex items-center' 
            : 'bg-card/75 backdrop-blur-xl border-b border-border/60 shadow-md h-24 flex items-center'
        } ${
          headerShape === 'curved' ? 'rounded-b-[2.5rem] mx-3 mt-2 border-x border-b' :
          headerShape === 'floating' ? 'rounded-3xl mx-4 lg:mx-10 mt-4 border h-20 flex items-center' : ''
        }`}
      >
        {/* Dynamic High-Tech Mesh Pattern Inside Header */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-inherit">
          {/* Subtle Grid Matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          
          {/* Linear Mesh Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
          
          {/* Top Gold Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo */}
            <div className="flex items-center">
              <Logo 
                logoMode={logoMode} 
                logoText={logoText} 
                logoImage={logoImage} 
                logoTextStyle={logoTextStyle} 
                logoFont={logoFont} 
              />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/60 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-primary-foreground bg-primary shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Theme Toggle */}
              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center bg-muted/60 border border-border text-foreground hover:bg-muted hover:text-primary transition-all shadow-sm"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                </button>
              )}

              {/* Shopping Cart Button */}
              <Link 
                href="/cart" 
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-muted/60 border border-border text-foreground hover:bg-muted hover:text-primary transition-all relative shadow-sm"
                title="سلة التسوق"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Account / Login */}
              {session ? (
                <div className="relative hidden sm:block">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 bg-muted/60 hover:bg-muted p-1.5 pr-3 rounded-2xl transition-all border border-border shadow-sm"
                  >
                    <span className="text-xs font-black text-foreground max-w-[100px] truncate">{session.user?.name?.split(' ')[0]}</span>
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-60 bg-card/95 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                        dir="rtl"
                      >
                        <div className="px-4 py-3 border-b border-border mb-1 bg-muted/20">
                          <p className="text-sm font-black text-foreground">{session.user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">{session.user?.email}</p>
                        </div>
                        
                        <div className="py-1 px-2 flex flex-col gap-1">
                          <Link 
                            href="/dashboard/profile" 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-foreground/80 hover:text-foreground hover:bg-muted transition-colors" 
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-primary" />
                            حسابي والطلبات
                          </Link>
                          
                          {(session.user as { role?: string })?.role === 'ADMIN' && (
                            <Link 
                              href="/admin" 
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-foreground/80 hover:text-foreground hover:bg-muted transition-colors" 
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4 text-amber-500" />
                              لوحة الإدارة
                            </Link>
                          )}
                        </div>
                        
                        <div className="px-2 mt-1 pt-2 border-t border-border">
                          <button 
                            onClick={() => { signOut({ callbackUrl: "/login" }); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            تسجيل خروج
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl text-xs font-black hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  <User className="w-4 h-4" />
                  تسجيل الدخول
                </Link>
              )}

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-muted/60 border border-border text-foreground hover:bg-muted lg:hidden transition-colors"
                aria-label="القائمة الرئيسية"
              >
                <Menu className="w-5 h-5" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-card backdrop-blur-2xl z-[101] border-l border-border shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-6 border-b border-border">
                <Logo logoMode={logoMode} logoText={logoText} logoImage={logoImage} logoTextStyle={logoTextStyle} logoFont={logoFont} />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-2xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col gap-2 flex-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm font-black p-3.5 rounded-2xl transition-all flex items-center gap-3 ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-border">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        {session.user?.image ? (
                          <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black text-foreground truncate">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                      </div>
                    </div>

                    <Link 
                      href="/dashboard/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted text-foreground text-xs font-bold transition-colors"
                    >
                      <Settings className="w-4 h-4 text-primary" />
                      حسابي والطلبات
                    </Link>

                    {(session.user as { role?: string })?.role === 'ADMIN' && (
                      <Link 
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted text-foreground text-xs font-bold transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        لوحة الإدارة
                      </Link>
                    )}

                    <button 
                      onClick={() => { signOut({ callbackUrl: "/login" }); setMobileMenuOpen(false); }}
                      className="flex items-center gap-3 p-3 rounded-2xl text-destructive hover:bg-destructive/10 text-right w-full text-xs font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل خروج
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 p-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    <User className="w-4 h-4" />
                    تسجيل الدخول / إنشاء حساب
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

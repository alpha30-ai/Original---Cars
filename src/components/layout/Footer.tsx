import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Car, Wrench, Sparkles, ShieldCheck, CreditCard, ChevronLeft, Terminal, ShieldAlert, Cpu, Lock, ExternalLink } from 'lucide-react'

interface FooterProps {
  settings?: Record<string, string>;
}

export default function Footer({ settings = {} }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const aboutText = settings.footer_about || "أورجينال لفرش وتجديد مقصورات السيارات، حيث تلتقي الفخامة العالمية بالدقة الحرفية المتناهية. نقدم خدمات تنجيد وتجديد وحماية النانو بأعلى معايير الجودة الألمانية.";
  const phone = settings.footer_phone || "+20 100 849 9476";
  const whatsapp = settings.footer_whatsapp || "+20 100 849 9476";
  const email = settings.footer_email || "info@original-auto.com";
  const address = settings.footer_address || "جمهورية مصر العربية - مركز الخدمة المعتمد";
  const workingHours = settings.footer_working_hours || "السبت - الخميس: 10:00 ص - 11:00 م | الجمعة: 1:00 م - 11:00 م";
  const copyright = settings.footer_copyright || `© ${currentYear} ORIGINAL AUTO CARE. ALL RIGHTS RESERVED.`;

  const facebook = settings.footer_facebook || "#";
  const instagram = settings.footer_instagram || "#";
  const twitter = settings.footer_twitter || "#";
  
  const footerLogoType = settings.footer_logo_type || 'text';
  const footerLogoText = settings.footer_logo_text || 'ORIGINAL';
  const footerLogoImage = settings.footer_logo_image || '';
  const footerLogoTextStyle = settings.footer_logo_text_style || 'solid';
  const footerLogoFont = settings.footer_logo_font || 'font-alexandria';

  const formatWhatsApp = (num: string) => {
    const cleaned = num.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return "2" + cleaned;
    return cleaned;
  };

  const getTextStyle = (style: string) => {
    switch(style) {
      case 'gradient-1': return 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent';
      case 'gradient-2': return 'bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent';
      case 'neon': return 'text-primary drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]';
      case '3d': return 'text-transparent bg-clip-text bg-gradient-to-b from-primary to-accent drop-shadow-[0_4px_2px_rgba(0,0,0,0.3)] font-black';
      case 'outline': return 'text-transparent [-webkit-text-stroke:1px_theme(colors.primary.DEFAULT)]';
      case 'elegant': return 'text-foreground tracking-[0.2em] font-light uppercase';
      case 'bold-shadow': return 'text-primary drop-shadow-[3px_3px_0_theme(colors.foreground.DEFAULT)] font-black';
      default: return 'text-foreground';
    }
  };

  return (
    <footer className="bg-card text-foreground border-t border-border relative overflow-hidden" dir="rtl">
      
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Story Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="inline-block group">
              {footerLogoType === 'image' && footerLogoImage ? (
                <div className="relative p-1 rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-accent/30 transition-all duration-500 group-hover:scale-105 inline-block shadow-md">
                  <img src={footerLogoImage} alt={footerLogoText} className="h-12 w-auto rounded-xl object-cover" />
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className={`font-black text-3xl tracking-tight transition-all duration-300 ${getTextStyle(footerLogoTextStyle)} ${footerLogoFont}`}>
                    {footerLogoText}
                  </span>
                  <span className="text-[10px] font-black tracking-widest text-primary uppercase mt-0.5 font-heading">
                    LUXURY AUTO CARE & UPHOLSTERY
                  </span>
                </div>
              )}
            </Link>

            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              {aboutText}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {facebook !== "#" && (
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook" 
                  className="w-10 h-10 rounded-2xl bg-muted/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all border border-border shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {instagram !== "#" && (
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram" 
                  className="w-10 h-10 rounded-2xl bg-muted/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all border border-border shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {twitter !== "#" && (
                <a 
                  href={twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Twitter" 
                  className="w-10 h-10 rounded-2xl bg-muted/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all border border-border shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-sm font-black text-foreground relative inline-block font-heading">
              روابط سريعة
              <span className="block w-8 h-1 bg-primary rounded-full mt-1.5" />
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-bold mt-1">
              {[
                { name: 'الرئيسية', href: '/' },
                { name: 'المتجر الإلكتروني', href: '/shop' },
                { name: 'حجز موعد خدمة', href: '/booking' },
                { name: 'معرض الأعمال', href: '/gallery' },
                { name: 'من نحن', href: '/about' },
                { name: 'المساعد الذكي AI', href: '/ai-assistant' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-0.5">
                    <ChevronLeft className="w-3 h-3 text-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-sm font-black text-foreground relative inline-block font-heading">
              أبرز الخدمات
              <span className="block w-8 h-1 bg-primary rounded-full mt-1.5" />
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-bold mt-1">
              {[
                { name: 'تنجيد جلد طبيعي نابا ألماني', href: '/booking' },
                { name: 'تجديد مقصورة وتابلوه السيارة', href: '/booking' },
                { name: 'تنجيد سقف وتطعيم ألكانتارا ونجوم', href: '/booking' },
                { name: 'حماية وتلميع النانو سيراميك', href: '/booking' },
                { name: 'تصميم مخصص حسب الطلب VIP', href: '/booking' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-0.5">
                    <ChevronLeft className="w-3 h-3 text-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-sm font-black text-foreground relative inline-block font-heading">
              بيانات التواصل وساعات العمل
              <span className="block w-8 h-1 bg-primary rounded-full mt-1.5" />
            </h4>
            <ul className="flex flex-col gap-3 mt-1 text-xs">
              <li className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">خدمة العملاء والهاتف</span>
                  <a href={`tel:${phone}`} className="font-mono font-black text-foreground hover:text-primary" dir="ltr">{phone}</a>
                </div>
              </li>

              <li className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">محادثة واتساب مباشرة</span>
                  <a 
                    href={`https://wa.me/${formatWhatsApp(whatsapp)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-black text-green-500 hover:underline" 
                    dir="ltr"
                  >
                    {whatsapp}
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">البريد الإلكتروني</span>
                  <a href={`mailto:${email}`} className="font-bold text-foreground hover:text-primary">{email}</a>
                </div>
              </li>

              <li className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">أوقات العمل واستقبال السيارات</span>
                  <span className="font-bold text-foreground leading-tight block">{workingHours}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Middle Assurance Bar */}
        <div className="py-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground font-bold">
              <ShieldCheck className="w-4 h-4 text-primary" />
              ضمان الجودة الذهبي المعتمد
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1.5 text-foreground font-bold">
              <CreditCard className="w-4 h-4 text-primary" />
              طرق دفع متعددة وآمنة
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-bold">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors font-bold">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
      
      {/* High-Tech Executive Developer & Operational Bottom Bar */}
      <div className="bg-[#030712] text-slate-400 border-t border-white/10 py-4 w-full relative z-20 overflow-hidden select-none">
        {/* Terminal Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
        
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-[11px] font-mono tracking-wider">
          
          {/* Status LED & Platform Version */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-bold text-slate-300">ORIGINAL CORE ENGINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">V2.8.0 ACTIVE</span>
          </div>

          {/* Security & Copyright Badge */}
          <div className="flex items-center gap-2 text-slate-400 text-center">
            <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="uppercase text-[10px] text-slate-400 font-sans font-semibold">
              {copyright}
            </span>
          </div>

          {/* Developer Platform Link */}
          <div className="flex items-center gap-2">
            <a 
              href="https://workspace-mh.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2 hover:border-[#d4af37] hover:bg-white/10 transition-all group shadow-sm"
              title="Visit Developer Platform Workspace"
            >
              <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-slate-400 text-[10px]">ENGINEERED BY:</span>
              <span className="text-[#d4af37] font-black tracking-wider group-hover:text-white transition-colors underline-offset-4 group-hover:underline" dir="ltr">
                MOHAMED HASHISH
              </span>
              <ExternalLink className="w-3 h-3 text-[#d4af37] opacity-60 group-hover:opacity-100" />
            </a>
          </div>

        </div>
      </div>

    </footer>
  )
}

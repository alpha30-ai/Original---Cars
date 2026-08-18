"use client";

import { useState, useEffect } from "react";
import { 
  Paintbrush, 
  Save, 
  Loader2, 
  Check, 
  Type, 
  Palette, 
  PanelBottom,
  Sliders,
  Sparkles,
  Layout,
  Phone,
  Clock,
  MapPin,
  Mail,
  Share2,
  Globe
} from "lucide-react";
import toast from "react-hot-toast";

const LUXURY_PALETTES = [
  { name: "ذهبي فاخر (Original Gold)", hsl: "43 74% 49%", hex: "#d4af37", bg: "from-amber-500 to-yellow-600" },
  { name: "أزرق ملكي (Royal Sapphire)", hsl: "210 100% 45%", hex: "#1e40af", bg: "from-blue-600 to-indigo-700" },
  { name: "زمردي إمبريالي (Emerald Royale)", hsl: "152 100% 35%", hex: "#059669", bg: "from-emerald-500 to-teal-700" },
  { name: "أحمر قرمزي (Ruby Crimson)", hsl: "350 85% 48%", hex: "#e11d48", bg: "from-rose-500 to-red-700" },
  { name: "كربوني فضي (Cyber Platinum)", hsl: "0 0% 75%", hex: "#a1a1aa", bg: "from-zinc-400 to-zinc-600" },
];

export default function AppearancePage() {
  const [accentColor, setAccentColor] = useState("43 74% 49%");
  const [siteLogoType, setSiteLogoType] = useState("text");
  const [siteLogoText, setSiteLogoText] = useState("أورجينال");
  const [siteLogoImage, setSiteLogoImage] = useState("");
  const [headingFont, setHeadingFont] = useState("font-alexandria");
  
  // Header Settings
  const [headerShape, setHeaderShape] = useState("default");
  const [headerBgColor, setHeaderBgColor] = useState("");
  const [headerTextColor, setHeaderTextColor] = useState("");
  const [showAnnouncementBar, setShowAnnouncementBar] = useState("true");
  const [announcementText, setAnnouncementText] = useState("خصم خاص 15% على تفصيل جلود النابا الألمانية لفترة محدودة!");
  const [announcementLink, setAnnouncementLink] = useState("/shop");

  // Hero Section Customizer
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");

  // Homepage Sections Visibility
  const [showTrustStrip, setShowTrustStrip] = useState("true");
  const [showCategories, setShowCategories] = useState("true");
  const [showBestSellers, setShowBestSellers] = useState("true");
  const [showCraftStudio, setShowCraftStudio] = useState("true");
  const [showServices, setShowServices] = useState("true");

  // Footer & Contact Information
  const [footerAbout, setFooterAbout] = useState("أورجينال لفرش وعناية السيارات الفاخرة، حيث تلتقي الدقة الألمانية بالخامات الفندقية العالمية.");
  const [footerPhone, setFooterPhone] = useState("+20 100 849 9476");
  const [footerWhatsapp, setFooterWhatsapp] = useState("+20 100 849 9476");
  const [footerEmail, setFooterEmail] = useState("info@original-auto.com");
  const [footerAddress, setFooterAddress] = useState("جمهورية مصر العربية - مركز الخدمة والتفصيل المعتمد");
  const [footerWorkingHours, setFooterWorkingHours] = useState("السبت - الخميس: 10:00 ص - 11:00 م | الجمعة: 1:00 م - 11:00 م");
  const [footerFacebook, setFooterFacebook] = useState("https://facebook.com");
  const [footerInstagram, setFooterInstagram] = useState("https://instagram.com");
  const [footerTwitter, setFooterTwitter] = useState("https://twitter.com");
  const [footerCopyright, setFooterCopyright] = useState("© 2026 ORIGINAL AUTO CARE. ALL RIGHTS RESERVED.");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.accent_color) setAccentColor(data.accent_color);
        if (data.site_logo_type) setSiteLogoType(data.site_logo_type);
        if (data.site_logo_text) setSiteLogoText(data.site_logo_text);
        if (data.site_logo_image) setSiteLogoImage(data.site_logo_image);
        if (data.heading_font) setHeadingFont(data.heading_font);
        if (data.header_shape) setHeaderShape(data.header_shape);
        if (data.header_bg_color) setHeaderBgColor(data.header_bg_color);
        if (data.header_text_color) setHeaderTextColor(data.header_text_color);
        if (data.show_announcement_bar) setShowAnnouncementBar(data.show_announcement_bar);
        if (data.announcement_text) setAnnouncementText(data.announcement_text);
        if (data.announcement_link) setAnnouncementLink(data.announcement_link);
        if (data.hero_title) setHeroTitle(data.hero_title);
        if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        if (data.show_trust_strip) setShowTrustStrip(data.show_trust_strip);
        if (data.show_categories) setShowCategories(data.show_categories);
        if (data.show_bestsellers) setShowBestSellers(data.show_bestsellers);
        if (data.show_craft_studio) setShowCraftStudio(data.show_craft_studio);
        if (data.show_services) setShowServices(data.show_services);
        
        // Footer & Contact
        if (data.footer_about) setFooterAbout(data.footer_about);
        if (data.footer_phone) setFooterPhone(data.footer_phone);
        if (data.footer_whatsapp) setFooterWhatsapp(data.footer_whatsapp);
        if (data.footer_email) setFooterEmail(data.footer_email);
        if (data.footer_address) setFooterAddress(data.footer_address);
        if (data.footer_working_hours) setFooterWorkingHours(data.footer_working_hours);
        if (data.footer_facebook) setFooterFacebook(data.footer_facebook);
        if (data.footer_instagram) setFooterInstagram(data.footer_instagram);
        if (data.footer_twitter) setFooterTwitter(data.footer_twitter);
        if (data.footer_copyright) setFooterCopyright(data.footer_copyright);
        
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            accent_color: accentColor,
            site_logo_type: siteLogoType,
            site_logo_text: siteLogoText,
            site_logo_image: siteLogoImage,
            heading_font: headingFont,
            header_shape: headerShape,
            header_bg_color: headerBgColor,
            header_text_color: headerTextColor,
            show_announcement_bar: showAnnouncementBar,
            announcement_text: announcementText,
            announcement_link: announcementLink,
            hero_title: heroTitle,
            hero_subtitle: heroSubtitle,
            show_trust_strip: showTrustStrip,
            show_categories: showCategories,
            show_bestsellers: showBestSellers,
            show_craft_studio: showCraftStudio,
            show_services: showServices,
            
            // Footer & Contact
            footer_about: footerAbout,
            footer_phone: footerPhone,
            footer_whatsapp: footerWhatsapp,
            footer_email: footerEmail,
            footer_address: footerAddress,
            footer_working_hours: footerWorkingHours,
            footer_facebook: footerFacebook,
            footer_instagram: footerInstagram,
            footer_twitter: footerTwitter,
            footer_copyright: footerCopyright,
          }
        }),
      });
      
      if (res.ok) {
        toast.success("تم حفظ وتطبيق تخصيصات المظهر والفوتر بنجاح!");
        // Update document root style immediately
        document.documentElement.style.setProperty('--accent', accentColor);
      } else {
        toast.error("حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16" dir="rtl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <Paintbrush className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">مركز تخصيص مظهر وبيانات الموقع</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">تحكم كامل في الألوان والخطوط وبيانات التواصل والفوتر وساعات العمل</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>حفظ وتطبيق التغييرات</span>
        </button>
      </div>

      {/* 1. Theme & Accent Color Engine */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-black text-foreground font-heading">لوحات الألوان الفاخرة (Color Palettes)</h3>
            <p className="text-xs text-muted-foreground">اختر اللون المميز الرئيسي للأزرار والتوهج والشارات في الموقع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {LUXURY_PALETTES.map((pal) => {
            const isSelected = accentColor === pal.hsl;
            return (
              <button
                key={pal.hsl}
                onClick={() => setAccentColor(pal.hsl)}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-md scale-105" 
                    : "border-border hover:border-primary/40 bg-background"
                }`}
              >
                <div 
                  className={`w-12 h-12 rounded-2xl shadow-md border border-white/20 bg-gradient-to-br ${pal.bg} flex items-center justify-center text-white`}
                >
                  {isSelected && <Check className="w-5 h-5 drop-shadow" />}
                </div>
                <span className="font-bold text-xs text-foreground">{pal.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Typography Engine */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Type className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-black text-foreground font-heading">محرك الخطوط العربية (Typography System)</h3>
            <p className="text-xs text-muted-foreground">اختر نوع الخط المفضل لعناوين وشعارات الموقع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "font-alexandria", name: "Alexandria (هندسي فاخر - موصى به)", sample: "أورجينال لفرش السيارات" },
            { id: "font-readex", name: "Readex Pro (عصري تقني)", sample: "أورجينال لفرش السيارات" },
            { id: "font-tajawal", name: "Tajawal (متناسق وواضح)", sample: "أورجينال لفرش السيارات" },
            { id: "font-cairo", name: "Cairo (الافتراضي)", sample: "أورجينال لفرش السيارات" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setHeadingFont(f.id)}
              className={`p-5 rounded-2xl border-2 text-right space-y-2 transition-all ${
                headingFont === f.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40 bg-background"
              }`}
            >
              <span className="text-xs font-black text-foreground block">{f.name}</span>
              <span className={`text-base font-black text-primary block truncate ${f.id}`}>{f.sample}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Header & Announcement Bar */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Layout className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-black text-foreground font-heading">تخصيص الهيدر وشريط الإعلانات</h3>
            <p className="text-xs text-muted-foreground">التحكم في شريط التنبيهات العلوي وشكل الهيدر الزجاجي</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">شكل الهيدر</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "default", name: "افتراضي متصل" },
                { id: "curved", name: "حواف منحنية" },
                { id: "floating", name: "عائم زجاجي" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setHeaderShape(s.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    headerShape === s.id
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">عرض شريط الإعلانات العلوي (Announcement)</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="announcementToggle"
                checked={showAnnouncementBar === "true"}
                onChange={(e) => setShowAnnouncementBar(e.target.checked ? "true" : "false")}
                className="w-4 h-4 text-primary rounded"
              />
              <label htmlFor="announcementToggle" className="text-xs font-bold text-foreground cursor-pointer">
                تفعيل شريط التنبيهات في أعلى الموقع
              </label>
            </div>
          </div>

          {showAnnouncementBar === "true" && (
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-foreground">نص شريط الإعلانات</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="خصم خاص 15% على تفصيل الجلود..."
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. Homepage Sections Visibility Toggles */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-black text-foreground font-heading">التحكم في أقسام الصفحة الرئيسية</h3>
            <p className="text-xs text-muted-foreground">تفعيل أو إخفاء أي قسم في الصفحة الرئيسية بضغطة زر</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: "trust", label: "شريط الثقة والضمانات", state: showTrustStrip, set: setShowTrustStrip },
            { id: "categories", label: "أقسام وتصنيفات المتجر", state: showCategories, set: setShowCategories },
            { id: "bestsellers", label: "المنتجات الأكثر طلباً", state: showBestSellers, set: setShowBestSellers },
            { id: "craft", label: "استوديو الخامات والتفصيل", state: showCraftStudio, set: setShowCraftStudio },
            { id: "services", label: "خدمات العناية والتنجيد", state: showServices, set: setShowServices },
          ].map((sec) => (
            <label
              key={sec.id}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                sec.state === "true" ? "border-primary/50 bg-primary/5" : "border-border bg-background opacity-60"
              }`}
            >
              <span className="text-xs font-black text-foreground">{sec.label}</span>
              <input
                type="checkbox"
                checked={sec.state === "true"}
                onChange={(e) => sec.set(e.target.checked ? "true" : "false")}
                className="w-4 h-4 text-primary rounded"
              />
            </label>
          ))}
        </div>
      </div>

      {/* 5. Complete Footer, Contact & Working Hours Management */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <PanelBottom className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-black text-foreground font-heading">بيانات الفوتر، التواصل وساعات العمل</h3>
            <p className="text-xs text-muted-foreground">التحكم في كافة أرقام الهواتف، الواتساب، البريد، العنوان، وساعات عمل الورشة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-foreground">نبذة عن المركز بالفوتر</label>
            <textarea
              value={footerAbout}
              onChange={(e) => setFooterAbout(e.target.value)}
              rows={2}
              className="w-full bg-background border border-border rounded-2xl p-3.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" /> رقم الهاتف الرئيسي
            </label>
            <input
              type="text"
              value={footerPhone}
              onChange={(e) => setFooterPhone(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-green-500" /> رقم الواتساب المعتمد
            </label>
            <input
              type="text"
              value={footerWhatsapp}
              onChange={(e) => setFooterWhatsapp(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> البريد الإلكتروني الرسمي
            </label>
            <input
              type="email"
              value={footerEmail}
              onChange={(e) => setFooterEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-sans text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> أوقات العمل واستقبال السيارات
            </label>
            <input
              type="text"
              value={footerWorkingHours}
              onChange={(e) => setFooterWorkingHours(e.target.value)}
              placeholder="السبت - الخميس: 10:00 ص - 11:00 م"
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> العنوان ومقر المركز الرئيسي
            </label>
            <input
              type="text"
              value={footerAddress}
              onChange={(e) => setFooterAddress(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">رابط فيسبوك</label>
            <input
              type="url"
              value={footerFacebook}
              onChange={(e) => setFooterFacebook(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">رابط انستجرام</label>
            <input
              type="url"
              value={footerInstagram}
              onChange={(e) => setFooterInstagram(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-left"
              dir="ltr"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-foreground">نص حقوق الملكية (Footer Copyright)</label>
            <input
              type="text"
              value={footerCopyright}
              onChange={(e) => setFooterCopyright(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-left"
              dir="ltr"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

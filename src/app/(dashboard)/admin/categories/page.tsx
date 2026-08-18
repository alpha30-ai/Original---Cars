"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Tag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Loader2, 
  Upload, 
  Save,
  Check,
  Sparkles,
  Sofa
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  CATEGORY_ICON_MAP, 
  getCategoryIconName, 
  CategoryIconRenderer 
} from "@/lib/categoryIcons";

// Icon library with English name, icon component, and Arabic search terms
export const ICON_LIBRARY = [
  { name: "Layers", label: "جلود نابا وطبقات", keywords: "layers leather جلد طبقات نابا خامات الماني" },
  { name: "Sofa", label: "مقاعد وتنجيد", keywords: "sofa seat chair كراسي مقاعد كنب تنجيد فرش" },
  { name: "Sparkles", label: "سقف ألكانتارا ونجوم", keywords: "sparkles shine clean تلميع نجوم سقف بريق نظافة الكانتارا" },
  { name: "Car", label: "دواسات 7D وأرضيات", keywords: "car auto vehicle سيارة عربية مركبة دواسات ارضيات" },
  { name: "Scissors", label: "قص وتطريز ليزر", keywords: "scissors cut tailor قص خياطة تفصيل مقص ليزر" },
  { name: "Gauge", label: "تابلوه وطارات وأبواب", keywords: "gauge speed dash عداد تابلوه سرعة طبلون طارة دركسيون" },
  { name: "Zap", label: "إضاءة ليد وكهرباء", keywords: "zap light power كهرباء إضاءة ليد شرائط امبينت" },
  { name: "Cpu", label: "كاربون فايبر وذكاء", keywords: "cpu tech smart معالج كمبيوتر كاربون فايبر حساسات" },
  { name: "SprayCan", label: "نانو سيراميك وحماية", keywords: "spray clean nano رش تنظيف نانو غسيل سبراي تلميع" },
  { name: "Shield", label: "حماية وعناية", keywords: "shield protect safe حماية درع عزل نانو عناية" },
  { name: "Crown", label: "VIP وتجهيزات ملكية", keywords: "crown royal luxury تاج ملكي فخامة مميز vip" },
  { name: "Gem", label: "تطريز ماسي وكريستال", keywords: "gem diamond luxury جوهرة ماس تطريز كريستال" },
  { name: "Wrench", label: "صيانة وتركيب", keywords: "wrench tool fix مفتاح صيانة تركيب ورشة" },
  { name: "Flame", label: "عزل حراري وتدفئة", keywords: "flame heat warm عازل حراري نار تدفئة مقاعد" },
  { name: "Star", label: "نجوم وشهب", keywords: "star rolls roof نجمة سقف نجوم ألكانتارا مميز" },
  { name: "Award", label: "ضمان وجودة أصلية", keywords: "award quality best وسام شهادة أصلي معتمد ضمان" },
  { name: "Key", label: "مفاتيح وريموتات", keywords: "key remote lock مفتاح ريموت كفر ميدالية" },
  { name: "Navigation", label: "شاشات وملاحة", keywords: "navigation map gps خرائط شاشة شاشات ملاحة" },
  { name: "Music", label: "سماعات وصوتيات", keywords: "music sound audio صوتيات سماعات بازوكا مكبرات" },
  { name: "Fan", label: "تكييف وتبريد مقاعد", keywords: "fan cool ac مروحة تكييف تبريد تهوية مقاعد" },
  { name: "Palette", label: "ألوان وصبغات", keywords: "palette color paint ألوان دهان صبغ تجديد" },
  { name: "Shirt", label: "أغطية وكسوات", keywords: "shirt cover seat تلبيسة كفر غطاء كسوة" },
  { name: "ShoppingBag", label: "حقيبة ومشتريات", keywords: "shopping bag store شنطة حقيبة مشتريات" },
  { name: "Package", label: "طرد وإكسسوار", keywords: "package box ship كرتونة طرد منتج شحن" },
  { name: "BatteryCharging", label: "شواحن وبطاريات", keywords: "battery charge power بطارية شاحن وايرلس" },
  { name: "Settings", label: "مستلزمات عامة", keywords: "settings gear parts قطع غيار أدوات مستلزمات" }
];

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [iconSearchQuery, setIconSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    imageUrl: "",
    iconName: "Layers",
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      toast.error("فشل في تحميل الأقسام");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingCategory ? generateSlug(name) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
        toast.success("تم رفع صورة القسم بنجاح");
      } else {
        toast.error("فشل رفع الصورة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      // If an image URL is explicitly provided, use it; otherwise use the selected icon name
      const finalImageUrl = formData.imageUrl && (formData.imageUrl.startsWith("http://") || formData.imageUrl.startsWith("https://") || formData.imageUrl.startsWith("/"))
        ? formData.imageUrl
        : `icon:${formData.iconName || "Layers"}`;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          imageUrl: finalImageUrl,
          isActive: formData.isActive,
        }),
      });

      if (res.ok) {
        toast.success(editingCategory ? "تم تعديل وتطبيق أيقونة القسم بنجاح!" : "تمت إضافة القسم وتطبيق الأيقونة بنجاح!");
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || "فشل في حفظ القسم");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تم حذف القسم بنجاح");
        fetchCategories();
      } else {
        toast.error("فشل حذف القسم");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      const isIcon = category.imageUrl && category.imageUrl.startsWith("icon:");
      const iconName = isIcon 
        ? category.imageUrl?.replace("icon:", "") 
        : getCategoryIconName(category.imageUrl, category.slug, category.name);
      
      setFormData({
        name: category.name,
        slug: category.slug,
        imageUrl: isIcon ? "" : (category.imageUrl || ""),
        iconName: iconName || "Layers",
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", slug: "", imageUrl: "", iconName: "Layers", isActive: true });
    }
    setIsModalOpen(true);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (statusFilter === "ACTIVE" && !cat.isActive) return false;
      if (statusFilter === "INACTIVE" && cat.isActive) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = cat.name?.toLowerCase().includes(q);
        const slugMatch = cat.slug?.toLowerCase().includes(q);
        if (!nameMatch && !slugMatch) return false;
      }

      return true;
    });
  }, [categories, statusFilter, searchQuery]);

  const filteredIcons = useMemo(() => {
    if (!iconSearchQuery.trim()) return ICON_LIBRARY;
    const q = iconSearchQuery.toLowerCase().trim();
    return ICON_LIBRARY.filter(
      item => item.label.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q)
    );
  }, [iconSearchQuery]);

  const SelectedIconComponent = CATEGORY_ICON_MAP[formData.iconName] || Sofa;

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <Tag className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">إدارة أقسام وتصنيفات المتجر</h1>
            <p className="text-muted-foreground mt-1 text-xs md:text-sm">
              إضافة وتعديل التصنيفات وتعيين الأيقونات الفورية لعرضها في المتجر والصفحة الرئيسية
            </p>
          </div>
        </div>
        
        <button
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <Tag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إجمالي الأقسام والتصنيفات</p>
            <h3 className="text-2xl font-black text-foreground font-heading">{categories.length}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">الأقسام النشطة المعروضة</p>
            <h3 className="text-2xl font-black text-foreground font-heading">{categories.filter((c) => c.isActive).length}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم القسم أو الرابط (Slug)..."
              className="w-full pl-4 pr-11 py-3 bg-background border border-border rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-lg hover:bg-muted/80"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-muted-foreground ml-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> الحالة:
            </span>
            {[
              { id: "ALL", label: "الكل" },
              { id: "ACTIVE", label: "نشط" },
              { id: "INACTIVE", label: "غير نشط" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[650px]">
            <thead className="bg-muted/40 text-muted-foreground text-xs font-bold border-b border-border">
              <tr>
                <th className="p-5">الأيقونة المعتمدة</th>
                <th className="p-5">اسم القسم</th>
                <th className="p-5">الرابط (Slug)</th>
                <th className="p-5">الحالة</th>
                <th className="p-5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <span className="font-bold text-xs">جاري تحميل الأقسام...</span>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">
                    <Tag className="w-12 h-12 opacity-30 mx-auto mb-2" />
                    <span className="font-bold text-xs">لا توجد أقسام مطابقة للبحث</span>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  return (
                    <tr key={category.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
                          <CategoryIconRenderer 
                            imageUrl={category.imageUrl} 
                            slug={category.slug} 
                            name={category.name} 
                            className="w-6 h-6" 
                          />
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="font-black text-foreground text-sm font-heading">{category.name}</span>
                      </td>
                      <td className="p-5">
                        <span className="font-mono text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-lg" dir="ltr">
                          {category.slug}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          category.isActive 
                            ? "bg-green-500/10 text-green-600 border-green-500/20" 
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}>
                          {category.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal(category)}
                            className="p-2 text-blue-600 bg-blue-500/10 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                            title="تعديل القسم والأيقونة"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white rounded-xl transition-all"
                            title="حذف القسم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden p-6 md:p-8 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h3 className="font-black text-lg text-foreground font-heading flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>{editingCategory ? "تعديل القسم والأيقونة" : "إضافة قسم جديد"}</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">اسم القسم / التصنيف</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="مثال: جلود نابا ألمانية، أسقف ألكانتارا..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">الرابط الفرعي (Slug)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-left text-xs font-mono"
                    dir="ltr"
                  />
                </div>

                {/* Icon Selector Button */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">أيقونة التصنيف (المطبقة في المتجر والموقع)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                      <SelectedIconComponent className="w-6 h-6" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsIconModalOpen(true)}
                      className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-2xl text-xs font-black transition-all border border-border flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <span>أيقونة: {ICON_LIBRARY.find(i => i.name === formData.iconName)?.label || formData.iconName}</span>
                      </span>
                      <span className="text-[11px] text-primary font-black flex items-center gap-1">
                        <span>تغيير الأيقونة</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground">صورة خارجية مخصصة (اختياري - في حال عدم الرغبة في الأيقونة)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="رابط الصورة https://..."
                      className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-left text-xs font-sans"
                      dir="ltr"
                    />
                    <label className="bg-muted hover:bg-muted/80 text-foreground px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-border">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>رفع</span>
                    </label>
                  </div>
                  {formData.imageUrl && formData.imageUrl.startsWith("http") && (
                    <div className="mt-2 relative h-28 rounded-2xl overflow-hidden border border-border bg-muted">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveCategory"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded-md border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActiveCategory" className="text-xs font-bold text-foreground cursor-pointer">
                    تفعيل هذا القسم في المتجر والصفحة الرئيسية
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-muted-foreground hover:bg-muted rounded-2xl font-bold text-xs transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl font-black text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{editingCategory ? "حفظ التعديلات وتطبيق الأيقونة" : "إضافة القسم"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Icon Picker Search Modal */}
      <AnimatePresence>
        {isIconModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <div>
                  <h3 className="font-black text-base text-foreground font-heading flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> مكتبة أيقونات السيارات والتنجيد
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">انقر على الأيقونة لاختيارها وتطبيقها فورياً على الموقع</p>
                </div>
                <button onClick={() => setIsIconModalOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Icon Search Bar */}
              <div className="p-4 border-b border-border bg-background">
                <div className="relative">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                    placeholder="ابحث بالعربية أو الإنجليزية (مثال: جلد، كرسي، تابلوه، سيارة، مقص، نانو...)"
                    className="w-full pl-4 pr-10 py-2.5 bg-muted/50 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Icons Grid */}
              <div className="p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredIcons.map((item) => {
                  const Icon = CATEGORY_ICON_MAP[item.name] || Sofa;
                  const isSelected = formData.iconName === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, iconName: item.name, imageUrl: "" }));
                        setIsIconModalOpen(false);
                        toast.success(`تم اختيار أيقونة (${item.label})`);
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all group ${
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105" 
                          : "bg-muted/30 border-border hover:border-primary/50 hover:bg-card text-foreground hover:scale-102"
                      }`}
                    >
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold truncate w-full text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsIconModalOpen(false)}
                  className="px-5 py-2 bg-muted text-foreground rounded-xl text-xs font-bold hover:bg-muted/80"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

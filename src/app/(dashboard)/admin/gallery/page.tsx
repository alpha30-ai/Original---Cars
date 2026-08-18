"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Save, X, Loader2, Search, Filter, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    order: 0,
    isActive: true
  });

  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch gallery items", error);
      toast.error("فشل في تحميل صور المعرض");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || "",
        imageUrl: item.imageUrl,
        order: item.order,
        isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        order: items.length,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await fetch("/api/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...formData })
        });
        toast.success("تم تحديث صورة المعرض بنجاح");
      } else {
        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        toast.success("تمت إضافة الصورة بنجاح");
      }
      fetchItems();
      closeModal();
    } catch (error) {
      toast.error("فشل في حفظ الصورة");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
    
    try {
      await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      toast.success("تم الحذف بنجاح");
      fetchItems();
    } catch (error) {
      toast.error("فشل في حذف الصورة");
    }
  };

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeFilter === "ACTIVE" && !item.isActive) return false;
      if (activeFilter === "INACTIVE" && item.isActive) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch) return false;
      }

      return true;
    });
  }, [items, activeFilter, searchQuery]);

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">معرض الأعمال والإنجازات</h1>
            <p className="text-muted-foreground mt-1 text-sm">إدارة صور وفيديوهات أعمال أورجينال لعرضها للعملاء</p>
          </div>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة عمل جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إجمالي صور المعرض</p>
            <h3 className="text-2xl font-black text-foreground">{items.length}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">الصور النشطة في الموقع</p>
            <h3 className="text-2xl font-black text-foreground">{items.filter((i) => i.isActive).length}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بعنوان العمل أو الوصف..."
              className="w-full pl-4 pr-12 py-3.5 bg-background border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg hover:bg-muted/80"
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
              { id: "INACTIVE", label: "مخفي" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
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

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-3xl border border-border gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground">جاري تحميل صور المعرض...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-3xl border border-border shadow-sm text-muted-foreground p-6 text-center">
          <ImageIcon className="w-16 h-16 mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-foreground mb-1">لا توجد أعمال مطابقة</h3>
          <p className="text-sm">لم نعثر على أي صور تطابق معايير البحث والفلترة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm group hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={item.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+Image"}
                />
                {!item.isActive && (
                  <div className="absolute top-3 right-3 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm">
                    مخفي
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button 
                    onClick={() => openModal(item)}
                    className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-2xl backdrop-blur-md transition-colors shadow-lg"
                    title="تعديل"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="bg-destructive/80 hover:bg-destructive text-white p-3 rounded-2xl backdrop-blur-md transition-colors shadow-lg"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {item.description || "لا يوجد وصف"}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
                  <span className="font-bold">الترتيب: {item.order}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <h2 className="text-xl font-black text-foreground">
                  {editingItem ? "تعديل صورة العمل" : "إضافة صورة جديدة للمعرض"}
                </h2>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors p-1 bg-background rounded-full border border-border">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">عنوان العمل</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-semibold"
                    placeholder="مثال: تنجيد مقاعد مرسيدس S-Class..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">رابط الصورة (URL)</label>
                  <input 
                    type="url" 
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-left text-sm"
                    placeholder="https://..."
                    dir="ltr"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2 relative h-32 rounded-2xl overflow-hidden border border-border bg-muted">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+Image"} />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">الوصف</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm min-h-[90px] resize-y"
                    placeholder="وصف تفصيلي للعمل المنجز والخامات المستخدمة..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">الترتيب</label>
                    <input 
                      type="number" 
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">حالة العرض</label>
                    <div className="flex items-center h-[50px]">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="mr-3 text-sm font-bold text-foreground">
                          {formData.isActive ? "نشط" : "مخفي"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{saving ? "جاري الحفظ..." : "حفظ الصورة"}</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-6 py-3.5 bg-muted text-muted-foreground hover:bg-muted/80 rounded-2xl font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

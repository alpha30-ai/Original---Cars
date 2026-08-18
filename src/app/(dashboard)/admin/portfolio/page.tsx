"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
export default function AdminPortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Item State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (res.ok) setItems(data.items);
    } catch (error) {
      toast.error("حدث خطأ في تحميل معرض الأعمال");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return toast.error("يرجى إدخال العنوان والصورة");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, imageUrl, isActive: true }),
      });
      if (!res.ok) throw new Error("فشل في إضافة العمل");
      
      toast.success("تم إضافة العمل بنجاح");
      setIsAdding(false);
      setTitle("");
      setDescription("");
      setImageUrl("");
      fetchItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العمل؟")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل في الحذف");
      toast.success("تم الحذف بنجاح");
      fetchItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-foreground">معرض الأعمال</h2>
        <p className="text-sm text-muted-foreground mt-1">إدارة صور الأعمال السابقة للمركز</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة عمل جديد
        </button>
      </div>

      {isAdding && (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">تفاصيل العمل الجديد</h3>
          <form onSubmit={handleAddItem} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-bold mb-2">عنوان العمل</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="مثال: تجديد مقصورة مرسيدس..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">وصف مختصر</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                rows={3}
                placeholder="التفاصيل..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">صورة العمل</label>
              {imageUrl ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border mb-4">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-sm">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl text-primary font-bold hover:bg-primary/10 transition-colors cursor-pointer relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      toast.loading("جاري رفع الصورة...", { id: "upload" });
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");
                      try {
                        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                          method: "POST",
                          body: formData
                        });
                        const data = await res.json();
                        if (data.secure_url) {
                          setImageUrl(data.secure_url);
                          toast.success("تم رفع الصورة بنجاح", { id: "upload" });
                        } else {
                          toast.error("فشل رفع الصورة", { id: "upload" });
                        }
                      } catch (err) {
                        toast.error("حدث خطأ أثناء الرفع", { id: "upload" });
                      }
                    }}
                  />
                  <ImageIcon className="w-6 h-6" />
                  رفع صورة من الجهاز
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2.5 rounded-xl font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                حفظ وإضافة
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center flex flex-col items-center justify-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-bold text-lg mb-1">لا توجد أعمال مضافة</h3>
          <p className="text-muted-foreground text-sm">أضف بعض الأعمال لعرضها في الموقع</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="relative h-48 bg-muted">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute top-3 right-3 bg-red-500/90 text-white p-2 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-foreground line-clamp-1 mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Tag,
  ArrowUpDown,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import Script from "next/script";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  imageUrl: string | null;
  images: string[];
  stock: number;
  categoryId: string | null;
  categoryIds: string[];
  category: string;
  tags: string[];
  isActive: boolean;
  categories?: { id: string; name: string }[];
};

type Category = {
  id: string;
  name: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL"); // ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE
  const [sortBy, setSortBy] = useState<"NEWEST" | "PRICE_HIGH" | "PRICE_LOW" | "STOCK_HIGH" | "STOCK_LOW">("NEWEST");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    categoryId: "",
    categoryIds: [] as string[],
    category: "GENERAL",
    imageUrl: "",
    images: [] as string[],
    tags: "",
    isActive: true,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        oldPrice: product.oldPrice ? product.oldPrice.toString() : "",
        stock: product.stock.toString(),
        categoryId: product.categoryId || "",
        categoryIds: product.categories?.map((c) => c.id) || (product.categoryId ? [product.categoryId] : []),
        category: product.category || "GENERAL",
        imageUrl: product.imageUrl || "",
        images: product.images || [],
        tags: product.tags ? product.tags.join(", ") : "",
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        stock: "",
        categoryId: "",
        categoryIds: [],
        category: "GENERAL",
        imageUrl: "",
        images: [],
        tags: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openCloudinaryWidget = (isMultiple: boolean = false) => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.cloudinary) {
      // @ts-ignore
      window.cloudinary.openUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: isMultiple,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            if (isMultiple) {
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, result.info.secure_url],
              }));
              toast.success("تم رفع الصورة الإضافية بنجاح");
            } else {
              setFormData((prev) => ({
                ...prev,
                imageUrl: result.info.secure_url,
              }));
              toast.success("تم رفع الصورة الرئيسية بنجاح");
            }
          }
        }
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        category: formData.categoryIds.length > 0 
          ? categories.find((c) => c.id === formData.categoryIds[0])?.name || "GENERAL"
          : "GENERAL",
        categoryId: formData.categoryIds.length > 0 ? formData.categoryIds[0] : null,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "حدث خطأ");
      }
      
      toast.success(editingId ? "تم تحديث المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("حدث خطأ أثناء الحذف");
      toast.success("تم حذف المنتج بنجاح");
      fetchProducts();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المنتج");
    }
  };

  const toggleCategory = (catId: string) => {
    setFormData((prev) => {
      const isSelected = prev.categoryIds.includes(catId);
      if (isSelected) {
        return { ...prev, categoryIds: prev.categoryIds.filter((id) => id !== catId) };
      } else {
        return { ...prev, categoryIds: [...prev.categoryIds, catId] };
      }
    });
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Filter
        if (categoryFilter !== "ALL") {
          const inCategories = product.categories?.some((c) => c.id === categoryFilter);
          const isDirectCat = product.categoryId === categoryFilter;
          if (!inCategories && !isDirectCat) return false;
        }

        // Stock Filter
        if (stockFilter === "IN_STOCK" && product.stock <= 0) return false;
        if (stockFilter === "LOW_STOCK" && (product.stock > 5 || product.stock <= 0)) return false;
        if (stockFilter === "OUT_OF_STOCK" && product.stock > 0) return false;

        // Active Filter
        if (activeFilter === "ACTIVE" && !product.isActive) return false;
        if (activeFilter === "INACTIVE" && product.isActive) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = product.name?.toLowerCase().includes(q);
          const descMatch = product.description?.toLowerCase().includes(q);
          const tagMatch = product.tags?.some((t) => t.toLowerCase().includes(q));
          const catMatch = product.category?.toLowerCase().includes(q);

          if (!nameMatch && !descMatch && !tagMatch && !catMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") return 0; // already sorted by DB or default
        if (sortBy === "PRICE_HIGH") return b.price - a.price;
        if (sortBy === "PRICE_LOW") return a.price - b.price;
        if (sortBy === "STOCK_HIGH") return b.stock - a.stock;
        if (sortBy === "STOCK_LOW") return a.stock - b.stock;
        return 0;
      });
  }, [products, categoryFilter, stockFilter, activeFilter, searchQuery, sortBy]);

  // Statistics
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("ALL");
    setStockFilter("ALL");
    setActiveFilter("ALL");
    setSortBy("NEWEST");
  };

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      
      <div className="space-y-8 pb-12" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">إدارة وتنسيق المنتجات</h1>
              <p className="text-muted-foreground mt-1 text-sm">إضافة وتعديل المنتجات، تتبع المخزون، والتحكم في الأسعار والتصنيفات</p>
            </div>
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 shrink-0"
          >
            <Plus className="w-5 h-5" /> إضافة منتج جديد
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1">إجمالي المنتجات</p>
              <h3 className="text-2xl font-black text-foreground">{totalCount}</h3>
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1">المنتجات النشطة</p>
              <h3 className="text-2xl font-black text-foreground">{activeCount}</h3>
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1">مخزون منخفض (≤ 5)</p>
              <h3 className="text-2xl font-black text-foreground">{lowStockCount}</h3>
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
              <XCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1">نفذ من المخزون</p>
              <h3 className="text-2xl font-black text-foreground">{outOfStockCount}</h3>
            </div>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المنتج، الوصف، أو الوسوم..."
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

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-3.5 bg-background border border-border rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">جميع التصنيفات</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Stock Dropdown */}
            <div className="md:col-span-2">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full p-3.5 bg-background border border-border rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">حالة المخزون</option>
                <option value="IN_STOCK">متوفر (&gt; 0)</option>
                <option value="LOW_STOCK">منخفض (≤ 5)</option>
                <option value="OUT_OF_STOCK">نفذ (0)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-3.5 bg-background border border-border rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="NEWEST">الأحدث أولاً</option>
                <option value="PRICE_HIGH">السعر: الأعلى</option>
                <option value="PRICE_LOW">السعر: الأقل</option>
                <option value="STOCK_HIGH">المخزون: الأكثر</option>
                <option value="STOCK_LOW">المخزون: الأقل</option>
              </select>
            </div>
          </div>

          {/* Active Status Quick Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground ml-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> حالة الظهور:
              </span>
              {[
                { id: "ALL", label: "الكل" },
                { id: "ACTIVE", label: "نشط في المتجر" },
                { id: "INACTIVE", label: "غير نشط (مخفي)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilter === tab.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(searchQuery || categoryFilter !== "ALL" || stockFilter !== "ALL" || activeFilter !== "ALL") && (
              <button
                onClick={clearFilters}
                className="text-xs text-destructive hover:underline font-bold"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-muted-foreground font-semibold flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              جاري تحميل المنتجات...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground font-semibold bg-card rounded-3xl border border-border flex flex-col items-center">
              <Package className="w-16 h-16 opacity-30 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-1">لا توجد منتجات مطابقة</h3>
              <p className="text-sm">جرب تعديل كلمة البحث أو إزالة بعض الفلاتر</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group flex flex-col">
                <div className="relative aspect-square bg-muted">
                  {product.imageUrl || (product.images && product.images.length > 0) ? (
                    <img 
                      src={product.imageUrl || product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground font-bold text-sm">
                      <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
                      لا توجد صورة
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${product.isActive ? "bg-blue-600 text-white" : "bg-gray-600 text-white"}`}>
                      {product.isActive ? "نشط" : "غير نشط"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                      product.stock > 5 ? "bg-green-600 text-white" : product.stock > 0 ? "bg-amber-600 text-white" : "bg-red-600 text-white"
                    }`}>
                      {product.stock > 0 ? `${product.stock} متوفر` : "نفذ"}
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg" 
                      title="تعديل"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg" 
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-black text-lg text-foreground mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="font-black text-xl text-primary">{product.price.toLocaleString()} <span className="text-xs">ج.م</span></span>
                      {product.oldPrice && (
                        <span className="text-xs line-through text-muted-foreground">{product.oldPrice.toLocaleString()} ج.م</span>
                      )}
                    </div>
                    {product.category && (
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg truncate max-w-[100px]">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-border">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-black">{editingId ? "تعديل بيانات المنتج" : "إضافة منتج جديد"}</h2>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2 mb-4 bg-muted/30 p-3 rounded-2xl border border-border">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange}
                  className="w-5 h-5 text-primary bg-background border-border rounded" 
                />
                <label htmlFor="isActive" className="text-sm font-bold">تفعيل المنتج (عرضه مباشرة في المتجر)</label>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">اسم المنتج</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full p-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm font-semibold" 
                  placeholder="اسم المنتج..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">الوصف</label>
                <textarea 
                  name="description" rows={3} value={formData.description} onChange={handleChange}
                  className="w-full p-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm" 
                  placeholder="وصف تفصيلي ومميزات المنتج..."
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2">السعر الحالي (ج.م)</label>
                  <input 
                    type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange}
                    className="w-full p-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none font-bold" 
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2">السعر القديم قبل الخصم</label>
                  <input 
                    type="number" name="oldPrice" min="0" step="0.01" value={formData.oldPrice} onChange={handleChange}
                    className="w-full p-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2 md:col-span-2">
                  <label className="block text-sm font-bold mb-2">الكمية في المخزون</label>
                  <input 
                    type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange}
                    className="w-full p-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none font-bold" 
                    placeholder="0"
                  />
                </div>
                <div className="col-span-2 md:col-span-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-foreground">الأقسام والتصنيفات</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={fetchCategories}
                        className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1"
                        title="تحديث قائمة التصنيفات"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>تحديث</span>
                      </button>
                      <span className="text-muted-foreground/40">•</span>
                      <a
                        href="/admin/categories"
                        target="_blank"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>إضافة قسم جديد</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl border border-border bg-background min-h-[50px] items-center">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors border border-border/50">
                        <input 
                          type="checkbox" 
                          checked={formData.categoryIds.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="w-4 h-4 text-primary rounded border-border"
                        />
                        <span className="text-xs font-bold">{cat.name}</span>
                      </label>
                    ))}
                    {categories.length === 0 && (
                      <div className="w-full text-center py-2 text-xs text-muted-foreground">
                        لا توجد أقسام مسجلة حتى الآن.{" "}
                        <a href="/admin/categories" target="_blank" className="font-bold text-primary hover:underline">
                          اضغط هنا لإضافة أقسام للمتجر
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">الكلمات الدلالية (Tags)</label>
                <input 
                  type="text" name="tags" value={formData.tags} onChange={handleChange}
                  className="w-full p-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm" 
                  placeholder="جلد طبيعي, أسود, تنجيد مرسيدس..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">الصورة الرئيسية</label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 rounded-2xl object-cover border border-border" />
                  )}
                  <button 
                    type="button" onClick={() => openCloudinaryWidget(false)}
                    className="flex-1 border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-primary transition-all"
                  >
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-bold">رفع / اختيار الصورة الرئيسية</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">صور إضافية للمنتج</label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-2xl border border-border overflow-hidden">
                      <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" onClick={() => handleRemoveImage(i)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-xl hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button" onClick={() => openCloudinaryWidget(true)}
                  className="w-full border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-primary transition-all"
                >
                  <ImageIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">إضافة صور زوايا أخرى للمنتج</span>
                </button>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" disabled={isSubmitting}
                  className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {editingId ? "حفظ التعديلات" : "إضافة المنتج للمتجر"}
                </button>
                <button 
                  type="button" onClick={handleCloseModal}
                  className="px-6 py-3.5 bg-muted text-muted-foreground rounded-2xl font-bold hover:bg-muted/80"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

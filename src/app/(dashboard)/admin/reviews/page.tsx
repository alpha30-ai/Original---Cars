"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Star, 
  Search, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MessageSquare, 
  Loader2, 
  ShoppingBag, 
  User as UserIcon,
  Filter,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import toast from "react-hot-toast";
import Link from "next/link";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
    price: number;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        toast.error("فشل في تحميل التعليقات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: !currentStatus }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isApproved: !currentStatus } : r))
        );
        toast.success(
          !currentStatus ? "تم اعتماد ونشر التعليق" : "تم إلغاء اعتماد التعليق وإخفائه"
        );
      } else {
        toast.error("فشل في تحديث حالة التعليق");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا التعليق نهائياً؟")) return;

    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("تم حذف التعليق بنجاح");
      } else {
        toast.error("فشل في حذف التعليق");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      // Status filter
      if (statusFilter === "APPROVED" && !review.isApproved) return false;
      if (statusFilter === "PENDING" && review.isApproved) return false;

      // Rating filter
      if (ratingFilter !== "ALL" && review.rating !== Number(ratingFilter)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const commentMatch = review.comment.toLowerCase().includes(q);
        const userNameMatch = review.user?.name?.toLowerCase().includes(q);
        const userEmailMatch = review.user?.email?.toLowerCase().includes(q);
        const productNameMatch = review.product?.name?.toLowerCase().includes(q);

        if (!commentMatch && !userNameMatch && !userEmailMatch && !productNameMatch) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, statusFilter, ratingFilter, searchQuery]);

  // Statistics
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
            <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">إدارة التعليقات والمراجعات</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              مراجعة وتقييم آراء العملاء على المنتجات والتحكم في ظهورها
            </p>
          </div>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="px-5 py-2.5 bg-muted text-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إجمالي التعليقات</p>
            <h3 className="text-2xl font-black text-foreground">{totalReviews}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">التعليقات المعتمدة (منشورة)</p>
            <h3 className="text-2xl font-black text-foreground">{approvedCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">بانتظار المراجعة</p>
            <h3 className="text-2xl font-black text-foreground">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">متوسط التقييمات</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-foreground">{avgRating}</h3>
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم العميل، المنتج، أو نص التعليق..."
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

          {/* Rating Filter */}
          <div className="w-full md:w-48">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full p-3.5 bg-background border border-border rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">جميع التقييمات (★)</option>
              <option value="5">★★★★★ (5 نجوم)</option>
              <option value="4">★★★★☆ (4 نجوم)</option>
              <option value="3">★★★☆☆ (3 نجوم)</option>
              <option value="2">★★☆☆☆ (نجمتان)</option>
              <option value="1">★☆☆☆☆ (نجمة واحدة)</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-border/50">
          <span className="text-xs font-bold text-muted-foreground ml-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> الحالة:
          </span>
          {[
            { id: "ALL", label: `الكل (${totalReviews})` },
            { id: "PENDING", label: `بانتظار المراجعة (${pendingCount})` },
            { id: "APPROVED", label: `المعتمدة (${approvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center bg-card rounded-3xl border border-border text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-bold text-sm">جاري تحميل التعليقات...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-card rounded-3xl border border-border text-muted-foreground text-center p-6">
            <MessageSquare className="w-16 h-16 opacity-30 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">لا توجد تعليقات مطابقة</h3>
            <p className="text-sm">جرب تغيير معايير البحث أو تصفية الحالة</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-card rounded-3xl border p-6 md:p-8 transition-all hover:shadow-md ${
                review.isApproved
                  ? "border-border"
                  : "border-amber-500/40 bg-amber-500/[0.02]"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* User & Product Info */}
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden shrink-0 border border-border flex items-center justify-center">
                    {review.user?.avatarUrl ? (
                      <img
                        src={review.user.avatarUrl}
                        alt={review.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-black text-foreground text-base">
                        {review.user?.name || "عميل أورجينال"}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {review.user?.email}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {format(new Date(review.createdAt), "yyyy/MM/dd - hh:mm a", { locale: ar })}
                      </span>
                    </div>

                    {/* Product Badge */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-6 h-6 rounded-md bg-muted overflow-hidden shrink-0 border border-border">
                        {review.product?.imageUrl ? (
                          <img
                            src={review.product.imageUrl}
                            alt={review.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-4 h-4 p-0.5 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-primary">
                        المنتج: {review.product?.name || "منتج عام"}
                      </span>
                      {review.product?.price && (
                        <span className="text-xs text-muted-foreground">
                          ({review.product.price} ج.م)
                        </span>
                      )}
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1 pt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-black mr-2 text-foreground">
                        {review.rating} من 5
                      </span>
                    </div>

                    {/* Comment Content */}
                    <p className="text-sm text-foreground/90 font-medium pt-3 leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/50">
                      "{review.comment}"
                    </p>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-black border ${
                        review.isApproved
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}
                    >
                      {review.isApproved ? "معتمد (منشور)" : "بانتظار الاعتماد"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApprove(review.id, review.isApproved)}
                      disabled={updatingId === review.id}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        review.isApproved
                          ? "bg-muted text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 border border-border"
                          : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20"
                      }`}
                      title={review.isApproved ? "إلغاء الاعتماد وإخفاء التعليق" : "اعتماد ونشر التعليق"}
                    >
                      {updatingId === review.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : review.isApproved ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          إلغاء النشر
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          اعتماد ونشر
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={updatingId === review.id}
                      className="p-2 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all border border-destructive/20"
                      title="حذف التعليق نهائياً"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

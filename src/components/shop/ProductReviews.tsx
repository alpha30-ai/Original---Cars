"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, CheckCircle2, Loader2, User, MessageSquarePlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import toast from "react-hot-toast";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl: string | null;
  };
};

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("يرجى تسجيل الدخول أولاً لإضافة تقييم");
      return;
    }

    if (!comment.trim()) {
      toast.error("الرجاء كتابة تعليق");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        toast.success("تمت إضافة تقييمك بنجاح");
        setComment("");
        setRating(5);
        setShowForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        const data = await res.json();
        toast.error(data.error || "حدث خطأ أثناء إضافة التقييم");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0";

  return (
    <div className="mb-24 pt-16 border-t border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
            تقييمات العملاء
            {reviews.length > 0 && (
              <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                {averageRating} <Star className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium">مراجعات حقيقية من عملائنا بعد تجربة المنتج</p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => {
              if (!session) {
                toast.error("يرجى تسجيل الدخول أولاً لإضافة تقييم");
                return;
              }
              setShowForm(true);
            }}
            className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            أضف تقييمك
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4 text-foreground">تقييمك للمنتج</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-muted-foreground">التقييم العام</label>
            <div className="flex gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`w-8 h-8 transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-400/50'}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-muted-foreground">تعليقك (مطلوب)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تجربتك مع هذا المنتج..."
              required
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl text-muted-foreground font-bold hover:bg-muted transition-colors text-sm"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all disabled:opacity-70 flex items-center gap-2 text-sm"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              نشر التقييم
            </button>
          </div>
        </form>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-card p-12 rounded-2xl border border-border text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">لا توجد تقييمات بعد</h3>
          <p className="text-sm text-muted-foreground">كن أول من يشارك تجربته حول هذا المنتج.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                  {review.user.avatarUrl ? (
                    <img src={review.user.avatarUrl} alt={review.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-sm line-clamp-1">{review.user.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-3">
                "{review.comment}"
              </p>
              <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-border/50">
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: ar })}
                </span>
                <span className="font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> مشتري
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

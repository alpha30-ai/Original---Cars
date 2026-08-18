"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Save, 
  Loader2, 
  DollarSign, 
  Smartphone, 
  Truck, 
  FileCheck, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  MessageCircle, 
  X, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Calendar,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import toast from "react-hot-toast";

type ReceiptItem = {
  id: string;
  type: "ORDER" | "BOOKING";
  typeName: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  receiptUrl: string;
  createdAt: string;
  details: string;
};

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"receipts" | "gateways">("receipts");

  // Gateway Settings
  const [instapayAccount, setInstapayAccount] = useState("");
  const [vodafoneNumber, setVodafoneNumber] = useState("");
  const [enableInstapay, setEnableInstapay] = useState(false);
  const [enableVodafone, setEnableVodafone] = useState(false);
  const [enableCod, setEnableCod] = useState(true);
  
  // Receipts State
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const [receiptFilter, setReceiptFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = () => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.payment_instapay_account !== undefined) setInstapayAccount(data.payment_instapay_account);
        if (data.payment_vodafone_number !== undefined) setVodafoneNumber(data.payment_vodafone_number);
        if (data.payment_enable_instapay !== undefined) setEnableInstapay(data.payment_enable_instapay === "true" || data.payment_enable_instapay === true);
        if (data.payment_enable_vodafone !== undefined) setEnableVodafone(data.payment_enable_vodafone === "true" || data.payment_enable_vodafone === true);
        if (data.payment_enable_cod !== undefined) setEnableCod(data.payment_enable_cod === "true" || data.payment_enable_cod === true);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const fetchReceipts = async () => {
    try {
      setReceiptsLoading(true);
      const res = await fetch("/api/admin/receipts");
      if (!res.ok) throw new Error("فشل في جلب الإيصالات");
      const data = await res.json();
      setReceipts(data.receipts || []);
    } catch (e) {
      toast.error("حدث خطأ أثناء تحميل الإيصالات المرفقة");
    } finally {
      setReceiptsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchReceipts();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            payment_instapay_account: instapayAccount,
            payment_vodafone_number: vodafoneNumber,
            payment_enable_instapay: String(enableInstapay),
            payment_enable_vodafone: String(enableVodafone),
            payment_enable_cod: String(enableCod),
          }
        }),
      });
      
      if (res.ok) {
        toast.success("تم تحديث وحفظ بيانات بوابات الدفع بنجاح!");
      } else {
        toast.error("حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setIsSaving(false);
    }
  };

  const updateReceiptStatus = async (id: string, type: "ORDER" | "BOOKING", paymentStatus: string, status?: string) => {
    try {
      const res = await fetch("/api/admin/receipts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, paymentStatus, status }),
      });

      if (res.ok) {
        toast.success("تم تحديث حالة الإيصال والطلب بنجاح!");
        fetchReceipts();
      } else {
        toast.error("فشل التحديث");
      }
    } catch (e) {
      toast.error("حدث خطأ في الاتصال");
    }
  };

  // Filtered Receipts
  const filteredReceipts = receipts.filter((r) => {
    if (receiptFilter === "PENDING" && r.paymentStatus !== "PENDING") return false;
    if (receiptFilter === "PAID" && r.paymentStatus !== "PAID") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.customerName.toLowerCase().includes(q);
      const matchPhone = r.customerPhone.includes(q);
      const matchDetails = r.details.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchDetails && !matchId) return false;
    }
    return true;
  });

  const pendingCount = receipts.filter((r) => r.paymentStatus === "PENDING").length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16" dir="rtl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">
              إدارة المدفوعات وتدقيق الإيصالات المرفقة
            </h1>
            <p className="text-muted-foreground mt-1 text-xs md:text-sm">
              معاينة وفحص إيصالات فودافون كاش وإنستاباي وتأكيد الدفع بضغطة واحدة
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-muted p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setActiveTab("receipts")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "receipts"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>تدقيق الإيصالات</span>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("gateways")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "gateways"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>حسابات بوابات الدفع</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RECEIPTS AUDIT HUB */}
      {activeTab === "receipts" && (
        <div className="space-y-6">
          
          {/* Stats and Filter Bar */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم العميل، الهاتف، أو رقم المعاملة..."
                className="w-full pl-4 pr-11 py-3 bg-background border border-border rounded-2xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-muted-foreground ml-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> حالة الإيصال:
              </span>
              {[
                { id: "ALL", label: "الكل" },
                { id: "PENDING", label: `بانتظار المراجعة (${pendingCount})` },
                { id: "PAID", label: "معتمد ومدفوع" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReceiptFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    receiptFilter === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Receipts Grid / List */}
          {receiptsLoading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3 bg-card rounded-3xl border border-border">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="font-bold text-xs text-muted-foreground">جاري تحميل الإيصالات المرفقة...</p>
            </div>
          ) : filteredReceipts.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground bg-card rounded-3xl border border-border flex flex-col items-center">
              <FileCheck className="w-16 h-16 opacity-30 mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1 font-heading">لا توجد إيصالات مطابقة</h3>
              <p className="text-xs">لم يتم العثور على أي إيصالات تحويل مطابقة للفلترة الحالية</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReceipts.map((receipt) => {
                const isPending = receipt.paymentStatus === "PENDING";

                return (
                  <div 
                    key={receipt.id} 
                    className="bg-card rounded-3xl border border-border hover:border-primary/40 transition-all p-6 shadow-sm flex flex-col justify-between space-y-5 group"
                  >
                    {/* Top Info */}
                    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg ${
                            receipt.type === "ORDER" ? "bg-blue-500/10 text-blue-600" : "bg-purple-500/10 text-purple-600"
                          }`}>
                            {receipt.typeName}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                            #{receipt.id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-black text-sm text-foreground font-heading">
                          {receipt.customerName}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium" dir="ltr">
                          {receipt.customerPhone || receipt.customerEmail || "—"}
                        </p>
                      </div>

                      <div className="text-left space-y-1">
                        <span className="text-base font-black text-primary font-heading block">
                          {receipt.amount.toLocaleString()} ج.م
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          isPending 
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}>
                          {isPending ? "قيد التدقيق ⏳" : "تم الاعتماد ✓"}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Details and Attached Receipt Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-7 space-y-2 text-xs">
                        <p className="text-muted-foreground">
                          طريقة التحويل: <strong className="text-foreground">{receipt.paymentMethod}</strong>
                        </p>
                        <p className="text-muted-foreground line-clamp-2">
                          البيانات: <span className="text-foreground font-medium">{receipt.details}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          تاريخ التحويل: {format(new Date(receipt.createdAt), "yyyy/MM/dd (hh:mm a)", { locale: ar })}
                        </p>
                      </div>

                      {/* Receipt Image Thumbnail with Lightbox Click */}
                      <div className="sm:col-span-5 flex flex-col items-center">
                        <div 
                          onClick={() => setSelectedReceiptUrl(receipt.receiptUrl)}
                          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-black/5 cursor-pointer shadow-sm group/img"
                        >
                          <img 
                            src={receipt.receiptUrl} 
                            alt="Receipt" 
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" /> فحص الإيصال
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedReceiptUrl(receipt.receiptUrl)}
                          className="text-[11px] font-black text-primary underline mt-1.5 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> تكبير الصورة
                        </button>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                      {isPending ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => updateReceiptStatus(receipt.id, receipt.type, "PAID", "CONFIRMED")}
                            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تأكيد الإيصال واعتماد الدفع</span>
                          </button>

                          <button
                            onClick={() => updateReceiptStatus(receipt.id, receipt.type, "FAILED")}
                            className="px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white font-bold text-xs rounded-xl transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>رفض</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم اعتماد هذا الإيصال بنجاح</span>
                        </div>
                      )}

                      {receipt.customerPhone && (
                        <a
                          href={`https://wa.me/2${receipt.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`مرحباً ${receipt.customerName}، بخصوص إيصال الدفع لـ #${receipt.id.slice(-8).toUpperCase()} في أورجينال`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors mr-auto"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                          <span>واتساب</span>
                        </a>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: GATEWAY CONFIGURATION */}
      {activeTab === "gateways" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* InstaPay Settings */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
                <DollarSign className="w-5 h-5 text-primary" />
                <span>إنستاباي (InstaPay)</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={enableInstapay} 
                  onChange={(e) => setEnableInstapay(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">معرف أو رقم إنستاباي (IPA)</label>
                <input
                  type="text"
                  value={instapayAccount}
                  onChange={(e) => setInstapayAccount(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: original@instapay أو 01008499476"
                  disabled={!enableInstapay}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                يظهر هذا العنوان للعملاء في صفحة الدفع والحجز مع زر نسخ سريع وصندوق رفع صورة الإيصال.
              </p>
            </div>
          </div>

          {/* Vodafone Cash Settings */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
                <Smartphone className="w-5 h-5 text-primary" />
                <span>فودافون كاش ومحافظ كاش</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={enableVodafone} 
                  onChange={(e) => setEnableVodafone(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">رقم محفظة فودافون كاش</label>
                <input
                  type="text"
                  value={vodafoneNumber}
                  onChange={(e) => setVodafoneNumber(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: 01008499476"
                  disabled={!enableVodafone}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                رقم المحفظة الذي سيقوم العملاء بالتحويل إليه عند طلب المنتجات أو حجز الخدمات.
              </p>
            </div>
          </div>

          {/* Cash on Delivery Settings */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
                <Truck className="w-5 h-5 text-primary" />
                <span>الدفع نقداً أو بالفيزا عند المعاينة والاستلام</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={enableCod} 
                  onChange={(e) => setEnableCod(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              يتيح للعملاء استكمال حجز الورشة أو طلب المتجر مع سداد القيمة نقداً أو ببطاقة الفيزا عند الحضور للمركز.
            </p>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ إعدادات بوابات الدفع</span>
            </button>
          </div>

        </div>
      )}

      {/* Lightbox Zoom Modal for Receipts */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
          <div className="relative bg-card rounded-3xl border border-border p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="font-black text-sm text-foreground flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                <span>معاينة وتدقيق إيصال التحويل المرفق بدقة عالية</span>
              </h3>
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-black/90 rounded-2xl p-2 min-h-[300px]">
              <img 
                src={selectedReceiptUrl} 
                alt="Receipt Full" 
                className="max-h-[70vh] w-auto object-contain rounded-xl" 
              />
            </div>
            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-black text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  FileJson, 
  Save, 
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function BackupPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  // 1. Export Backup JSON
  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) throw new Error("فشل في استخراج النسخة الاحتياطية");
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `original-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("تم تنزيل النسخة الاحتياطية بنجاح!");
    } catch (e: any) {
      toast.error(e.message || "حدث خطأ أثناء أخذ النسخة الاحتياطية");
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Handle Upload File for Restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackupFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setParsedData(json);
        toast.success("تمت قراءة ملف النسخة الاحتياطية بنجاح!");
      } catch (err) {
        toast.error("الملف غير صالح أو تالف، يرجى اختيار ملف JSON صالح");
        setParsedData(null);
      }
    };
    reader.readAsText(file);
  };

  // 3. Execute Restore
  const handleExecuteRestore = async () => {
    if (!parsedData) {
      toast.error("يرجى اختيار ملف نسخة احتياطية أولاً");
      return;
    }

    setIsRestoring(true);
    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "تمت استعادة النسخة الاحتياطية بنجاح!");
        setBackupFile(null);
        setParsedData(null);
      } else {
        toast.error(result.error || "فشل في استعادة البيانات");
      }
    } catch (e) {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setIsRestoring(false);
    }
  };

  // 4. Wipe / Clean Test Transactions
  const handleCleanTransactions = async () => {
    setIsCleaning(true);
    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_test_transactions" }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "تم تنظيف المعاملات بنجاح!");
        setShowCleanModal(false);
      } else {
        toast.error(data.error || "حدث خطأ");
      }
    } catch (e) {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">النسخ الاحتياطي والاستعادة</h1>
            <p className="text-xs md:text-sm text-foreground/75 dark:text-muted-foreground mt-1 font-medium">تصدير واستعادة إعدادات الموقع، المنتجات، الألوان، وتنظيف المعاملات التجريبية</p>
          </div>
        </div>

        <button
          onClick={handleExportBackup}
          disabled={isExporting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>أخذ نسخة احتياطية فورية (JSON)</span>
        </button>
      </div>

      {/* Grid: 3 Main Operation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Panel 1: Export Snapshot */}
        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-foreground font-heading">تصدير نسخة كاملة</h3>
            <p className="text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed font-medium">
              تنزيل ملف JSON يحتوي على كافة إعدادات المظهر، الألوان، الخطوط، أرقام التواصل، الأقسام، المنتجات، والبنرات.
            </p>
          </div>

          <button
            onClick={handleExportBackup}
            disabled={isExporting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>تحميل النسخة الاحتياطية</span>
          </button>
        </div>

        {/* Panel 2: Restore from Backup */}
        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-foreground font-heading">استعادة من ملف</h3>
            <p className="text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed font-medium">
              رفع ملف JSON سبق تنزيله لاستعادة جميع إعدادات وبيانات الموقع بضغطة زر واحدة.
            </p>

            <label className="block border-2 border-dashed border-border hover:border-primary bg-muted/30 p-4 rounded-2xl text-center cursor-pointer transition-colors">
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              <FileJson className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <span className="text-[11px] font-bold text-foreground block">
                {backupFile ? backupFile.name : "اختر ملف الـ Backup (JSON)"}
              </span>
            </label>
          </div>

          <button
            onClick={handleExecuteRestore}
            disabled={isRestoring || !parsedData}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            <span>تأكيد استعادة النسخة</span>
          </button>
        </div>

        {/* Panel 3: Wipe Old Transactions (High Contrast Light & Dark) */}
        <div className="bg-card rounded-3xl border-2 border-red-300 dark:border-red-900/50 shadow-sm p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center border border-red-300 dark:border-red-800/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-red-700 dark:text-red-400 font-heading">تنظيف وحذف المعاملات</h3>
            <p className="text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed font-medium">
              حذف كافة الطلبات السابقة والحجوزات التجريبية لتصفير سجل المعاملات والبدء من جديد مع الحفاظ على المنتجات والإعدادات.
            </p>
          </div>

          <button
            onClick={() => setShowCleanModal(true)}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/25"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف المعاملات والطلبات السابقة</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modal (High Contrast Light & Dark Mode) */}
      <AnimatePresence>
        {showCleanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card w-full max-w-md rounded-3xl border-2 border-border p-6 md:p-8 shadow-2xl space-y-6 text-right"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-800/40">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-foreground font-heading">تأكيد حذف المعاملات السابقة</h3>
                  <p className="text-xs text-foreground/75 dark:text-muted-foreground mt-1 font-medium">
                    هل أنت متأكد من رغبتك في حذف جميع الطلبات والحجوزات السابقة؟ لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  onClick={() => setShowCleanModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors text-xs border border-border"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCleanTransactions}
                  disabled={isCleaning}
                  className="px-5 py-2.5 rounded-xl font-black bg-red-600 hover:bg-red-700 text-white transition-colors text-xs shadow-lg shadow-red-600/30 flex items-center gap-1.5"
                >
                  {isCleaning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>تأكيد الحذف الشامل</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

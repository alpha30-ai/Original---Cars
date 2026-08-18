"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  ShieldCheck, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Mail, 
  Search, 
  Filter, 
  Users, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw,
  ShoppingBag,
  Calendar,
  MessageCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  avatarUrl: string | null;
  phone: string | null;
  city: string | null;
  governorate: string | null;
  address: string | null;
  createdAt: string;
  _count?: {
    orders: number;
    bookings: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, ADMIN, USER
  const [verifiedFilter, setVerifiedFilter] = useState("ALL"); // ALL, VERIFIED, UNVERIFIED
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "NAME" | "ORDERS">("NEWEST");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("فشل في تحميل قائمة المستخدمين");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered and Sorted users
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        // Role Filter
        if (roleFilter !== "ALL" && user.role !== roleFilter) {
          return false;
        }

        // Verification Filter
        if (verifiedFilter === "VERIFIED" && !user.isVerified) return false;
        if (verifiedFilter === "UNVERIFIED" && user.isVerified) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = user.name?.toLowerCase().includes(q);
          const emailMatch = user.email?.toLowerCase().includes(q);
          const phoneMatch = user.phone?.includes(q);
          const cityMatch = user.city?.toLowerCase().includes(q);
          const govMatch = user.governorate?.toLowerCase().includes(q);
          const addrMatch = user.address?.toLowerCase().includes(q);

          if (!nameMatch && !emailMatch && !phoneMatch && !cityMatch && !govMatch && !addrMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "OLDEST") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "NAME") return a.name.localeCompare(b.name, "ar");
        if (sortBy === "ORDERS") return (b._count?.orders || 0) - (a._count?.orders || 0);
        return 0;
      });
  }, [users, roleFilter, verifiedFilter, searchQuery, sortBy]);

  // Statistics
  const totalUsers = users.length;
  const verifiedCount = users.filter((u) => u.isVerified).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const withOrdersCount = users.filter((u) => (u._count?.orders || 0) > 0).length;

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setVerifiedFilter("ALL");
    setSortBy("NEWEST");
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return "2" + cleaned;
    if (!cleaned.startsWith("20") && cleaned.length >= 10) return "20" + cleaned;
    return cleaned;
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">إدارة العملاء والمستخدمين</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              البحث، التواصل، ومتابعة سجل نشاط المستخدمين وحساباتهم المسجلة
            </p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-5 py-2.5 bg-muted text-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all self-start md:self-auto shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث المستخدمين
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">إجمالي المسجلين</p>
            <h3 className="text-2xl font-black text-foreground">{totalUsers}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">حسابات تم التحقق منها</p>
            <h3 className="text-2xl font-black text-foreground">{verifiedCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">المسؤولين (Admins)</p>
            <h3 className="text-2xl font-black text-foreground">{adminCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-1">عملاء لديهم طلبات</p>
            <h3 className="text-2xl font-black text-foreground">{withOrdersCount}</h3>
          </div>
        </div>
      </div>

      {/* Advanced Search & Filtering Toolbar */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، البريد الإلكتروني، الهاتف، المحافظة، أو العنوان..."
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

          {/* Verification Dropdown */}
          <div className="md:col-span-3">
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="w-full p-3.5 bg-background border border-border rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">جميع حالات التحقق</option>
              <option value="VERIFIED">حساب مفعل (تم التحقق)</option>
              <option value="UNVERIFIED">غير مفعل (لم يتم التحقق)</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-3.5 bg-background border border-border rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="NEWEST">الأحدث تسجيلاً</option>
              <option value="OLDEST">الأقدم تسجيلاً</option>
              <option value="NAME">الاسم (أبجدياً)</option>
              <option value="ORDERS">الأكثر طلباً</option>
            </select>
          </div>
        </div>

        {/* Roles Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground ml-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> الصلاحية:
            </span>
            {[
              { id: "ALL", label: `الكل (${totalUsers})` },
              { id: "USER", label: `العملاء (${totalUsers - adminCount})` },
              { id: "ADMIN", label: `المسؤولين (${adminCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  roleFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(searchQuery || roleFilter !== "ALL" || verifiedFilter !== "ALL") && (
            <button
              onClick={clearFilters}
              className="text-xs text-destructive hover:underline font-bold"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-bold text-sm text-muted-foreground">جاري تحميل بيانات المستخدمين...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground font-semibold flex flex-col items-center">
            <Users className="w-16 h-16 opacity-30 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">لا يوجد مستخدمين مطابقين</h3>
            <p className="text-sm">لم نعثر على أي مستخدم يطابق معايير البحث والفلترة المحددة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="p-5 font-bold text-muted-foreground whitespace-nowrap">المستخدم</th>
                  <th className="p-5 font-bold text-muted-foreground whitespace-nowrap">معلومات الاتصال والتواصل</th>
                  <th className="p-5 font-bold text-muted-foreground whitespace-nowrap">الموقع والعنوان</th>
                  <th className="p-5 font-bold text-muted-foreground whitespace-nowrap">النشاط (طلبات/حجوزات)</th>
                  <th className="p-5 font-bold text-muted-foreground whitespace-nowrap">الصلاحية</th>
                  <th className="p-5 font-bold text-muted-foreground whitespace-nowrap">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border shrink-0 shadow-sm">
                            <img 
                              src={user.avatarUrl} 
                              alt={user.name} 
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <UserIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold flex items-center gap-2 whitespace-nowrap text-foreground">
                            {user.name}
                            {user.isVerified ? (
                              <span title="تم التحقق من الحساب"><ShieldCheck className="w-4 h-4 text-green-500" /></span>
                            ) : (
                              <span title="حساب غير مفعل"><XCircle className="w-4 h-4 text-muted-foreground/40" /></span>
                            )}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        {user.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground" dir="ltr">{user.phone}</span>
                            <a
                              href={`https://wa.me/${formatPhoneNumber(user.phone)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors"
                              title="مراسلة عبر واتساب"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${user.phone}`}
                              className="p-1.5 bg-muted text-foreground hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                              title="اتصال هاتفي"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">—</span>
                        )}

                        <a
                          href={`mailto:${user.email}`}
                          className="p-1.5 bg-muted text-foreground hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                          title="إرسال بريد إلكتروني"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="p-5">
                      {(user.city || user.governorate || user.address) ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                          <span className="truncate max-w-[180px]">
                            {user.city && user.governorate 
                              ? `${user.city}، ${user.governorate}`
                              : user.city || user.governorate || user.address}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2.5 py-1 bg-muted rounded-lg font-bold text-foreground flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3 text-primary" /> {user._count?.orders || 0} طلب
                        </span>
                        <span className="px-2.5 py-1 bg-muted rounded-lg font-bold text-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-accent" /> {user._count?.bookings || 0} حجز
                        </span>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        user.role === "ADMIN" 
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" 
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {user.role === "ADMIN" ? "مدير النظام" : "عميل مسجل"}
                      </span>
                    </td>

                    <td className="p-5 font-medium text-muted-foreground text-xs whitespace-nowrap">
                      {format(new Date(user.createdAt), "yyyy/MM/dd", { locale: ar })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

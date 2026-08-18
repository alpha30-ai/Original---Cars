// ========================
// TypeScript Definitions
// ========================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  images?: string[];
  tags?: string[];
  oldPrice?: number | null;
  isActive?: boolean;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  address: string;
  phone: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  serviceType: ServiceType;
  carType: string;
  carModel: string;
  notes: string;
  date: Date;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ========================
// Enums
// ========================

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
export type PaymentMethod = "INSTAPAY" | "VODAFONE_CASH" | "CASH";
export type ServiceType = "UPHOLSTERY" | "POLISHING" | "LEATHER_REPAIR" | "FULL_CLEANING";

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  UPHOLSTERY: "تركيب فرش كراسي",
  POLISHING: "تلميع وحماية النانو",
  LEATHER_REPAIR: "إصلاح وتجديد الجلود",
  FULL_CLEANING: "تنظيف شامل للمقصورة",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "تم التأكيد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "في انتظار الدفع",
  PAID: "تم الدفع",
  FAILED: "فشل الدفع",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  INSTAPAY: "إنستا باي",
  VODAFONE_CASH: "فودافون كاش",
  CASH: "نقداً عند الاستلام",
};

// ========================
// NextAuth Session Extension
// ========================

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

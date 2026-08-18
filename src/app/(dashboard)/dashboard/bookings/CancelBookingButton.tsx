"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟")) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء إلغاء الحجز");
      }

      toast.success("تم إلغاء الحجز بنجاح");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50"
    >
      {isLoading ? "جاري الإلغاء..." : "إلغاء الحجز"}
    </button>
  );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ message: "البريد الإلكتروني والرمز مطلوبان" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
    }

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return NextResponse.json({ message: "الرمز غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await prisma.oTP.delete({ where: { id: otpRecord.id } });

    return NextResponse.json({ message: "تم تفعيل الحساب بنجاح" });
  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء التحقق" }, { status: 500 });
  }
}

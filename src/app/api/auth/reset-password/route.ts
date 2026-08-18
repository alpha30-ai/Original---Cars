import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "بيانات غير صحيحة" }, { status: 400 });
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, isVerified: true },
    });

    await prisma.oTP.delete({ where: { id: otpRecord.id } });

    return NextResponse.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء تغيير كلمة المرور" }, { status: 500 });
  }
}

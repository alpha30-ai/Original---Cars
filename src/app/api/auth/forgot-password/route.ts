import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // نرسل رسالة نجاح وهمية لأسباب أمنية (حتى لا يتم فحص الإيميلات المسجلة)
      return NextResponse.json({ message: "إذا كان البريد مسجلاً، فسيتم إرسال رمز الاستعادة إليه" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.deleteMany({ where: { userId: user.id } });

    await prisma.oTP.create({
      data: {
        code,
        userId: user.id,
        expiresAt,
      },
    });

    await sendOTPEmail(email, code);

    return NextResponse.json({ message: "إذا كان البريد مسجلاً، فسيتم إرسال رمز الاستعادة إليه" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء معالجة الطلب" }, { status: 500 });
  }
}

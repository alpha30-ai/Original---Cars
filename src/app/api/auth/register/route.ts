import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if this is the very first user in the database
    const usersCount = await prisma.user.count();
    const role = usersCount === 0 ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
        isVerified: false,
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oTP.create({
      data: {
        code,
        userId: user.id,
        expiresAt,
      },
    });

    await sendOTPEmail(email, code);

    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح. يرجى مراجعة بريدك لتفعيل الحساب.", role }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء التسجيل" }, { status: 500 });
  }
}

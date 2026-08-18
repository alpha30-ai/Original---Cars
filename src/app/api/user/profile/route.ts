import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/email";

// Get Profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, avatarUrl: true, role: true, phone: true, address: true, city: true, governorate: true }
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
  }
}

// Request OTP for sensitive changes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oTP.deleteMany({ where: { userId: user.id } });
    
    await prisma.oTP.create({
      data: { code, userId: user.id, expiresAt }
    });

    await sendOTPEmail(user.email, code);

    return NextResponse.json({ message: "تم إرسال كود التحقق إلى بريدك الإلكتروني" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

// Update Profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { name, avatarUrl, email, password, otp, phone, address, city, governorate } = body;

    // If changing email or password, require OTP
    if ((email && email !== user.email) || password) {
      if (!otp) return NextResponse.json({ error: "كود التحقق مطلوب لتغيير البيانات الحساسة" }, { status: 400 });

      const validOTP = await prisma.oTP.findFirst({
        where: {
          userId: user.id,
          code: otp,
          expiresAt: { gt: new Date() }
        }
      });

      if (!validOTP) return NextResponse.json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 });

      // Delete used OTP
      await prisma.oTP.delete({ where: { id: validOTP.id } });
    }

    const updateData: any = { name, avatarUrl, phone, address, city, governorate };
    
    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
      updateData.email = email;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { 
        id: true, 
        name: true, 
        email: true, 
        avatarUrl: true, 
        role: true,
        phone: true,
        address: true,
        city: true,
        governorate: true
      }
    });

    return NextResponse.json({ message: "تم تحديث البيانات بنجاح", user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

// Delete Profile
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const url = new URL(request.url);
    const otp = url.searchParams.get("otp");

    if (!otp) return NextResponse.json({ error: "كود التحقق مطلوب لحذف الحساب" }, { status: 400 });

    const validOTP = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        code: otp,
        expiresAt: { gt: new Date() }
      }
    });

    if (!validOTP) return NextResponse.json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 });

    await prisma.user.delete({ where: { id: user.id } });

    return NextResponse.json({ message: "تم حذف الحساب بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

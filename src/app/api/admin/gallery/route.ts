import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
    }

    const items = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, imageUrl, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "الرجاء إدخال العنوان والصورة" }, { status: 400 });
    }

    const item = await prisma.gallery.create({
      data: {
        title,
        description,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

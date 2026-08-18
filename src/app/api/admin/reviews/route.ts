import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "غير مصرح لك بإجراء هذه العملية" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "ALL", "APPROVED", "PENDING"
    const rating = searchParams.get("rating");
    const search = searchParams.get("search");

    const where: any = {};

    if (status === "APPROVED") {
      where.isApproved = true;
    } else if (status === "PENDING") {
      where.isApproved = false;
    }

    if (rating && !isNaN(Number(rating))) {
      where.rating = Number(rating);
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { comment: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { product: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Fetch Admin Reviews Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء جلب التعليقات" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "غير مصرح لك بإجراء هذه العملية" }, { status: 403 });
    }

    const body = await req.json();
    const { id, isApproved, comment, rating } = body;

    if (!id) {
      return NextResponse.json({ message: "معرف التعليق مطلوب" }, { status: 400 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(typeof isApproved === "boolean" ? { isApproved } : {}),
        ...(comment ? { comment } : {}),
        ...(rating ? { rating: Number(rating) } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        product: {
          select: { id: true, name: true, imageUrl: true, price: true },
        },
      },
    });

    return NextResponse.json({
      message: "تم تحديث حالة التعليق بنجاح",
      review: updated,
    });
  } catch (error: any) {
    console.error("Update Admin Review Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث التعليق" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "غير مصرح لك بإجراء هذه العملية" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "معرف التعليق مطلوب" }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: "تم حذف التعليق بنجاح" });
  } catch (error: any) {
    console.error("Delete Admin Review Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء حذف التعليق" }, { status: 500 });
  }
}

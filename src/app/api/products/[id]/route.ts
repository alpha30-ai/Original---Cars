import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { categories: true },
    });
    
    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: "خطأ في جلب المنتج" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
    }

    const data = await request.json();
    const { name, description, price, imageUrl, stock, category, categoryId, categoryIds, images, tags, oldPrice, isActive } = data;

    const { id } = await params;
    
    const updateData: any = {
      name,
      description: description || "",
      price: parseFloat(price),
      imageUrl: imageUrl || "",
      images: images || [],
      tags: tags || [],
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      isActive: isActive !== undefined ? isActive : true,
      stock: parseInt(stock) || 0,
      categoryId: categoryId || null,
      oldCategory: category || "GENERAL",
    };

    if (categoryIds && Array.isArray(categoryIds)) {
      updateData.categories = {
        set: categoryIds.map((catId: string) => ({ id: catId }))
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "تم تحديث المنتج بنجاح", product });
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء حذف المنتج" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const activeOnly = url.searchParams.get("active") === "true";

    const items = await prisma.gallery.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Gallery GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, imageUrl, order, isActive } = body;

    const newItem = await prisma.gallery.create({
      data: {
        title,
        description,
        imageUrl,
        order: order ?? 0,
        isActive: isActive ?? true
      }
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Gallery POST Error:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, imageUrl, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedItem = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        order,
        isActive
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Gallery PUT Error:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.gallery.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}

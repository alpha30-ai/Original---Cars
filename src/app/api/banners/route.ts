import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([]);
}

export async function POST() {
  return NextResponse.json({ message: "Banners system removed" }, { status: 200 });
}

export async function PUT() {
  return NextResponse.json({ message: "Banners system removed" }, { status: 200 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Banners system removed" }, { status: 200 });
}

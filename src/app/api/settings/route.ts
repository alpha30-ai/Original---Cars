import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Support batch update: { settings: { key1: value1, key2: value2 } }
    if (body.settings && typeof body.settings === "object") {
      const updates = Object.entries(body.settings).map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      );
      await Promise.all(updates);
      return NextResponse.json({ message: "Settings updated successfully" });
    }

    // Support single update: { key, value }
    const { key, value } = body;
    if (!key || !value) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ message: "Setting updated successfully", setting });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

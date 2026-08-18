import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const startTime = Date.now();
    
    // Execute a lightweight query to wake up and keep the database active
    const result = await prisma.$queryRaw`SELECT 1 as ping`;
    
    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      status: "alive",
      message: "Database heartbeat successful. Database is fully awake.",
      duration: `${durationMs}ms`,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error: any) {
    console.error("Keep-alive ping error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to ping database",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

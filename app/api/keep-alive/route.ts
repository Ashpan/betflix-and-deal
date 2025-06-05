// app/api/keep-alive/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface KeepAliveResponse {
  message: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(): Promise<
  NextResponse<KeepAliveResponse | ErrorResponse>
> {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase client not initialized" },
      { status: 500 },
    );
  }
  try {
    // Lightweight query - just check if DB is responsive
    const { error } = await supabase.from("sessions").select("id").limit(1);

    if (error) throw error;

    return NextResponse.json({
      message: "Supabase keepalive successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Keepalive failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

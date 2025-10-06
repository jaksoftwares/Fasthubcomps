// /app/api/health/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ==========================================
// GET /api/health → Check backend health
// ==========================================
export async function GET() {
  try {
    const { data, error } = await supabase.from("health").select("*").single();

    if (error) {
      console.error("❌ Health check error:", error.message);
      return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: "ok",
      timestamp: data?.timestamp,
      total_products: data?.total_products ?? 0,
      total_customers: data?.total_customers ?? 0,
      total_orders: data?.total_orders ?? 0,
    });
  } catch (err: any) {
    console.error("❌ Health endpoint failure:", err.message);
    return NextResponse.json({ status: "error", error: "Server error" }, { status: 500 });
  }
}

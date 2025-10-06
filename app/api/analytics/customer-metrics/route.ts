import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("analytics_customer_metrics").select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

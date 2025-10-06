import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("analytics_sales_trend").select("*").order("day", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

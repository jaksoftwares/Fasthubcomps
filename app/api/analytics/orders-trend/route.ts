import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server"; 

type TrendRecord = {
  total_orders: number;
  total_sales: number;
};

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("date,total,status")
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json([]);

  const trend = data.reduce((acc: Record<string, TrendRecord>, o: any) => {
    const day = o.date.split("T")[0];
    if (!acc[day]) acc[day] = { total_orders: 0, total_sales: 0 };
    acc[day].total_orders += 1;
    if (["paid", "completed"].includes(o.status))
      acc[day].total_sales += Number(o.total);
    return acc;
  }, {});

  const formatted = Object.entries(trend).map(([day, v]) => ({
    day,
    ...(v as TrendRecord), 
  }));

  return NextResponse.json(formatted);
}

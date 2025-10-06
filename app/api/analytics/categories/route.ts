import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type CategoryStat = {
  total_value: number;
  total_items: number;
};

export async function GET() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("category, price, stock");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) return NextResponse.json([]);

  const categorySales = data.reduce((acc: Record<string, CategoryStat>, p: any) => {
    if (!acc[p.category]) acc[p.category] = { total_value: 0, total_items: 0 };
    acc[p.category].total_value += Number(p.price) * Number(p.stock || 0);
    acc[p.category].total_items += p.stock || 0;
    return acc;
  }, {});

  const formatted = Object.entries(categorySales).map(([category, v]) => ({
    category,
    ...(v as CategoryStat), // ✅ explicit type assertion
  }));

  return NextResponse.json(formatted);
}

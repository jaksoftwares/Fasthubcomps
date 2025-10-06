import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET() {
  const supabase = getSupabaseServerClient();

  const [products, customers, orders, payments] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id,total", { count: "exact" }),
    supabase.from("payments").select("amount,status")
  ]);

  const totalRevenue = payments.data?.filter(p => p.status === "success")
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const stats = {
    total_products: products.count || 0,
    total_customers: customers.count || 0,
    total_orders: orders.count || 0,
    total_revenue: totalRevenue
  };

  return NextResponse.json(stats);
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/orders
 * Returns all orders with optional filters: ?status=paid&customer_id=<uuid>
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const customer_id = searchParams.get("customer_id");

  try {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (customer_id) query = query.eq("customer_id", customer_id);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/orders
 * Creates a new order
 * Expected JSON body:
 * {
 *   "customer_id": "uuid",
 *   "products": [{"id":"...", "name":"...", "quantity":2, "price":1500}],
 *   "total": 3000,
 *   "payment_method": "M-Pesa",
 *   "shipping_address": {...}
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.customer_id || !body.products || !body.total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: body.customer_id,
          products: body.products,
          total: body.total,
          payment_method: body.payment_method || "M-Pesa",
          shipping_address: body.shipping_address || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Optionally increment customer stats
    await supabase.rpc("increment_customer_stats", {
      p_customer_id: body.customer_id,
      p_total: body.total,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

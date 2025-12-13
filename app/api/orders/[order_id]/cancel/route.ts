import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/orders/[order_id]/cancel
 * Cancels an existing order if not yet completed.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id } = await params;
    const { data: existing, error: fetchError } = await supabase
      .from("orders")
      .select("status")
      .eq("id", order_id)
      .single();

    if (fetchError) throw fetchError;

    if (existing.status === "completed") {
      return NextResponse.json({ error: "Cannot cancel a completed order" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Order cancelled successfully", order: data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

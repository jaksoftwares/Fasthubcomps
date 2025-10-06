import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(_: Request, { params }: { params: { order_id: string } }) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(name, email, phone)")
      .eq("id", params.order_id)
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: { order_id: string } }) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("orders")
      .update(body)
      .eq("id", params.order_id)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { order_id: string } }) {
  try {
    const { error } = await supabase.from("orders").delete().eq("id", params.order_id);
    if (error) throw error;

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

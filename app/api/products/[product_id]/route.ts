import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ product_id: string }> }
) {
  try {
    const { product_id } = await context.params;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ product_id: string }> }
) {
  try {
    const body = await request.json();
    const { product_id } = await context.params;
    const { data, error } = await supabase
      .from("products")
      .update(body)
      .eq("id", product_id)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ product_id: string }> }
) {
  try {
    const { product_id } = await context.params;
    const { error } = await supabase.from("products").delete().eq("id", product_id);
    if (error) throw error;

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

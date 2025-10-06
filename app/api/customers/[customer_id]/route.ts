import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server"; // ✅ correct import
import bcrypt from "bcryptjs";

// ✅ GET /api/customers/[customer_id]
export async function GET(_: Request, { params }: { params: { customer_id: string } }) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", params.customer_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// ✅ PUT /api/customers/[customer_id]
export async function PUT(req: Request, { params }: { params: { customer_id: string } }) {
  const supabase = getSupabaseServerClient();
  const body = await req.json();
  const updateData: Record<string, any> = { ...body };

  if (body.password) {
    updateData.password_hash = await bcrypt.hash(body.password, 10);
    delete updateData.password;
  }

  const { data, error } = await supabase
    .from("customers")
    .update(updateData)
    .eq("id", params.customer_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Customer updated", customer: data });
}

// ✅ DELETE /api/customers/[customer_id]
export async function DELETE(_: Request, { params }: { params: { customer_id: string } }) {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", params.customer_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Customer deleted successfully" });
}

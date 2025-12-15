import { NextResponse, NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server"; // ✅ correct import
import bcrypt from "bcryptjs";

// ✅ GET /api/customers/[customer_id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const { customer_id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customer_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// ✅ PUT /api/customers/[customer_id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const { customer_id } = await params;
  const supabase = await createSupabaseServerClient();
  const body = await req.json();
  const updateData: Record<string, any> = { ...body };

  if (body.password) {
    updateData.password_hash = await bcrypt.hash(body.password, 10);
    delete updateData.password;
  }

  const { data, error } = await supabase
    .from("customers")
    .update(updateData)
    .eq("id", customer_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Customer updated", customer: data });
}

// ✅ DELETE /api/customers/[customer_id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const { customer_id } = await params;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customer_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Customer deleted successfully" });
}

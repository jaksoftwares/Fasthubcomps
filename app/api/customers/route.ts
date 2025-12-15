import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server"; // ✅ use your consistent server helper
import bcrypt from "bcryptjs";

// ✅ GET /api/customers - list all customers
export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("join_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ✅ POST /api/customers - create new customer
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  const { name, email, password, phone } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  // 🔐 Hash password
  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("customers")
    .insert([{ name, email, password_hash, phone }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Customer created successfully",
    customer: data,
  });
}

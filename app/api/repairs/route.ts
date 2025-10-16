import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =======================================
// GET /api/repairs
// =======================================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase.from("repair_requests").select("*").order("submitted_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching repairs:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// =======================================
// POST /api/repairs
// =======================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      device_type,
      device_brand,
      device_model,
      issue_description,
      urgency = "normal",
    } = body;

    if (!customer_name || !customer_email || !customer_phone || !device_type || !issue_description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("repair_requests")
      .insert([
        {
          customer_name,
          customer_email,
          customer_phone,
          device_type,
          device_brand,
          device_model,
          issue_description,
          urgency,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Repair request submitted successfully", repair: data }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating repair request:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

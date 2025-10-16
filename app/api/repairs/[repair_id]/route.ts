import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =======================================
// GET /api/repairs/[repair_id]
// =======================================
export async function GET(_: Request, { params }: { params: { repair_id: string } }) {
  const { repair_id } = params;

  const { data, error } = await supabase.from("repair_requests").select("*").eq("id", repair_id).single();

  if (error) {
    console.error("Error fetching repair:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) return NextResponse.json({ error: "Repair not found" }, { status: 404 });

  return NextResponse.json(data, { status: 200 });
}

// =======================================
// PATCH /api/repairs/[repair_id]
// =======================================
export async function PATCH(req: Request, { params }: { params: { repair_id: string } }) {
  const { repair_id } = params;
  const updates = await req.json();

  const allowedFields = [
    "status",
    "estimated_cost",
    "notes",
    "technician_notes",
    "updated_at",
  ];

  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  sanitizedUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("repair_requests")
    .update(sanitizedUpdates)
    .eq("id", repair_id)
    .select()
    .single();

  if (error) {
    console.error("Error updating repair:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Repair updated successfully", repair: data }, { status: 200 });
}

// =======================================
// DELETE /api/repairs/[repair_id]
// =======================================
export async function DELETE(_: Request, { params }: { params: { repair_id: string } }) {
  const { repair_id } = params;

  const { error } = await supabase.from("repair_requests").delete().eq("id", repair_id);

  if (error) {
    console.error("Error deleting repair:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Repair deleted successfully" }, { status: 200 });
}

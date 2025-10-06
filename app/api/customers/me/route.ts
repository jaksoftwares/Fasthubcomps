import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

// GET /api/customers/me
export async function GET() {
  const supabase = getSupabaseServerClient();

  // Try to get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch matching customer record by email
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("email", user.email)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

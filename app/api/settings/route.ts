// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ==========================================
// GET /api/settings → Fetch site settings
// PUT /api/settings → Update site settings
// ==========================================

export async function GET() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  // PGRST116 = no rows found for single(), treat as "no settings yet"
  if (error) {
    if ((error as any).code === "PGRST116") {
      return NextResponse.json({});
    }

    console.error("❌ Error fetching settings:", error.message);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }

  return NextResponse.json(data || {});
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updateData = {
      site_name: body.site_name,
      logo_url: body.logo_url,
      contact_email: body.contact_email,
      contact_phone: body.contact_phone,
      address: body.address,
      currency: body.currency,
      tax_rate: body.tax_rate,
      maintenance_mode: body.maintenance_mode,
      updated_at: new Date().toISOString(),
    };

    // If no settings exist yet → insert new record
    const { data: existing, error: fetchError } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("❌ Error checking existing settings:", fetchError.message);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    let response;

    if (existing) {
      response = await supabase
        .from("settings")
        .update(updateData)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      response = await supabase
        .from("settings")
        .insert([updateData])
        .select()
        .single();
    }

    if (response.error) {
      console.error("❌ Error updating settings:", response.error.message);
      return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: response.data });
  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

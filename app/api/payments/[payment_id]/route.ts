import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(_: Request, { params }: { params: { payment_id: string } }) {
  try {
    const { data, error } = await supabase.from("payments").select("*").eq("id", params.payment_id).single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: { payment_id: string } }) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from("payments")
      .update(body)
      .eq("id", params.payment_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

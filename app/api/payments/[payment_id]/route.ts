import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ payment_id: string }> }
) {
	try {
		const { payment_id } = await params;
		const { data, error } = await supabase
			.from("payments")
			.select("*")
			.eq("id", payment_id)
			.single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ payment_id: string }> }
) {
	try {
		const body = await req.json();
		const { payment_id } = await params;
		const { data, error } = await supabase
			.from("payments")
			.update(body)
			.eq("id", payment_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    // Try Supabase auth sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Get role from user metadata
    const role = authData.user.user_metadata?.role || 'customer';
    const name = authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'User';
    const phone = authData.user.user_metadata?.phone || null;

    return NextResponse.json({
      user: {
        id: authData.user.id,
        name,
        email: authData.user.email,
        phone,
        role
      },
      token: authData.session?.access_token
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

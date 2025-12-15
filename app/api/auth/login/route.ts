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
      const message = authError?.message?.toLowerCase() || "";

      // Detect unconfirmed email/login blocked until confirmation
      if (
        authError?.status === 400 &&
        (message.includes("confirm") || message.includes("email not confirmed"))
      ) {
        return NextResponse.json(
          { error: "Please confirm your email from the link we sent before logging in." },
          { status: 403 }
        );
      }

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
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
    return NextResponse.json({ error: "Unable to log you in right now. Please try again." }, { status: 500 });
  }
}

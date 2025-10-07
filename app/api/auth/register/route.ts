import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, password, phone = null, isAdmin = false } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    // Create Supabase auth user with role in metadata
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        phone,
        role: isAdmin ? 'admin' : 'customer'
      }
    });

    if (authError || !authUser?.user) {
      // Check if it's a duplicate email error
      if (authError?.message?.includes('already registered')) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      return NextResponse.json({ error: authError?.message || "Auth creation failed" }, { status: 500 });
    }

    // Immediately sign in the user to get a token
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !loginData?.session) {
      // If login fails, return error - user needs to login manually
      return NextResponse.json({ error: "Account created but login failed. Please try logging in." }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        id: authUser.user.id,
        name,
        email,
        phone,
        role: isAdmin ? 'admin' : 'customer'
      },
      token: loginData.session.access_token
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

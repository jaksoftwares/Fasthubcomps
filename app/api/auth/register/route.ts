import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, password, phone = null, isAdmin = false } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    // Create Supabase auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role: isAdmin ? 'admin' : 'customer'
        }
      }
    });

    if (error) {
      // Check if it's a duplicate email error
      if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Registration failed - no user created" }, { status: 500 });
    }

    // Insert into customers table
    const { error: insertError } = await supabase
      .from('customers')
      .insert([{
        id: data.user.id,
        name,
        email: data.user.email,
        password_hash: 'auth-managed', // Since password is managed by auth
        phone,
        status: data.session ? 'active' : 'pending'
      }]);

    if (insertError) {
      // If insert fails, delete the auth user
      await supabase.auth.admin.deleteUser(data.user.id);
      return NextResponse.json({ error: 'Failed to create customer profile' }, { status: 500 });
    }

    // Check if user is auto-confirmed (has session)
    if (data.session) {
      // User is confirmed, return token
      return NextResponse.json({
        user: {
          id: data.user.id,
          name,
          email: data.user.email,
          phone,
          role: isAdmin ? 'admin' : 'customer'
        },
        token: data.session.access_token
      });
    } else {
      // User needs email confirmation
      return NextResponse.json({
        success: false,
        message: "Account created successfully. Please check your email to confirm your account, then try logging in."
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

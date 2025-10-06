// app/api/admins/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Helper function to check if user is admin
function isAdmin(token: string) {
  try {
    const decoded: any = jwt.decode(token);
    return decoded?.user_metadata?.role === 'admin';
  } catch {
    return false;
  }
}

// GET /api/admins → list all admin users
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  if (!isAdmin(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  // Get all users and filter by admin role
  const { data: users, error } = await supabase.auth.admin.listUsers();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const admins = users.users
    .filter(user => user.user_metadata?.role === 'admin')
    .map(user => ({
      id: user.id,
      name: user.user_metadata?.name || '',
      email: user.email,
      phone: user.user_metadata?.phone || null,
      role: 'admin'
    }));

  return NextResponse.json(admins);
}

// POST /api/admins → create a new admin
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  if (!isAdmin(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  const { name, email, password, phone = null } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if user already exists
  const { data: existingAuth } = await supabase.auth.admin.listUsers();
  const userExists = existingAuth?.users?.some(user => user.email === email);
  if (userExists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  // Create Supabase auth user with admin role
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      phone,
      role: 'admin'
    }
  });

  if (authError || !authUser?.user) {
    return NextResponse.json({ error: authError?.message || "Auth creation failed" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Admin created successfully",
    user: {
      id: authUser.user.id,
      name,
      email,
      phone,
      role: 'admin'
    }
  });
}

// DELETE /api/admins?email=<email>&action=<demote|delete> → remove admin privileges or delete user
export async function DELETE(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  if (!isAdmin(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const action = url.searchParams.get("action") || "demote"; // default to demote

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  // Find the user
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  const user = users.users.find(u => u.email === email);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "delete") {
    // Delete the user entirely
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
    return NextResponse.json({ message: "User deleted successfully" });
  } else {
    // Demote admin to customer by updating metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: 'customer'
      }
    });
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    return NextResponse.json({ message: "Admin demoted to customer successfully" });
  }
}

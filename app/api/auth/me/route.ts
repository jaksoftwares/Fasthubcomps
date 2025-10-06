import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

    const token = auth.split(" ")[1];

    // Decode the JWT token to get user info
    let decoded: any;
    try {
      decoded = jwt.decode(token);
      if (!decoded || !decoded.sub) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.sub;
    const email = decoded.email;
    const name = decoded.user_metadata?.name || '';
    const phone = decoded.user_metadata?.phone || null;
    const role = decoded.user_metadata?.role || 'customer';

    return NextResponse.json({
      user: {
        id: userId,
        name,
        email,
        phone,
        role
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

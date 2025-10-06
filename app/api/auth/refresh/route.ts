import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!, { ignoreExpiration: true });
    const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return NextResponse.json({ token: newToken });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

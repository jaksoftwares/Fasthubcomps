// /app/api/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    app: "Fasthub E-Commerce API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      products: "/api/products",
      orders: "/api/orders",
      payments: "/api/payments",
      repairs: "/api/repairs",
      analytics: "/api/analytics",
      customers: "/api/customers",
      auth: "/api/auth",
      settings: "/api/settings",
      health: "/api/health",
    },
    timestamp: new Date().toISOString(),
  });
}

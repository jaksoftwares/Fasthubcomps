import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { productSchema } from "@/lib/validators/productSchema";
import { slugify } from "@/lib/utils/slugify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the input
    const validatedData = productSchema.parse(body);

    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = slugify(validatedData.name);
    }

    // Check if slug is unique
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("slug", validatedData.slug)
      .single();

    if (existingProduct) {
      // Append a number to make it unique
      let counter = 1;
      let uniqueSlug = `${validatedData.slug}-${counter}`;
      while (true) {
        const { data: check } = await supabase
          .from("products")
          .select("id")
          .eq("slug", uniqueSlug)
          .single();
        if (!check) break;
        counter++;
        uniqueSlug = `${validatedData.slug}-${counter}`;
      }
      validatedData.slug = uniqueSlug;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([validatedData])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

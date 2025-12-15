import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/utils/slugify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_url")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let slug = body.slug ? String(body.slug) : slugify(String(body.name));

    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      let counter = 1;
      let uniqueSlug = `${slug}-${counter}`;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { data: check } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", uniqueSlug)
          .single();
        if (!check) break;
        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }
      slug = uniqueSlug;
    }

    const payload = {
      name: body.name,
      slug,
      description: body.description ?? null,
      image_url: body.image_url ?? null,
    };

    const { data, error } = await supabase
      .from("categories")
      .insert([payload])
      .select("id, name, slug, description, image_url")
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

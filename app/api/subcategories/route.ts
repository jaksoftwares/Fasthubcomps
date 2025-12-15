import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/utils/slugify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id");

  try {
    let query = supabase
      .from("subcategories")
      .select("id, category_id, name, slug, image_url")
      .order("name", { ascending: true });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.category_id) {
      return NextResponse.json(
        { error: "name and category_id are required" },
        { status: 400 }
      );
    }

    let slug = body.slug ? String(body.slug) : slugify(String(body.name));

    const { data: existing } = await supabase
      .from("subcategories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      let counter = 1;
      let uniqueSlug = `${slug}-${counter}`;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { data: check } = await supabase
          .from("subcategories")
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
      category_id: body.category_id,
      name: body.name,
      slug,
      image_url: body.image_url ?? null,
    };

    const { data, error } = await supabase
      .from("subcategories")
      .insert([payload])
      .select("id, category_id, name, slug, image_url")
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/utils/slugify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/subcategories/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, name, slug, image_url")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT /api/subcategories/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updateData: any = {};
  if (body.category_id) updateData.category_id = body.category_id;
  if (body.name) updateData.name = body.name;
  if (body.image_url !== undefined) updateData.image_url = body.image_url;

  if (body.slug) {
    updateData.slug = body.slug;
  } else if (body.name) {
    updateData.slug = slugify(body.name);
  }

  if (updateData.slug) {
    const { data: existing } = await supabase
      .from("subcategories")
      .select("id")
      .eq("slug", updateData.slug)
      .neq("id", id)
      .single();

    if (existing) {
      let counter = 1;
      let uniqueSlug = `${updateData.slug}-${counter}`;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { data: check } = await supabase
          .from("subcategories")
          .select("id")
          .eq("slug", uniqueSlug)
          .neq("id", id)
          .single();
        if (!check) break;
        counter++;
        uniqueSlug = `${updateData.slug}-${counter}`;
      }
      updateData.slug = uniqueSlug;
    }
  }

  const { data, error } = await supabase
    .from("subcategories")
    .update(updateData)
    .eq("id", id)
    .select("id, category_id, name, slug, image_url")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE /api/subcategories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from("subcategories")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Subcategory deleted" }, { status: 200 });
}

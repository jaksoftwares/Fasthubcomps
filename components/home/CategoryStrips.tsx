"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductsAPI } from "@/lib/services/products";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  images?: string[];
  category?: string; // this will hold category_id from Supabase
}

// Map category slugs to Supabase category_id values so we can group
// products by business categories on the home page.
const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  networking: "01de6a8b-6347-4310-9b08-ae0a108b9f80",
  laptops: "93d6ba2c-91aa-4c5d-8a85-5161533d96c4",
  desktops: "ea116946-4593-4376-9100-c595bba48a7b",
  servers: "69d5f35f-a41e-4efd-be3f-ac00acb016fb",
  printers: "87870d8c-4cbd-4b39-a43a-b8f08cac0873",
  "phones-tablets": "05a23952-7ba0-4ad5-a708-1999034bc7fd",
  tvs: "59d99502-78f6-4eb2-aa26-8059ec31d5fe",
  monitors: "948e5fa7-080c-47ba-9c20-d63d119231b0",
  accessories: "614896bb-8cad-4690-9d60-617857092e56",
  storage: "aaaf46a9-6363-4b85-8192-95af924d8f5a",
  gaming: "1ba300ed-82f9-4c3e-8cfc-961f684a4cd5",
};

const CategoryStrips = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductsAPI.getAll();
        const mapped: Product[] = Array.isArray(data)
          ? data.map((p: any) => ({
              id: p.id || "",
              slug: p.slug || p.id || "",
              name: p.name || "",
              price: Number(p.price) || 0,
              images: Array.isArray(p.images) ? p.images : ["/placeholder.png"],
              category: p.category_id || p.category || "",
            }))
          : [];
        setProducts(mapped);
      } catch (err: any) {
        setError(err?.message || "Failed to load category products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getByCategory = (slug: string, limit: number) => {
    const id = CATEGORY_SLUG_TO_ID[slug];
    if (!id) return [];
    return products
      .filter((p) => p.category === id)
      .slice(0, limit);
  };

  const sections: { title: string; subtitle: string; slug: string }[] = [
    { title: "Laptops", subtitle: "Work, school & gaming laptops", slug: "laptops" },
    { title: "Desktops", subtitle: "Powerful desktop PCs & workstations", slug: "desktops" },
    { title: "Servers", subtitle: "Reliable server hardware", slug: "servers" },
    { title: "Networking", subtitle: "Routers, switches & Wi‑Fi", slug: "networking" },
    { title: "Phones & Tablets", subtitle: "Latest smartphones and tablets", slug: "phones-tablets" },
    { title: "TVs", subtitle: "Smart TVs & large displays", slug: "tvs" },
    { title: "Monitors", subtitle: "High‑resolution computer displays", slug: "monitors" },
    { title: "Gaming", subtitle: "Consoles, PCs & accessories", slug: "gaming" },
    { title: "Storage", subtitle: "SSDs, HDDs & memory cards", slug: "storage" },
    { title: "Printers", subtitle: "Inkjet, laser & all‑in‑one", slug: "printers" },
    { title: "Accessories", subtitle: "Mice, keyboards, audio & more", slug: "accessories" },
  ];

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-600">
          Loading categories...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-red-500">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {sections.map((section) => {
          const items = getByCategory(section.slug, 8);
          if (!items.length) return null;

          return (
            <div key={section.slug} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {section.subtitle}
                  </p>
                </div>
                <Link href={`/products?category=${section.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm h-8 px-3"
                  >
                    View all
                  </Button>
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {items.map((product, index) => {
                  const imageUrl =
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : "/placeholder.png";

                  const isLarge = index === 0 || index === 3;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className={`flex-shrink-0 ${
                        isLarge ? "w-52 sm:w-56" : "w-40 sm:w-44"
                      }`}
                    >
                      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                        <CardContent className="p-2 flex flex-col h-full">
                          <div className="relative w-full h-28 sm:h-32 overflow-hidden rounded-md mb-2">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <p className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                              {product.name}
                            </p>
                            <span className="text-sm font-semibold text-orange-600">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryStrips;

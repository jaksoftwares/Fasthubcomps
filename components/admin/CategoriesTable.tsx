"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ImageIcon, Plus, Edit2, Trash2, ListTree } from "lucide-react";
import { toast } from "sonner";
import { AddCategoryModal, EditCategoryModal, ManageSubcategoriesModal } from "@/components/admin/CategoryModals";
import Loader from '@/components/ui/Loader';

const CategoriesTable = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any | null>(null);
  const [manageSubsCategory, setManageSubsCategory] = useState<any | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products referencing it may break.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete category");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete category");
    }
  };

  const filtered = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.slug?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader message="Loading categories..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <CardTitle>Categories ({categories.length})</CardTitle>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Slug</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Image</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{category.name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <Badge variant="outline">{category.slug}</Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-md">
                    <span className="line-clamp-2">{category.description || "-"}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {category.image_url ? (
                      <a
                        href={category.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ImageIcon className="h-4 w-4 mr-1" />
                        View
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setManageSubsCategory({ id: category.id, name: category.name })}
                      >
                        <ListTree className="h-3 w-3 mr-1" />
                        Subcategories
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditCategory(category)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-sm text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <AddCategoryModal
      isOpen={addOpen}
      onClose={() => setAddOpen(false)}
      onCreated={() => {
        setAddOpen(false);
        loadCategories();
      }}
    />

    <EditCategoryModal
      isOpen={!!editCategory}
      onClose={() => setEditCategory(null)}
      category={editCategory}
      onUpdated={() => {
        setEditCategory(null);
        loadCategories();
      }}
    />

    <ManageSubcategoriesModal
      isOpen={!!manageSubsCategory}
      onClose={() => setManageSubsCategory(null)}
      category={manageSubsCategory}
    />
    </>
  );
};

export default CategoriesTable;

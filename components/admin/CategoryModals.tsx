"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryPayload {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
}

interface AddCategoryModalProps extends BaseModalProps {
  onCreated: (created: any) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState<CategoryPayload>({ name: "", description: "", image_url: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "", description: "", image_url: "" });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create category");
      }
      toast.success("Category created");
      onCreated(data);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Add Category</h2>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={form.image_url || ""}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {!isSubmitting && <Plus className="h-4 w-4 mr-2" />}
                {isSubmitting ? "Saving..." : "Add Category"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

interface EditCategoryModalProps extends BaseModalProps {
  category: CategoryPayload | null;
  onUpdated: (updated: any) => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, category, onUpdated }) => {
  const [form, setForm] = useState<CategoryPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      setForm({ ...category });
    }
    if (!isOpen) {
      setForm(null);
      setIsSubmitting(false);
    }
  }, [isOpen, category]);

  if (!isOpen || !form || !form.id) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/categories/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update category");
      }
      toast.success("Category updated");
      onUpdated(data);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Edit Category</h2>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={form.image_url || ""}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {!isSubmitting && <Save className="h-4 w-4 mr-2" />}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

interface ManageSubcategoriesModalProps extends BaseModalProps {
  category: { id: string; name: string } | null;
}

export const ManageSubcategoriesModal: React.FC<ManageSubcategoriesModalProps> = ({ isOpen, onClose, category }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !category) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/subcategories?category_id=${category.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load subcategories");
        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.message || "Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: category.id,
          name: newName,
          image_url: newImageUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create subcategory");
      setItems((prev) => [...prev, data]);
      setNewName("");
      setNewImageUrl("");
      toast.success("Subcategory created");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create subcategory");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete subcategory");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Subcategory deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete subcategory");
    }
  };

  const handleInlineChange = (id: string, field: "name" | "image_url", value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleInlineSave = async (item: any) => {
    try {
      const res = await fetch(`/api/subcategories/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.name, image_url: item.image_url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update subcategory");
      toast.success("Subcategory updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update subcategory");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-lg font-semibold">Subcategories for {category.name}</h2>
              <p className="text-xs text-gray-500">Manage subcategories under this category</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 space-y-4">
            {loading && <div className="text-sm text-gray-500">Loading...</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 items-stretch md:items-end border rounded-md p-3 bg-gray-50">
              <div className="flex-1 space-y-1">
                <Label htmlFor="new-sub-name">New subcategory name</Label>
                <Input
                  id="new-sub-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Gaming Laptops"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="new-sub-image">Image URL</Label>
                <Input
                  id="new-sub-image"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://... (optional)"
                />
              </div>
              <div>
                <Button type="submit" className="w-full md:w-auto mt-5 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </form>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Name</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Slug</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Image URL</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-2 px-3">
                        <Input
                          value={item.name || ""}
                          onChange={(e) => handleInlineChange(item.id, "name", e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-3 text-gray-600 text-xs break-all">{item.slug}</td>
                      <td className="py-2 px-3">
                        <Input
                          value={item.image_url || ""}
                          onChange={(e) => handleInlineChange(item.id, "image_url", e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleInlineSave(item)}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="py-4 px-3 text-center text-xs text-gray-500">
                        No subcategories yet. Add one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

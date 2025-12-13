'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProductsAPI } from '@/lib/services/products';

interface EditProductModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onProductUpdated?: (product: any) => void;
}

const flagOptions = ['new', 'premium', 'executive'];
const tagOptions = [
  'best-deals',
  'top-deals',
  'top-sales',
  'featured-home',
  'new-arrivals',
  'best-sellers',
  'clearance',
];

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState<any | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitStep, setSubmitStep] = useState<'idle' | 'uploading-images' | 'saving-product'>('idle');

  useEffect(() => {
    if (!product) return;
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortSpecs: product.short_specs || '',
      category_id: product.category_id || '',
      subcategory_id: product.subcategory_id || '',
      brand: product.brand || '',
      model: product.model || '',
      price: product.price?.toString() || '',
      originalPrice: product.old_price?.toString() || '',
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      warranty: product.warranty || '',
      flags: Array.isArray(product.flags) ? product.flags : [],
      tags: Array.isArray(product.tags) ? product.tags : [],
    });
    setExistingImages(Array.isArray(product.images) ? product.images : []);
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!formData?.category_id) {
      setSubcategories([]);
      return;
    }
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(`/api/subcategories?category_id=${formData.category_id}`);
        const data = await res.json();
        setSubcategories(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Failed to load subcategories');
      }
    };
    fetchSubcategories();
  }, [formData?.category_id]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const MAX_TOTAL_BYTES = 2 * 1024 * 1024; // ~2MB cumulative limit

    // existingImages only have URLs; we don't know their original sizes.
    // To keep logic simple and safe, we only enforce the limit on new uploads in this session.
    const currentNewTotal = newImages.reduce((sum, img) => sum + img.file.size, 0);
    const newTotal = files.reduce((sum, f) => sum + f.size, currentNewTotal);

    if (newTotal > MAX_TOTAL_BYTES) {
      toast.error('Total size of newly added images must not exceed 2MB. Please upload smaller images or fewer of them.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImages(prev => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFlag = (flag: string) => {
    setFormData((prev: any) => ({
      ...prev,
      flags: prev.flags.includes(flag)
        ? prev.flags.filter((f: string) => f !== flag)
        : [...prev.flags, flag],
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t: string) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Basic client-side validation for a better UX
    if (!formData.name || !formData.sku || !formData.category_id || !formData.brand || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Please provide a valid selling price greater than 0');
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      toast.error('Please provide a valid stock quantity');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStep('uploading-images');
      setUploadProgress(0);

      // Upload any new images to Cloudinary, sequentially, to track progress
      const uploadedUrls: string[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        const fd = new FormData();
        fd.append('file', img.file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/upload-image`, {
          method: 'POST',
          body: fd,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        const url = data.secure_url || data.url;
        if (!url) {
          throw new Error('Image upload did not return a URL');
        }
        uploadedUrls.push(url);
        if (newImages.length > 0) {
          setUploadProgress(Math.round(((i + 1) / newImages.length) * 100));
        }
      }

      const allImages = [...existingImages, ...uploadedUrls];
      if (allImages.length === 0) {
        toast.error('Please keep at least one product image');
        return;
      }

      const thumbnail = allImages[0];

      const payload = {
        sku: formData.sku,
        name: formData.name,
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        brand: formData.brand,
        model: formData.model || null,
        price: Number(formData.price),
        old_price: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        thumbnail,
        images: allImages,
        description: formData.description,
        short_specs: formData.shortSpecs || '',
        warranty: formData.warranty || null,
        tags: formData.tags || [],
        flags: formData.flags || [],
        status: product.status || 'active',
      };

      setSubmitStep('saving-product');

      const response = await ProductsAPI.update(product.id, payload);
      const updated = response.data;

      toast.success('Product updated successfully');
      if (onProductUpdated) onProductUpdated(updated || response);
      onClose();
    } catch (err: any) {
      const apiError = err?.response?.data;
      if (apiError?.error) {
        if (apiError.details && Array.isArray(apiError.details) && apiError.details.length > 0) {
          toast.error(apiError.details[0]?.message || apiError.error);
        } else {
          toast.error(apiError.error);
        }
      } else {
        toast.error(err?.message || 'Failed to update product');
      }
    } finally {
      setIsSubmitting(false);
      setSubmitStep('idle');
      setUploadProgress(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b z-10">
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Product Code *</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortSpecs">Short Specs</Label>
                <textarea
                  id="shortSpecs"
                  name="shortSpecs"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.shortSpecs}
                  onChange={handleInputChange}
                  placeholder="Key specs in a short paragraph"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Main Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      setFormData((prev: any) => ({ ...prev, category_id: value, subcategory_id: '' }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.category_id && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory_id">Sub Category</Label>
                    <Select
                      value={formData.subcategory_id}
                      onValueChange={(value) =>
                        setFormData((prev: any) => ({ ...prev, subcategory_id: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Pricing & Stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (KSh) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Old Price (KSh)</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty Period</Label>
                <Input
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Flags & Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Flags & Tags</h3>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Flags</p>
                <div className="flex flex-wrap gap-2">
                  {flagOptions.map(flag => (
                    <button
                      key={flag}
                      type="button"
                      onClick={() => toggleFlag(flag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.flags.includes(flag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {flag.charAt(0).toUpperCase() + flag.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Section Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Images</h3>
              <p className="text-sm text-gray-600">You can upload as many images as needed, as long as the total size of newly added images does not exceed 2MB. First image will be used as the thumbnail.</p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <Image
                      src={url}
                      alt={`Product ${index + 1}`}
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}

                {newImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <Image
                      src={image.preview}
                      alt={`New Product ${index + 1}`}
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
              </div>
            </div>

            {isSubmitting && (
              <div className="mt-4 px-4 py-3 bg-blue-50 border border-blue-100 text-sm text-blue-700 flex items-center justify-between rounded-md">
                <span>
                  {submitStep === 'uploading-images' && 'Uploading product images...'}
                  {submitStep === 'saving-product' && 'Saving product changes...'}
                </span>
                {submitStep === 'uploading-images' && uploadProgress !== null && (
                  <span className="font-medium">{uploadProgress}%</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {!isSubmitting && <Save className="h-4 w-4 mr-2" />}
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProductModal;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProductsAPI } from '@/lib/services/products';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: (product: any) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortSpecs: '',
    category_id: '',
    subcategory_id: '',
    brand: '',
    model: '',
    price: '',
    originalPrice: '',
    stock: '',
    sku: '',
    warranty: '',
    flags: [] as string[],
    tags: [] as string[],
  });

  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitStep, setSubmitStep] = useState<'idle' | 'uploading-images' | 'saving-product'>('idle');
  const [availableTags] = useState([
    'best-deals',
    'top-deals',
    'top-sales',
    'featured-home',
    'new-arrivals',
    'best-sellers',
    'clearance',
  ]);
  const flagOptions = ['new', 'premium', 'executive'];

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!formData.category_id) {
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
  }, [formData.category_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

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

    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStep('uploading-images');
      setUploadProgress(0);

      // Upload images to Cloudinary via API, sequentially, to track progress
      const uploadedUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
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
        setUploadProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const thumbnail = uploadedUrls[0];

      // Build payload in backend format (aligned with Supabase `products` table)
      const productData = {
        sku: formData.sku,
        name: formData.name,
        // slug omitted so API can generate from name
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        brand: formData.brand,
        model: formData.model || null,

        price: Number(formData.price),
        old_price: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),

        thumbnail,
        images: uploadedUrls,

        description: formData.description,
        short_specs: formData.shortSpecs || '',
        warranty: formData.warranty || null,

        tags: formData.tags || [],
        flags: formData.flags || [],
        status: 'active' as const,
      };

      setSubmitStep('saving-product');

      const response = await ProductsAPI.create(productData);
      const created = response.data;

      toast.success('Product added successfully!');
      if (onProductAdded) {
        onProductAdded(created);
      }
      handleReset();
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
        toast.error(err?.message || 'Failed to add product');
      }
    } finally {
      setIsSubmitting(false);
      setSubmitStep('idle');
      setUploadProgress(null);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      shortSpecs: '',
      category_id: '',
      subcategory_id: '',
      brand: '',
      model: '',
      price: '',
      originalPrice: '',
      stock: '',
      sku: '',
      warranty: '',
      flags: [],
      tags: [],
    });
    setImages([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated: typeof prev = {
        ...prev,
        [name]: value,
      };

      // Auto-generate SKU from product name when name changes
      if (name === 'name' && value) {
        const base = value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        // Only overwrite if sku is empty to avoid surprising behavior
        if (!prev.sku) {
          updated.sku = base;
        }
      }

      return updated;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const MAX_TOTAL_BYTES = 2 * 1024 * 1024; // ~2MB cumulative limit

    const existingTotal = images.reduce((sum, img) => sum + img.file.size, 0);
    const newTotal = files.reduce((sum, f) => sum + f.size, existingTotal);

    if (newTotal > MAX_TOTAL_BYTES) {
      toast.error('Total image size must not exceed 2MB. Please upload smaller images or fewer of them.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleFlag = (flag: string) => {
    setFormData(prev => ({
      ...prev,
      flags: prev.flags.includes(flag)
        ? prev.flags.filter(f => f !== flag)
        : [...prev.flags, flag]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b z-10">
            <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: main details */}
              <div className="space-y-6 lg:col-span-2">
                {/* Basic Information */}
                <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Dell XPS 15 Laptop"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU / Product Code *(auto-generated)</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        placeholder="e.g., DELL-XPS-15-001"
                        readOnly
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
                      placeholder="Detailed product description..."
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
                      placeholder="Key specs in a short paragraph (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="e.g., Dell, HP, Samsung"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="e.g., XPS 15 9530"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Selling Price (KSh) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g., 85000"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Category</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category_id">Main Category *</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) =>
                          setFormData(prev => ({ ...prev, category_id: value, subcategory_id: '' }))
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
                            setFormData(prev => ({ ...prev, subcategory_id: value }))
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
                <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Pricing & Stock</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (KSh)</Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="e.g., 95000"
                      />
                      {formData.price && formData.originalPrice && (
                        <p className="text-xs text-green-600">
                          {Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}% discount
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="e.g., 15"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty Period</Label>
                      <Input
                        id="warranty"
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleInputChange}
                        placeholder="e.g., 1 Year International Warranty"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Specifications and additional non-DB fields removed to keep form aligned with products table */}
              </div>

              {/* Right column: tags, flags, images */}
              <div className="space-y-6 lg:col-span-1">
                {/* Tags */}
                <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Tags</h3>
                  <p className="text-sm text-gray-600">Select applicable tags for better product visibility</p>

                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                          formData.tags.includes(tag)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Highlight Flags</h3>
                  <p className="text-sm text-gray-600">Mark this product as new, premium, or executive.</p>

                  <div className="flex flex-wrap gap-2">
                    {flagOptions.map(flag => (
                      <button
                        key={flag}
                        type="button"
                        onClick={() => toggleFlag(flag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                          formData.flags.includes(flag)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {flag.charAt(0).toUpperCase() + flag.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Images *</h3>
                  <p className="text-sm text-gray-600">Upload as many images as you need, as long as their total size does not exceed 2MB. First image will be the main product image.</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        {/* Use Next.js Image for optimization */}
                        <Image
                          src={image.preview}
                          alt={`Product ${index + 1}`}
                          width={200}
                          height={128}
                          className="w-full h-28 object-cover rounded-lg border-2 border-gray-300"
                          style={{ objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
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

                    {images.length < 5 && (
                      <label className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isSubmitting && (
              <div className="mt-4 px-4 py-3 bg-blue-50 border border-blue-100 text-sm text-blue-700 flex items-center justify-between rounded-md">
                <span>
                  {submitStep === 'uploading-images' && 'Uploading product images...'}
                  {submitStep === 'saving-product' && 'Saving product...'}
                </span>
                {submitStep === 'uploading-images' && uploadProgress !== null && (
                  <span className="font-medium">{uploadProgress}%</span>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 gap-3 pt-6 border-t mt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
                Reset Form
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {!isSubmitting && <Plus className="h-4 w-4 mr-2" />}
                {isSubmitting ? 'Processing...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
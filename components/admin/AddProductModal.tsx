'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: (product: any) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    model: '',
    price: '',
    originalPrice: '',
    stock: '',
    sku: '',
    warranty: '',
    condition: 'new',
    tags: [] as string[],

    // Computer/Laptop Specs
    processor: '',
    ram: '',
    storage: '',
    storageType: '',
    graphics: '',
    screenSize: '',

    // Phone Specs
    os: '',
    camera: '',
    battery: '',

    // Common Specs
    color: '',
    weight: '',
    dimensions: '',
    connectivity: '',
    additionalSpecs: '',
  });

  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [availableTags] = useState([
    'featured',
    'top-sales',
    'best-seller',
    'new-arrival',
    'clearance',
    'limited-stock',
    'trending',
    'recommended'
  ]);

  const categories = {
    computers: ['Desktop', 'All-in-One', 'Gaming PC', 'Workstation'],
    laptops: ['Ultrabook', 'Gaming Laptop', 'Business Laptop', '2-in-1', 'Chromebook'],
    phones: ['Smartphone', 'Feature Phone', 'Gaming Phone'],
    accessories: ['Mouse', 'Keyboard', 'Headphones', 'Chargers', 'Cases', 'Cables', 'Storage', 'Other']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    // Upload images to get URLs
    const imagePromises = images.map(async (img) => {
      const formData = new FormData();
      formData.append('file', img.file);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/products/upload-image`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      const data = await response.json();
      return data.url;
    });
    let imageUrls: string[] = [];
    try {
      imageUrls = await Promise.all(imagePromises);
    } catch (error) {
      toast.error('Failed to upload images');
      return;
    }

    // Build payload in backend format
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      sub_category: formData.subCategory || null,
      brand: formData.brand,
      model: formData.model || null,
      price: formData.price ? parseFloat(formData.price) : 0,
      original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: formData.stock ? parseInt(formData.stock, 10) : 0,
      sku: formData.sku || null,
      warranty: formData.warranty || null,
      condition: formData.condition,
      tags: formData.tags || [],
      processor: formData.processor || null,
      ram: formData.ram || null,
      storage: formData.storage || null,
      storage_type: formData.storageType || null,
      graphics: formData.graphics || null,
      screen_size: formData.screenSize || null,
      os: formData.os || null,
      camera: formData.camera || null,
      battery: formData.battery || null,
      color: formData.color || null,
      weight: formData.weight || null,
      dimensions: formData.dimensions || null,
      connectivity: formData.connectivity || null,
      additional_specs: formData.additionalSpecs
        ? { note: formData.additionalSpecs }
        : null,
      images: imageUrls,
    };

    try {
      const result = await (await import("@/lib/services/products")).ProductsAPI.create(productData);
      toast.success('Product added successfully!');
      if (onProductAdded) {
        onProductAdded(result);
      }
      handleReset();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add product');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      subCategory: '',
      brand: '',
      model: '',
      price: '',
      originalPrice: '',
      stock: '',
      sku: '',
      warranty: '',
      condition: 'new',
      tags: [],
      processor: '',
      ram: '',
      storage: '',
      storageType: '',
      graphics: '',
      screenSize: '',
      os: '',
      camera: '',
      battery: '',
      color: '',
      weight: '',
      dimensions: '',
      connectivity: '',
      additionalSpecs: '',
    });
    setImages([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

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

  if (!isOpen) return null;

  const showComputerSpecs = formData.category === 'computers' || formData.category === 'laptops';
  const showPhoneSpecs = formData.category === 'phones';

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b z-10">
            <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
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
                    placeholder="e.g., Dell XPS 15 Laptop"
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
                    placeholder="e.g., DELL-XPS-15-001"
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
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Category</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Main Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subCategory: '' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computers">Computers</SelectItem>
                      <SelectItem value="laptops">Laptops</SelectItem>
                      <SelectItem value="phones">Phones</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.category && (
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub Category</Label>
                    <Select value={formData.subCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, subCategory: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories[formData.category as keyof typeof categories]?.map(sub => (
                          <SelectItem key={sub} value={sub.toLowerCase().replace(' ', '-')}>{sub}</SelectItem>
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
                    placeholder="e.g., 85000"
                    required
                  />
                </div>
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

            {/* Technical Specifications */}
            {(showComputerSpecs || showPhoneSpecs) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Technical Specifications</h3>
                
                {showComputerSpecs && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="processor">Processor</Label>
                      <Input
                        id="processor"
                        name="processor"
                        value={formData.processor}
                        onChange={handleInputChange}
                        placeholder="e.g., Intel Core i7-13700H"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ram">RAM</Label>
                      <Input
                        id="ram"
                        name="ram"
                        value={formData.ram}
                        onChange={handleInputChange}
                        placeholder="e.g., 16GB DDR5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage">Storage Capacity</Label>
                      <Input
                        id="storage"
                        name="storage"
                        value={formData.storage}
                        onChange={handleInputChange}
                        placeholder="e.g., 512GB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storageType">Storage Type</Label>
                      <Input
                        id="storageType"
                        name="storageType"
                        value={formData.storageType}
                        onChange={handleInputChange}
                        placeholder="e.g., NVMe SSD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graphics">Graphics Card</Label>
                      <Input
                        id="graphics"
                        name="graphics"
                        value={formData.graphics}
                        onChange={handleInputChange}
                        placeholder="e.g., NVIDIA RTX 4060 8GB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="screenSize">Screen Size</Label>
                      <Input
                        id="screenSize"
                        name="screenSize"
                        value={formData.screenSize}
                        onChange={handleInputChange}
                        placeholder="e.g., 15.6 inch FHD"
                      />
                    </div>
                  </div>
                )}

                {showPhoneSpecs && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="os">Operating System</Label>
                      <Input
                        id="os"
                        name="os"
                        value={formData.os}
                        onChange={handleInputChange}
                        placeholder="e.g., Android 14"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="processor">Processor</Label>
                      <Input
                        id="processor"
                        name="processor"
                        value={formData.processor}
                        onChange={handleInputChange}
                        placeholder="e.g., Snapdragon 8 Gen 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ram">RAM</Label>
                      <Input
                        id="ram"
                        name="ram"
                        value={formData.ram}
                        onChange={handleInputChange}
                        placeholder="e.g., 12GB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage">Internal Storage</Label>
                      <Input
                        id="storage"
                        name="storage"
                        value={formData.storage}
                        onChange={handleInputChange}
                        placeholder="e.g., 256GB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="camera">Camera</Label>
                      <Input
                        id="camera"
                        name="camera"
                        value={formData.camera}
                        onChange={handleInputChange}
                        placeholder="e.g., 50MP + 12MP + 10MP"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="battery">Battery</Label>
                      <Input
                        id="battery"
                        name="battery"
                        value={formData.battery}
                        onChange={handleInputChange}
                        placeholder="e.g., 5000mAh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="screenSize">Screen Size</Label>
                      <Input
                        id="screenSize"
                        name="screenSize"
                        value={formData.screenSize}
                        onChange={handleInputChange}
                        placeholder="e.g., 6.7 inch AMOLED"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Space Gray"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.8kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 35.7 x 23.5 x 1.8 cm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="connectivity">Connectivity</Label>
                <Input
                  id="connectivity"
                  name="connectivity"
                  value={formData.connectivity}
                  onChange={handleInputChange}
                  placeholder="e.g., WiFi 6E, Bluetooth 5.3, USB-C, HDMI"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalSpecs">Additional Specifications</Label>
                <textarea
                  id="additionalSpecs"
                  name="additionalSpecs"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.additionalSpecs}
                  onChange={handleInputChange}
                  placeholder="Any other specifications or features (e.g., Backlit keyboard, Fingerprint sensor, etc.)"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Tags</h3>
              <p className="text-sm text-gray-600">Select applicable tags for better product visibility</p>
              
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Images *</h3>
              <p className="text-sm text-gray-600">Upload up to 5 images (Max 5MB each). First image will be the main product image.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    {/* Use Next.js Image for optimization */}
                    <Image
                      src={image.preview}
                      alt={`Product ${index + 1}`}
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
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
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
              <Button type="button" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
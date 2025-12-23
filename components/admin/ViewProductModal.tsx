'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/* =====================
   Types
===================== */

interface Category {
  id: string;
  name: string;
}

type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

interface Product {
  id?: string;
  name: string;
  price: number;
  old_price?: number;
  images?: string[];
  category_id?: string | null;
  brand?: string;
  model?: string;
  sku?: string;
  stock: number;
  status: ProductStatus;
  warranty?: string;
  description?: string;
  short_specs?: string;
  tags?: string[];
  flags?: string[];
}

interface ViewProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  categories?: Category[];
}

/* =====================
   Component
===================== */

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isOpen,
  product,
  onClose,
  categories = [],
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const images: string[] = Array.isArray(product.images) ? product.images : [];

  const getCategoryName = (categoryId?: string | null): string => {
    if (!categoryId) return '-';
    const match = categories.find((c) => c.id === categoryId);
    return match?.name ?? categoryId;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: ProductStatus): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      case 'inactive':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Images */}
              <div className="flex flex-col gap-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage || '/placeholder.png'}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image: string, idx: number) => (
                      <button
                        key={`${image}-${idx}`}
                        onClick={() => setSelectedImage(image)}
                        className={`rounded-lg overflow-hidden border-2 transition ${
                          selectedImage === image
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Product image ${idx + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-6">
                {/* Title & Status */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h1>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.old_price &&
                      product.old_price > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.old_price)}
                        </span>
                      )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="font-medium">
                      {getCategoryName(product.category_id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Brand</p>
                    <p className="font-medium">{product.brand ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Model</p>
                    <p className="font-medium">{product.model ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">SKU</p>
                    <p className="font-medium">{product.sku ?? '-'}</p>
                  </div>
                </div>

                {/* Stock */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Stock Available</p>
                  <p
                    className={`text-2xl font-bold ${
                      product.stock <= 5
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {product.stock} units
                  </p>
                </div>

                {product.warranty && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Warranty</p>
                    <p className="font-medium">{product.warranty}</p>
                  </div>
                )}

                <Button
                  onClick={onClose}
                  className="w-full bg-gray-900 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold mb-3">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specs */}
            {product.short_specs && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-bold mb-3">Specifications</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.short_specs}
                </p>
              </div>
            )}

            {/* Tags & Flags */}
            {(product.tags?.length || product.flags?.length) && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-bold mb-3">Tags & Flags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag: string, idx: number) => (
                    <Badge key={`tag-${idx}`} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {product.flags?.map((flag: string, idx: number) => (
                    <Badge
                      key={`flag-${idx}`}
                      className="bg-purple-100 text-purple-800"
                    >
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ViewProductModal.displayName = 'ViewProductModal';

export default ViewProductModal;

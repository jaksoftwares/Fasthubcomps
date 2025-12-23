'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CreditCard as Edit, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Loader from '@/components/ui/Loader';
import { ProductsAPI } from '@/lib/services/products';
import EditProductModal from '@/components/admin/EditProductModal';
import Image from 'next/image';

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, categoriesRes] = await Promise.all([
          ProductsAPI.getAll(),
          fetch('/api/categories').then((res) => res.json()).catch(() => []),
        ]);

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch products');
        toast.error(err?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader message="Loading products..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const getCategoryName = (categoryId: string | null | undefined) => {
    if (!categoryId) return '-';
    const match = categories.find((c) => c.id === categoryId);
    return match?.name || categoryId;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ProductsAPI.delete(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete product');
    }
  };

  // Prepare filtered list for rendering
  const term = searchTerm.toLowerCase();
  const filtered = products.filter(product => {
    const categoryName = getCategoryName(product.category_id || null).toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      categoryName.includes(term)
    );
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Products ({products.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
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
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Brand</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 px-4 text-center text-sm text-gray-500">No products found.</td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    const imageUrl = Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : '/placeholder.png';
                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <span className="font-medium text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{getCategoryName(product.category_id || null)}</td>
                        <td className="py-3 px-4 text-gray-600">{product.brand}</td>
                        <td className="py-3 px-4 font-medium">{formatPrice(product.price)}</td>
                        <td className="py-3 px-4">
                          <span className={`${product.stock <= 5 ? 'text-red-600' : 'text-gray-600'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status?.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={(updated) => {
            setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
};

export default ProductsTable;
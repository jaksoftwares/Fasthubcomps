"use client";
import React from 'react';
import Link from 'next/link';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { state, removeWishlistItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Wishlist ({state.items.length})</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-pink-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        KSh {item.price}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            addItem({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              category: item.category,
                            });
                            removeWishlistItem(item.id);
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeWishlistItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-pink-600">
                  KSh {state.items.reduce((sum, item) => sum + item.price, 0)}
                </span>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={clearWishlist}>
                  Clear Wishlist
                </Button>
                <Link href="/wishlist" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    View Wishlist
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;

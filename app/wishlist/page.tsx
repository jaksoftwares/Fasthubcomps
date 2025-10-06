"use client";
import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const WishlistPage = () => {
  const { state, removeWishlistItem, clearWishlist } = useWishlist();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          {state.items.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your wishlist is empty.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border rounded-lg p-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">KSh {item.price}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeWishlistItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={clearWishlist}>
                  Clear Wishlist
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistPage;

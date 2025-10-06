"use client";
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: 'ADD_WISHLIST_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_WISHLIST_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_WISHLIST_ITEM': {
      if (state.items.find(item => item.id === action.payload.id)) return state;
      const newItems = [...state.items, action.payload];
      return { items: newItems };
    }
    case 'REMOVE_WISHLIST_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return { items: newItems };
    }
    case 'CLEAR_WISHLIST':
      return { items: [] };
    case 'LOAD_WISHLIST':
      return { items: action.payload };
    default:
      return state;
  }
};

const WishlistContext = createContext<{
  state: WishlistState;
  addWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (id: string) => void;
  clearWishlist: () => void;
} | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem('fasthub-wishlist');
    if (saved) {
      dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fasthub-wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addWishlistItem = (item: WishlistItem) => {
    dispatch({ type: 'ADD_WISHLIST_ITEM', payload: item });
  };
  const removeWishlistItem = (id: string) => {
    dispatch({ type: 'REMOVE_WISHLIST_ITEM', payload: id });
  };
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  return (
    <WishlistContext.Provider value={{ state, addWishlistItem, removeWishlistItem, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

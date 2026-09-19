'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface CartItem {
  id: string; // Unique cart item identifier (hash of product + variant + options)
  productId: string;
  productName: string;
  productSlug: string;
  mainImage: string;
  variantCode?: string;
  sizeLabel: string;
  shape?: string;
  color?: string;
  withLogo: boolean;
  customDimensions?: { widthCm: number; heightCm: number } | null;
  unitPrice: number; // calculated unit price based on scale
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  buyNow: (item: Omit<CartItem, "id">) => void;
  directBuyItem: CartItem | null;
  totalItems: number;
  subtotal: number;
  quickViewProduct: any | null;
  setQuickViewProduct: (product: any | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const router = useRouter();

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fyf_cart");
      if (saved) setItems(JSON.parse(saved));
      const savedDirect = localStorage.getItem("fyf_direct_buy");
      if (savedDirect) setDirectBuyItem(JSON.parse(savedDirect));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fyf_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const generateItemId = (item: Omit<CartItem, "id">): string => {
    return `${item.productId}-${item.sizeLabel}-${item.shape || ""}-${item.color || ""}-${item.withLogo ? "logo" : "nologo"}-${item.customDimensions ? `${item.customDimensions.widthCm}x${item.customDimensions.heightCm}` : ""}`;
  };

  const addItem = (newItem: Omit<CartItem, "id">) => {
    const id = generateItemId(newItem);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, { ...newItem, id }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setDirectBuyItem(null);
    localStorage.removeItem("fyf_cart");
    localStorage.removeItem("fyf_direct_buy");
  };

  // Compra directa estilo Shopify: omite carrito y redirige al checkout
  const buyNow = (item: Omit<CartItem, "id">) => {
    const id = generateItemId(item);
    const cartItem: CartItem = { ...item, id };
    setDirectBuyItem(cartItem);
    try {
      localStorage.setItem("fyf_direct_buy", JSON.stringify(cartItem));
    } catch (e) {}
    router.push("/checkout?direct=true");
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        buyNow,
        directBuyItem,
        totalItems,
        subtotal,
        quickViewProduct,
        setQuickViewProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

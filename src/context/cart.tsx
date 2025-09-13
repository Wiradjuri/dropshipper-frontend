"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product, Order } from "../lib/api";
import { createOrder } from "../lib/api";

type CartItem = { product: Product; quantity: number };

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clear: () => void;
  subtotal_cents: number;
  placeOrder: () => Promise<Order>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LS_KEY = "cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: number) => setItems(prev => prev.filter(i => i.product.id !== productId));
  const updateQty = (productId: number, quantity: number) => setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  const clear = () => setItems([]);

  const subtotal_cents = useMemo(() => items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0), [items]);

  const placeOrder = async () => {
    const order = await createOrder(items.map(i => ({ product_id: i.product.id, quantity: i.quantity })));
    return order;
  };

  const value: CartContextType = { items, addItem, removeItem, updateQty, clear, subtotal_cents, placeOrder };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

import React, { createContext, useContext, useState, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  category: "umkm" | "standar" | "profesional";
  price: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  discount: number;
  applyCoupon: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPONS: Record<string, number> = {
  DESAIN10: 10,
  UMKM20: 20,
  WELCOME15: 15,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscount(0);
    setCouponCode("");
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const applyCoupon = useCallback(() => {
    const upper = couponCode.toUpperCase();
    if (VALID_COUPONS[upper]) {
      setDiscount(VALID_COUPONS[upper]);
      return true;
    }
    setDiscount(0);
    return false;
  }, [couponCode]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalPrice, itemCount: items.length, couponCode, setCouponCode, discount, applyCoupon }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

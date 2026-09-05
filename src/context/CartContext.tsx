import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, extendedWarranty?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleExtendedWarranty: (productId: string) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  warrantyTotal: number;
  shippingFee: number;
  total: number;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rephone_cart_items_v1';
const SAVED_STORAGE_KEY = 'rephone_saved_for_later_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedForLater));
  }, [savedForLater]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    extendedWarranty = false
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (selectedColor) updated[existingIndex].selectedColor = selectedColor;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: selectedColor || product.color,
          extendedWarranty,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleExtendedWarranty = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, extendedWarranty: !item.extendedWarranty }
          : item
      )
    );
  };

  const saveForLater = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    setSavedForLater((prev) => [...prev.filter((i) => i.product.id !== productId), item]);
  };

  const moveToCart = (productId: string) => {
    const item = savedForLater.find((i) => i.product.id === productId);
    if (!item) return;
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== productId));
    addToCart(item.product, item.quantity, item.selectedColor, item.extendedWarranty);
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'REPHONE500') {
      setCouponCode(trimmed);
      setDiscountAmount(500);
      return { success: true, message: '৳500 voucher discount applied successfully!' };
    } else if (trimmed === 'WELCOME1000') {
      setCouponCode(trimmed);
      setDiscountAmount(1000);
      return { success: true, message: '৳1,000 New Customer Welcome Discount applied!' };
    } else if (trimmed === 'GREENBD') {
      setCouponCode(trimmed);
      setDiscountAmount(1500);
      return { success: true, message: '৳1,500 Eco-Warrior Bangladesh Discount applied!' };
    } else {
      return { success: false, message: 'Invalid or expired coupon code. Try REPHONE500 or WELCOME1000.' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.currentPrice * item.quantity, 0);
  const warrantyTotal = cart.reduce(
    (sum, item) => sum + (item.extendedWarranty ? 2500 * item.quantity : 0),
    0
  );
  // Free delivery across Bangladesh for orders above ৳30,000
  const shippingFee = cart.length === 0 ? 0 : subtotal > 30000 ? 0 : 250;
  const total = Math.max(0, subtotal + warrantyTotal + shippingFee - discountAmount);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleExtendedWarranty,
        saveForLater,
        moveToCart,
        clearCart,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        subtotal,
        warrantyTotal,
        shippingFee,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

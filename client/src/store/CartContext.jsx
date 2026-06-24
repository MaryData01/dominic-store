import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useCurrency } from './CurrencyContext';
import { useUserAuth } from './UserAuthContext';
import api from '../lib/axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const { user } = useUserAuth();
  const prevUserRef = useRef(user);
  const isCartMergedRef = useRef(false);

  // Sync cart from DB on login (merge with local items)
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (user) {
        try {
          const res = await api.get('/auth/cart');
          const dbCart = res.data;
          
          setItems(prevItems => {
            const merged = [...prevItems];
            dbCart.forEach(dbItem => {
              const exists = merged.some(localItem => localItem.productId === dbItem.productId);
              if (!exists) {
                merged.push(dbItem);
              }
            });
            return merged;
          });
        } catch (err) {
          console.error('Failed to fetch user cart from database:', err);
        } finally {
          isCartMergedRef.current = true;
        }
      } else {
        isCartMergedRef.current = false;
      }
    };
    
    syncCartOnLogin();
  }, [user]);

  // Clear cart on logout
  useEffect(() => {
    if (prevUserRef.current && !user) {
      setItems([]);
      isCartMergedRef.current = false;
    }
    prevUserRef.current = user;
  }, [user]);

  // Sync cart to DB on every cart change (silent)
  useEffect(() => {
    const syncCartToDb = async () => {
      if (user && isCartMergedRef.current) {
        try {
          await api.put('/auth/cart', items);
        } catch (err) {
          console.error('Failed to sync cart to database:', err);
        }
      }
    };

    syncCartToDb();
  }, [items, user]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          quantity,
          slug: product.slug,
        },
      ];
    });
    toast.success('Added to cart ✓');
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const { formatPrice } = useCurrency();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formattedSubtotal = formatPrice(subtotal);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    formattedSubtotal,
    isDrawerOpen,
    setIsDrawerOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

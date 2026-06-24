import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, subtotal } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsDrawerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsDrawerOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-bg-surface border-l border-bg-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-bg-border">
              <h2 className="font-display font-bold text-2xl text-text-primary">Your Cart</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-body text-lg mb-4">Your cart is empty.</p>
                  <button 
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/products');
                    }}
                    className="text-brand-cyan hover:text-brand-cyan/80 transition-colors"
                  >
                    Start exploring →
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-20 h-20 bg-bg-base rounded-lg border border-bg-border overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">Img</div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-body font-medium text-sm text-text-primary line-clamp-2 pr-2">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-text-muted hover:text-status-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-bg-border rounded-md bg-bg-base overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-bg-raised text-text-secondary transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-bg-raised text-text-secondary transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-mono text-text-primary text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-bg-border bg-bg-surface">
                <div className="flex justify-between mb-2">
                  <span className="font-body text-text-secondary">Subtotal</span>
                  <span className="font-mono text-lg text-text-primary">{formatPrice(subtotal)}</span>
                </div>
                <p className="font-body text-xs text-text-muted mb-6">Calculated at checkout</p>
                
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-4 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base font-display font-bold text-lg rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

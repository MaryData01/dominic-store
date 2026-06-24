import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingCart, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import { useCart } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import toast from 'react-hot-toast';
import ReactGA from 'react-ga4';

const categories = [
  { id: 'monitors', name: 'Monitor' },
  { id: 'keyboards', name: 'Keyboard' },
  { id: 'mice', name: 'Mouse' },
  { id: 'headsets', name: 'Headset' },
  { id: 'chairs', name: 'Chair' },
  { id: 'controllers', name: 'Controller' },
  { id: 'capture-cards', name: 'Capture Card' },
  { id: 'lighting', name: 'Lighting' },
];

const categorySingularMap = {
  monitors: 'Monitor',
  keyboards: 'Keyboard',
  mice: 'Mouse',
  headsets: 'Headset',
  chairs: 'Chair',
  controllers: 'Controller',
  'capture-cards': 'Capture Card',
  lighting: 'Lighting Setup'
};

const SetupBuilder = () => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [selections, setSelections] = useState(() => {
    const saved = sessionStorage.getItem('setupSelections');
    return saved ? JSON.parse(saved) : {};
  });
  
  const { addItem } = useCart();

  useEffect(() => {
    sessionStorage.setItem('setupSelections', JSON.stringify(selections));
  }, [selections]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['setupProducts', activeTab],
    queryFn: async () => {
      const res = await api.get(`/products?category=${activeTab}&limit=20`);
      return res.data.products;
    },
  });

  const handleSelect = (product) => {
    setSelections(prev => ({ ...prev, [product.category]: product }));
  };

  const totalAmount = Object.values(selections).reduce((acc, curr) => acc + curr.price, 0);
  const selectedCount = Object.keys(selections).length;

  const clearSetup = () => {
    setSelections({});
    sessionStorage.removeItem('setupSelections');
  };

  const handleAddAllToCart = () => {
    const items = Object.values(selections);
    if (items.length === 0) return;
    
    ReactGA.event({ category: 'Setup Builder', action: 'Add All to Cart', value: totalAmount });

    items.forEach(product => {
      addItem(product, 1);
    });
    
    toast.success(`Setup added to cart — ${items.length} items`, {
      duration: 3000,
      icon: '🚀'
    });
    
    clearSetup();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 lg:py-12 flex flex-col lg:flex-row gap-8 h-auto lg:h-[calc(100vh-100px)]">
      
      {/* Left Panel: Tabs & Active Selection */}
      <div className="w-full lg:w-1/3 flex flex-col h-auto lg:h-full bg-bg-surface border border-bg-border rounded-xl overflow-hidden shrink-0">
        <div className="p-6 border-b border-bg-border">
          <h1 className="font-display text-3xl font-bold uppercase">Setup Builder</h1>
          <p className="text-text-secondary mt-1">Select one item per category.</p>
        </div>
        
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto p-4 gap-2 scrollbar-none custom-scrollbar">
          {categories.map((cat) => {
            const isSelected = !!selections[cat.id];
            const isActive = activeTab === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center justify-between gap-3 px-4 py-2 lg:p-4 rounded-full lg:rounded-lg shrink-0 transition-all border text-sm lg:text-base ${
                  isActive 
                    ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' 
                    : 'bg-bg-base border-bg-border text-text-primary hover:border-brand-violet/50'
                } lg:w-full`}
              >
                <span className="font-display font-bold text-sm lg:text-lg whitespace-nowrap">{cat.name}</span>
                <div className="flex items-center">
                  {isSelected ? (
                    <CheckCircle2 className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? 'text-brand-cyan' : 'text-status-success'}`} />
                  ) : (
                    <span className="text-[10px] lg:text-xs font-mono text-text-muted hidden lg:block">[empty]</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-bg-border bg-bg-surface z-30 lg:static lg:p-6 lg:border-t lg:border-bg-border lg:bg-bg-raised lg:mt-auto lg:z-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-text-secondary">Running Total</span>
            <motion.span 
              key={totalAmount}
              initial={{ scale: 1.1, color: '#00D4FF' }}
              animate={{ scale: 1, color: '#F0F0FF' }}
              className="font-mono text-2xl font-bold text-text-primary"
            >
              {formatPrice(totalAmount)}
            </motion.span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={clearSetup}
              disabled={selectedCount === 0}
              className="p-3 border border-bg-border text-text-muted hover:text-status-error rounded-lg transition-colors disabled:opacity-50"
              title="Clear Setup"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleAddAllToCart}
              disabled={selectedCount === 0}
              className="flex-1 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Add All to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Products Selection */}
      <div className="w-full lg:w-2/3 flex flex-col h-auto lg:h-full">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold capitalize">Choose a {categorySingularMap[activeTab]}</h2>
          {selections[activeTab] && (
            <button 
              onClick={() => {
                const newS = {...selections};
                delete newS[activeTab];
                setSelections(newS);
              }}
              className="text-sm text-status-error hover:underline flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" /> Remove current selection
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="rounded-xl border border-bg-border bg-bg-surface p-4 flex gap-4">
                  <div className="w-24 h-24 bg-bg-raised animate-pulse rounded-lg shrink-0" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="h-5 w-3/4 bg-bg-raised animate-pulse rounded mb-2" />
                      <div className="h-3 w-1/2 bg-bg-raised animate-pulse rounded" />
                    </div>
                    <div className="h-4 w-16 bg-bg-raised animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products?.map(product => {
                const isSelected = selections[product.category]?._id === product._id;
                return (
                  <div 
                    key={product._id}
                    onClick={() => handleSelect(product)}
                    className={`cursor-pointer rounded-xl border p-4 flex gap-4 transition-all ${
                      isSelected 
                        ? 'border-brand-cyan bg-brand-cyan/5 shadow-[0_0_15px_rgba(0,212,255,0.15)] ring-1 ring-brand-cyan' 
                        : 'border-bg-border bg-bg-surface hover:border-text-muted'
                    }`}
                  >
                    <div className="w-24 h-24 bg-bg-base rounded-lg border border-bg-border overflow-hidden shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover mix-blend-screen" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">Img</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="font-display font-bold text-lg leading-tight mb-1 line-clamp-2 text-text-primary">{product.name}</h4>
                        <div className="flex gap-1 text-xs text-text-muted">
                           {Object.values(product.specs || {}).slice(0, 2).map((s,i) => <span key={i} className="truncate">{s} {i===0 && '•'}</span>)}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="font-mono text-brand-cyan">{formatPrice(product.price)}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-cyan" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupBuilder;

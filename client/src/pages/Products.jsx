import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, SearchX } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { useCurrency, CURRENCIES } from '../store/CurrencyContext';

const categories = [
  'keyboards', 'mice', 'headsets', 'monitors', 
  'controllers', 'chairs', 'capture-cards', 'lighting'
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { currency } = useCurrency();

  const selectedCategories = searchParams.get('category') ? searchParams.get('category').split(',') : [];
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategories, minPrice, maxPrice, sort, page, searchQuery, currency],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams);
      const rate = CURRENCIES[currency].rate;
      if (params.get('minPrice')) {
        const minVal = parseFloat(params.get('minPrice'));
        if (!isNaN(minVal)) {
          params.set('minPrice', Math.round(minVal / rate));
        }
      }
      if (params.get('maxPrice')) {
        const maxVal = parseFloat(params.get('maxPrice'));
        if (!isNaN(maxVal)) {
          params.set('maxPrice', Math.round(maxVal / rate));
        }
      }
      const qs = params.toString();
      const res = await api.get(`/products?${qs}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const toggleCategory = (cat) => {
    const nextCategories = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    const params = new URLSearchParams(searchParams);
    if (nextCategories.length) {
      params.set('category', nextCategories.join(','));
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    setSearchParams(params);
  };

  const handlePriceChange = (type, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const renderFiltersContent = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-lg text-text-primary">Filters</h3>
        {(selectedCategories.length > 0 || minPrice || maxPrice) && (
          <button onClick={clearFilters} className="text-xs font-body text-brand-cyan hover:underline">
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-body font-medium text-sm text-text-secondary mb-4 uppercase tracking-wider">Category</h4>
        <div className="space-y-3">
          {categories.map(cat => (
            <label key={cat} className="flex items-center group cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-bg-border bg-bg-base text-brand-cyan focus:ring-brand-cyan/50 focus:ring-offset-bg-surface"
              />
              <span className="ml-3 font-body text-sm text-text-primary group-hover:text-brand-cyan capitalize">
                {cat.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-body font-medium text-sm text-text-secondary mb-4 uppercase tracking-wider">Price ({CURRENCIES[currency].symbol})</h4>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-full bg-bg-base border border-bg-border rounded text-sm px-2 py-2 text-text-primary focus:border-brand-cyan outline-none font-mono"
          />
          <span className="text-text-muted">-</span>
          <input 
            type="number" 
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-full bg-bg-base border border-bg-border rounded text-sm px-2 py-2 text-text-primary focus:border-brand-cyan outline-none font-mono"
          />
        </div>
      </div>
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -16 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-text-primary uppercase tracking-wide">
            {searchQuery ? `Search: ${searchQuery}` : 'All Gear'}
          </h1>
          <p className="font-body text-text-secondary mt-1">
            {data?.total || 0} products found
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={sort} 
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set('sort', e.target.value);
              params.set('page', '1');
              setSearchParams(params);
            }}
            className="bg-bg-surface border border-bg-border text-text-primary text-sm rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 font-body"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden p-2.5 bg-bg-surface border border-bg-border rounded-lg text-text-primary hover:text-brand-cyan transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Sidebar Filters Drawer */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black z-50 md:hidden"
              />
              {/* Drawer Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-bg-surface border-r border-bg-border z-50 p-6 overflow-y-auto md:hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-xl text-text-primary">Filters</h3>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 text-text-secondary hover:text-text-primary rounded-lg"
                    aria-label="Close filters"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {renderFiltersContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block md:w-64 shrink-0">
          <div className="bg-bg-surface border border-bg-border rounded-xl p-6 sticky top-24">
            {renderFiltersContent()}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[1,2,3,4,5,6,7,8].map(n => (
                <SkeletonProductCard key={n} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-status-error font-body">Error loading products.</div>
          ) : data?.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-bg-border rounded-xl">
              <SearchX className="w-16 h-16 text-text-muted mb-4" />
              <h3 className="font-display text-2xl font-bold text-text-primary mb-2">No products found</h3>
              <p className="font-body text-text-secondary mb-6">Try adjusting your filters or search query.</p>
              <button 
                onClick={clearFilters}
                className="px-6 py-2 bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan hover:text-bg-base rounded transition-colors font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                  hidden: {}
                }}
              >
                {data.products.map(product => (
                  <motion.div key={product._id} variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(Math.max(1, page - 1)));
                      setSearchParams(params);
                    }}
                    className="px-4 py-2 border border-bg-border rounded bg-bg-surface text-text-primary disabled:opacity-50 hover:bg-bg-raised transition-colors"
                  >
                    Prev
                  </button>
                  <span className="flex items-center px-4 font-mono text-text-secondary">
                    {page} / {data.pages}
                  </span>
                  <button 
                    disabled={page === data.pages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(Math.min(data.pages, page + 1)));
                      setSearchParams(params);
                    }}
                    className="px-4 py-2 border border-bg-border rounded bg-bg-surface text-text-primary disabled:opacity-50 hover:bg-bg-raised transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Products;

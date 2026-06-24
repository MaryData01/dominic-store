import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useCurrency } from '../store/CurrencyContext';

const SearchOverlay = ({ isOpen, onClose }) => {
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await api.get(`/products?search=${query}&limit=5`);
        setResults(data.products);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && query.trim()) {
      onClose();
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-bg-base/95 backdrop-blur-md flex flex-col pt-20 px-4"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-text-secondary hover:text-text-primary p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-3xl mx-auto">
            <div className="relative flex items-center border-b-2 border-brand-cyan/50 focus-within:border-brand-cyan transition-colors pb-4">
              <Search className="w-8 h-8 text-brand-cyan mr-4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-full bg-transparent border-none outline-none font-display text-4xl sm:text-5xl font-bold text-text-primary placeholder:text-text-muted"
              />
              {isLoading && <Loader2 className="w-6 h-6 text-brand-cyan animate-spin absolute right-0" />}
            </div>

            <div className="mt-8">
              {results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map(product => (
                    <motion.li 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={product._id}
                    >
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/products/${product.slug}`);
                        }}
                        className="w-full flex items-center p-4 rounded-xl hover:bg-bg-raised transition-colors group text-left"
                      >
                        <div className="w-12 h-12 bg-bg-base rounded border border-bg-border mr-4 overflow-hidden shrink-0">
                          {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-body text-lg font-medium text-text-primary group-hover:text-brand-cyan transition-colors">
                            {product.name}
                          </h4>
                          <span className="font-mono text-sm text-text-secondary">{formatPrice(product.price)}</span>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                  <li className="pt-4 text-center">
                    <button 
                      onClick={() => {
                        onClose();
                        navigate(`/products?search=${encodeURIComponent(query)}`);
                      }}
                      className="font-body text-brand-cyan hover:underline"
                    >
                      View all results for "{query}"
                    </button>
                  </li>
                </ul>
              ) : query.trim() && !isLoading ? (
                <p className="font-body text-text-secondary text-center text-lg mt-12">
                  No products found for "{query}"
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;

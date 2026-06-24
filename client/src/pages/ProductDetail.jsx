import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Minus, Plus, ShoppingCart, Heart, ChevronRight } from 'lucide-react';
import api from '../lib/axios';
import { useCart } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import ReactGA from 'react-ga4';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved).includes(slug) : false;
  });

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data;
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related', product?.category, product?._id],
    queryFn: async () => {
      const res = await api.get(`/products?category=${product.category}&limit=4&exclude=${product._id}`);
      return res.data.products;
    },
    enabled: !!product,
  });

  const handleWishlist = () => {
    const saved = localStorage.getItem('wishlist');
    let list = saved ? JSON.parse(saved) : [];
    if (isWishlisted) {
      list = list.filter(item => item !== slug);
      toast('Removed from saved items');
    } else {
      list.push(slug);
      toast.success('Saved for later');
    }
    localStorage.setItem('wishlist', JSON.stringify(list));
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      ReactGA.event({ category: 'Cart', action: 'Add to Cart', label: product.name, value: product.price });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-4 w-16 bg-bg-raised animate-pulse rounded" />
          <div className="h-4 w-4 bg-bg-raised animate-pulse rounded" />
          <div className="h-4 w-20 bg-bg-raised animate-pulse rounded" />
          <div className="h-4 w-4 bg-bg-raised animate-pulse rounded" />
          <div className="h-4 w-32 bg-bg-raised animate-pulse rounded" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side: Images */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="w-full aspect-square bg-bg-raised rounded-xl animate-pulse" />
            <div className="flex gap-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="w-20 h-20 bg-bg-raised rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Category */}
            <div className="h-4 w-24 bg-bg-raised animate-pulse rounded" />
            
            {/* Title */}
            <div className="h-10 w-3/4 bg-bg-raised animate-pulse rounded" />
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="h-4 w-24 bg-bg-raised animate-pulse rounded" />
              <div className="h-4 w-12 bg-bg-raised animate-pulse rounded" />
            </div>

            {/* Price */}
            <div className="h-8 w-32 bg-bg-raised animate-pulse rounded" />

            {/* Stock status badge */}
            <div className="h-6 w-20 bg-bg-raised animate-pulse rounded-full" />

            {/* Description lines */}
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full bg-bg-raised animate-pulse rounded" />
              <div className="h-4 w-full bg-bg-raised animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-bg-raised animate-pulse rounded" />
            </div>

            {/* Quantity and Cart Button row */}
            <div className="flex items-center gap-4 pt-6">
              <div className="h-12 w-32 bg-bg-raised animate-pulse rounded-lg" />
              <div className="h-12 flex-1 bg-bg-raised animate-pulse rounded-lg" />
              <div className="h-12 w-12 bg-bg-raised animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return <div className="text-center py-20 text-status-error">Product not found.</div>;
  }

  const inStock = product.stockStatus === 'in-stock';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -16 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-sm font-body text-text-muted mb-8">
        <Link to="/products" className="hover:text-brand-cyan transition-colors">Products</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/products?category=${product.category}`} className="hover:text-brand-cyan transition-colors capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-text-primary truncate">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        
        {/* Left: Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-square bg-bg-raised rounded-xl border border-bg-border overflow-hidden mb-4 relative">
            <AnimatePresence mode="wait">
              {product.images && product.images.length > 0 ? (
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-screen" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted bg-gradient-to-tr from-brand-violet/20 to-brand-cyan/20">
                  NO IMAGE
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 shrink-0 bg-bg-raised rounded-lg border-2 overflow-hidden transition-colors ${
                    activeImage === idx ? 'border-brand-cyan' : 'border-bg-border hover:border-text-muted'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover mix-blend-screen" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <p className="font-body text-brand-cyan text-sm uppercase tracking-widest mb-2 font-semibold">
            {product.category.replace('-', ' ')}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(product.rating?.average || 0) ? 'fill-status-warning text-status-warning' : 'text-bg-border'}`} />
              ))}
            </div>
            <span className="font-body text-sm text-text-secondary">{product.rating?.average || 0} ({product.rating?.count || 0} reviews)</span>
          </div>

          <div className="mb-6 flex items-end gap-4">
            <span className="font-mono text-4xl text-brand-cyan font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="font-mono text-xl text-text-muted line-through mb-1">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <div className="mb-8">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              inStock ? 'bg-status-success/10 text-status-success border-status-success/20' : 'bg-status-error/10 text-status-error border-status-error/20'
            }`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div 
            className="font-body text-text-secondary mb-8 leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }} 
          />

          <hr className="border-bg-border mb-8" />

          {/* Add to Cart Controls */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-bg-border rounded-lg bg-bg-surface h-14">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 h-full text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors rounded-l-lg"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 0 && val <= 10) setQuantity(val);
                }}
                className="w-12 text-center bg-transparent border-none focus:ring-0 font-mono text-lg p-0"
                min="1" max="10"
              />
              <button 
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-4 h-full text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors rounded-r-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 h-14 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base font-display font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button 
              onClick={handleWishlist}
              className={`h-14 w-14 flex items-center justify-center border rounded-lg transition-colors ${
                isWishlisted 
                  ? 'border-status-error text-status-error bg-status-error/10' 
                  : 'border-bg-border text-text-secondary hover:border-text-muted hover:text-text-primary bg-bg-surface'
              }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Specs Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-bold text-xl text-text-primary mb-4">Technical Specifications</h3>
              <div className="border border-bg-border rounded-lg overflow-hidden">
                <table className="w-full text-left font-body text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-base'}>
                        <th className="py-3 px-4 font-medium text-text-secondary border-b border-bg-border w-1/3">{key}</th>
                        <td className="py-3 px-4 font-mono text-text-primary border-b border-bg-border">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-bg-border">
          <p className="font-body text-xs tracking-widest uppercase text-brand-cyan mb-2 font-semibold">YOU MIGHT ALSO LIKE</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetail;

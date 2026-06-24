import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import ReactGA from 'react-ga4';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const isNew = () => {
    const date = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 14;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link 
      to={`/products/${product.slug}`} 
      onClick={() => ReactGA.event({ category: 'Product', action: 'Click', label: product.name })}
      className="group block bg-bg-surface rounded-xl border border-bg-border overflow-hidden product-card-glow relative"
    >
      <div className="aspect-square bg-bg-raised relative overflow-hidden flex items-center justify-center p-6">
        {isNew() && (
          <span className="absolute top-3 left-3 bg-brand-cyan text-bg-base text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded z-10">
            NEW
          </span>
        )}
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-brand-violet/20 to-brand-cyan/20 rounded-lg flex items-center justify-center text-text-muted">
            NO IMAGE
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="font-body text-brand-cyan text-xs uppercase tracking-widest mb-2 font-semibold">
          {product.category.replace('-', ' ')}
        </p>
        
        <h3 className="font-display text-xl font-bold text-text-primary mb-1 truncate">
          {product.name}
        </h3>
        
        <p className="font-body text-sm text-text-secondary truncate mb-4">
          {product.description || 'Premium gaming gear.'}
        </p>

        <div className="flex items-center space-x-1 mb-4">
          <Star className="w-4 h-4 fill-status-warning text-status-warning" />
          <span className="font-body text-sm font-medium text-text-primary ml-1">{product.rating?.average || 0}</span>
          <span className="font-body text-xs text-text-muted">({product.rating?.count || 0} reviews)</span>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            {product.comparePrice && (
              <span className="font-mono text-sm text-text-muted line-through block mb-1">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span className="font-mono text-lg text-text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan hover:text-bg-base p-3 rounded-lg transition-colors active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

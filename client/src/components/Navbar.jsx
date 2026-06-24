import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useUserAuth } from '../store/UserAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';
import CurrencySwitcher from './CurrencySwitcher';

const Navbar = () => {
  const { items, setIsDrawerOpen } = useCart();
  const { user, logout } = useUserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Build My Setup', path: '/build' },
    { name: 'AI Assistant', path: '/assistant' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-bg-base/80 border-b border-bg-border h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="https://res.cloudinary.com/dteqdjdq3/image/upload/v1781693192/8444318047406451_kpyzqz.jpg" 
              alt="Dominic Logo" 
              className="h-8 w-8 object-cover rounded-lg border border-bg-border group-hover:border-brand-cyan transition-colors"
            />
            <span className="font-display font-bold text-2xl text-text-primary tracking-widest">
              DOMINIC<span className="text-brand-cyan group-hover:text-text-primary transition-colors">/</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`font-body text-sm font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-brand-cyan font-semibold' 
                    : 'text-text-secondary hover:text-brand-cyan'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-text-secondary hover:text-brand-cyan transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <CurrencySwitcher />

            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-text-secondary hover:text-brand-cyan transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-brand-cyan text-bg-base text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Regular User Icon / Dropdown */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="text-text-secondary hover:text-brand-cyan transition-colors relative flex items-center justify-center p-1"
                  aria-label="User profile"
                >
                  <User className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-status-success rounded-full border border-bg-base" />
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-bg-surface border border-bg-border rounded-lg shadow-xl py-3 px-4 z-50 animate-fadeIn text-sm">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="block group hover:text-brand-cyan mb-3 transition-colors text-left"
                    >
                      <p className="font-display font-bold text-text-primary group-hover:text-brand-cyan truncate">{user.name}</p>
                      <p className="font-body text-xs text-text-muted group-hover:text-brand-cyan/80 truncate">{user.email}</p>
                    </Link>
                    <hr className="border-bg-border mb-2" />
                    <button 
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left text-status-error hover:underline transition-all font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="text-text-secondary hover:text-brand-cyan transition-colors flex items-center justify-center p-1"
                aria-label="Login"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-bg-base border-l border-bg-border shadow-2xl flex flex-col p-6 pt-20 lg:hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 right-5 text-text-secondary hover:text-brand-cyan transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={link.name}
                  >
                    <Link 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-display text-2xl font-bold transition-colors block ${
                        isActive(link.path) ? 'text-brand-cyan' : 'text-text-primary hover:text-brand-cyan'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                {/* Admin Dashboard mobile link removed */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

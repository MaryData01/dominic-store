import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, ShoppingBag, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: Package },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-bg-surface border-r border-bg-border hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-bg-border">
          <h2 className="font-display font-bold text-2xl tracking-widest text-brand-violet">DOMINIC<span className="text-text-primary">/ADMIN</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-violet/10 text-brand-violet border border-brand-violet/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <item.icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-bg-border">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-left text-status-error hover:bg-status-error/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Hamburger Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-bg-surface border-b border-bg-border flex items-center justify-between px-4 z-40 md:hidden">
        <h2 className="font-display font-bold text-xl tracking-widest text-brand-violet">DOMINIC<span className="text-text-primary">/ADMIN</span></h2>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-text-primary hover:text-brand-violet transition-colors w-11 h-11 flex items-center justify-center rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed top-0 bottom-0 left-0 w-64 bg-bg-surface border-r border-bg-border flex flex-col z-[60] md:hidden">
            <div className="p-6 border-b border-bg-border flex justify-between items-center">
              <h2 className="font-display font-bold text-2xl tracking-widest text-brand-violet">DOMINIC<span className="text-text-primary">/ADMIN</span></h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary w-11 h-11 flex items-center justify-center rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-violet/10 text-brand-violet border border-brand-violet/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                    }`}
                  >
                    <item.icon className="w-5 h-5" /> {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-bg-border">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 p-3 w-full text-left text-status-error hover:bg-status-error/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pt-0 pt-16">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

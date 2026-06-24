import React, { useState } from 'react';
import { useUserAuth } from '../../store/UserAuthContext';
import { useCart } from '../../store/CartContext';
import { useCurrency } from '../../store/CurrencyContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShoppingCart, Trash2, LogOut, ShieldAlert, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout, isLoading } = useUserAuth();
  const { items, removeItem, subtotal } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-bg-base">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure? This will permanently delete your account and cannot be undone.'
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await api.delete('/auth/account');
      toast.success('Account deleted successfully');
      logout(); // This clears state and localStorage
      navigate('/');
    } catch (err) {
      console.error('Account deletion failed:', err);
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-bg-base relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-cyan/5 via-bg-base to-bg-base -z-10" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-text-primary">
            Profile Dashboard
          </h1>
          <p className="font-body text-text-secondary text-sm mt-1">
            Manage your personal settings and setup preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Details Box */}
          <div className="md:col-span-1 bg-bg-surface border border-bg-border rounded-2xl p-6 h-fit space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-cyan/10 border border-brand-cyan/35 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-brand-cyan" />
              </div>
              <h2 className="font-display text-xl font-bold text-text-primary truncate max-w-full">
                {user.name}
              </h2>
              <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                Regular Member
              </span>
            </div>

            <hr className="border-bg-border" />

            <div className="space-y-4 font-body text-sm text-text-secondary">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-violet shrink-0" />
                <span className="truncate" title={user.email}>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-brand-violet shrink-0" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>

            <hr className="border-bg-border" />

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={logout}
                className="w-full h-10 bg-bg-base hover:bg-bg-raised border border-bg-border text-text-primary rounded-lg transition-colors flex items-center justify-center gap-2 font-display uppercase tracking-wider text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full h-10 bg-status-error/10 hover:bg-status-error text-status-error hover:text-bg-base border border-status-error/20 rounded-lg transition-all flex items-center justify-center gap-2 font-display uppercase tracking-wider text-sm font-semibold disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Account
              </button>
            </div>
          </div>

          {/* Cart & Saved Items */}
          <div className="md:col-span-2 bg-bg-surface border border-bg-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold uppercase tracking-wider flex items-center gap-2 text-text-primary">
                <ShoppingCart className="w-5 h-5 text-brand-cyan" />
                Saved Shopping Cart
              </h3>
              <span className="font-mono text-sm text-text-secondary">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <hr className="border-bg-border" />

            {items.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <ShoppingCart className="w-12 h-12 text-text-muted mx-auto opacity-20" />
                <p className="font-body text-text-secondary text-sm">
                  Your cart is empty. Save some gears to build your dream setup!
                </p>
                <Link
                  to="/products"
                  className="inline-block px-5 py-2 bg-brand-cyan/10 hover:bg-brand-cyan hover:text-bg-base text-brand-cyan transition-colors rounded-lg font-display uppercase font-bold text-sm"
                >
                  Browse Gear
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-bg-border max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 bg-bg-base rounded-lg border border-bg-border overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">Img</div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <Link to={`/products/${item.slug}`} className="font-body font-medium text-sm text-text-primary hover:text-brand-cyan transition-colors line-clamp-1 pr-2">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-text-muted hover:text-status-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="text-text-secondary">Qty: {item.quantity}</span>
                          <span className="font-mono text-brand-cyan font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-bg-border" />

                <div className="flex justify-between items-center bg-bg-base p-4 rounded-xl border border-bg-border">
                  <span className="font-body text-sm text-text-secondary">Cart Subtotal</span>
                  <div className="text-right">
                    <span className="font-mono text-xl font-bold text-text-primary">{formatPrice(subtotal)}</span>
                    <p className="text-[10px] text-text-muted mt-0.5">Final charge will be in NGN</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    to="/checkout"
                    className="px-6 py-3 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base font-display font-bold rounded-lg transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

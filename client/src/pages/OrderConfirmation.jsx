import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import { useCart } from '../store/CartContext';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference'); // Paystack appends ?reference=...
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [orderRef, setOrderRef] = useState(null);

  useEffect(() => {
    if (!reference) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api.get(`/orders/verify/${reference}`);
        if (res.data.status === 'paid') {
          setStatus('success');
          setOrderRef(res.data.orderRef);
          clearCart(); // Clear cart on successful payment
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Verification error', error);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [reference, clearCart, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-bg-border rounded-xl p-8 max-w-lg w-full text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-16 h-16 text-brand-cyan animate-spin mb-6" />
            <h2 className="font-display text-2xl font-bold">Verifying Payment...</h2>
            <p className="text-text-secondary mt-2">Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <motion.div 
              initial={{ pathLength: 0 }} 
              animate={{ pathLength: 1 }} 
              className="inline-block relative"
            >
              <svg className="w-24 h-24 text-status-success mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </motion.div>
            <h1 className="font-display text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-text-secondary mb-6">
              Thank you for gearing up with Dominic Store. Your payment was successful.
            </p>
            <div className="bg-bg-base border border-bg-border p-4 rounded-lg inline-block w-full mb-8">
              <p className="text-sm text-text-muted uppercase tracking-wider mb-1">Order Reference</p>
              <p className="font-mono text-xl text-brand-cyan font-bold">{orderRef || reference}</p>
            </div>
            <Link 
              to="/products"
              className="inline-block bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base font-bold px-8 py-4 rounded-lg transition-colors w-full"
            >
              Continue Shopping
            </Link>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <AlertCircle className="w-24 h-24 text-status-error mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">Payment Failed</h1>
            <p className="text-text-secondary mb-8">
              We couldn't verify your payment. If you were charged, please contact support. Otherwise, try checking out again.
            </p>
            <Link 
              to="/checkout"
              className="inline-block border border-status-error text-status-error hover:bg-status-error/10 font-bold px-8 py-3 rounded-lg transition-colors w-full"
            >
              Return to Checkout
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;

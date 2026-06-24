import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import ReactGA from 'react-ga4';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(0|\+234)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  address: z.string().min(10, 'Please enter full delivery address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", 
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", 
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState(1);
  const [contactData, setContactData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  const onContactSubmit = (data) => {
    setContactData(data);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    ReactGA.event({ category: 'Checkout', action: 'Payment Initiated', value: subtotal });
    try {
      const orderPayload = {
        customer: contactData,
        items,
        subtotal,
        total: subtotal // Add shipping logic here if needed
      };

      const res = await api.post('/orders', orderPayload);
      const { authorization_url } = res.data;
      
      // Redirect to Paystack
      window.location.href = authorization_url;
      
      // We don't clearCart here because they might cancel.
      // Cart will be cleared on the success confirmation page or via webhook eventually.
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="font-body text-text-secondary mb-8">Add some gear to your cart to proceed with checkout.</p>
        <Link to="/products" className="bg-brand-cyan text-bg-base px-6 py-3 rounded-lg font-bold">Shop Gear</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Steps Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-12 overflow-x-auto pb-4">
        {[
          { num: 1, label: 'Cart Review' },
          { num: 2, label: 'Contact Details' },
          { num: 3, label: 'Payment' }
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2 ${step >= s.num ? 'text-brand-cyan' : 'text-text-muted'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                step >= s.num ? 'border-brand-cyan bg-brand-cyan/10' : 'border-bg-border bg-bg-surface'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className="font-display font-bold uppercase tracking-wider hidden sm:block whitespace-nowrap">{s.label}</span>
            </div>
            {i < 2 && <div className={`w-8 sm:w-16 h-[2px] ${step > s.num ? 'bg-brand-cyan' : 'bg-bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-surface border border-bg-border rounded-xl p-6 md:p-8"
              >
                <h2 className="font-display text-2xl font-bold mb-6">Review Your Gear</h2>
                <div className="space-y-6">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-4 p-4 bg-bg-base rounded-lg border border-bg-border">
                      <div className="w-20 h-20 bg-bg-raised rounded overflow-hidden">
                         {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-screen" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-body font-medium text-text-primary">{item.name}</h3>
                        <p className="text-sm text-text-muted mt-1">Qty: {item.quantity}</p>
                        <p className="font-mono text-brand-cyan mt-2">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => { 
                      ReactGA.event({ category: 'Checkout', action: 'Begin Checkout', value: subtotal });
                      setStep(2); 
                      window.scrollTo(0,0); 
                    }}
                    className="bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base px-8 py-3 rounded-lg font-bold transition-colors"
                  >
                    Continue to Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-surface border border-bg-border rounded-xl p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold">Delivery Details</h2>
                  <button onClick={() => setStep(1)} className="text-sm text-brand-cyan hover:underline">Edit Cart</button>
                </div>
                
                <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                      <input 
                        {...register('name')} 
                        className={`w-full bg-bg-base border ${errors.name ? 'border-status-error' : 'border-bg-border'} rounded-lg p-3 text-text-primary focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none`}
                      />
                      {errors.name && <p className="text-status-error text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                      <input 
                        type="email"
                        {...register('email')} 
                        className={`w-full bg-bg-base border ${errors.email ? 'border-status-error' : 'border-bg-border'} rounded-lg p-3 text-text-primary focus:border-brand-cyan outline-none`}
                      />
                      {errors.email && <p className="text-status-error text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                    <input 
                      {...register('phone')} 
                      placeholder="08012345678"
                      className={`w-full bg-bg-base border ${errors.phone ? 'border-status-error' : 'border-bg-border'} rounded-lg p-3 text-text-primary focus:border-brand-cyan outline-none font-mono`}
                    />
                    {errors.phone && <p className="text-status-error text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Delivery Address</label>
                    <textarea 
                      {...register('address')} 
                      rows="3"
                      className={`w-full bg-bg-base border ${errors.address ? 'border-status-error' : 'border-bg-border'} rounded-lg p-3 text-text-primary focus:border-brand-cyan outline-none`}
                    />
                    {errors.address && <p className="text-status-error text-xs mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">State</label>
                      <select 
                        {...register('state')} 
                        className={`w-full bg-bg-base border ${errors.state ? 'border-status-error' : 'border-bg-border'} rounded-lg p-3 text-text-primary focus:border-brand-cyan outline-none appearance-none`}
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                      </select>
                      {errors.state && <p className="text-status-error text-xs mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">City</label>
                      <input 
                        {...register('city')} 
                        className={`w-full bg-bg-base border ${errors.city ? 'border-status-error' : 'border-bg-border'} rounded-lg p-3 text-text-primary focus:border-brand-cyan outline-none`}
                      />
                      {errors.city && <p className="text-status-error text-xs mt-1">{errors.city.message}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-bg-border">
                    <button 
                      type="submit"
                      className="bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base px-8 py-3 rounded-lg font-bold transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-bg-surface border border-bg-border rounded-xl p-6 md:p-8 text-center"
              >
                <ShieldCheck className="w-16 h-16 text-status-success mx-auto mb-6" />
                <h2 className="font-display text-3xl font-bold mb-4">Secure Payment</h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  You will be redirected to Paystack's secure checkout page to complete your payment of <span className="font-mono text-text-primary">{formatPrice(subtotal)}</span>.
                </p>
                
                <div className="bg-bg-base border border-bg-border rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
                  <p className="text-sm text-text-muted mb-1">Delivering to:</p>
                  <p className="font-medium">{contactData?.name}</p>
                  <p className="text-sm text-text-secondary">{contactData?.address}, {contactData?.city}, {contactData?.state}</p>
                  <button onClick={() => setStep(2)} className="text-xs text-brand-cyan mt-2 hover:underline">Edit details</button>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full max-w-md mx-auto bg-status-success hover:bg-status-success/90 text-bg-base px-8 py-4 rounded-lg font-display font-bold text-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(subtotal)}`}
                </button>
                <div className="mt-6 text-sm text-text-muted flex items-center justify-center gap-2">
                  <span>Secured by</span>
                  <span className="font-display font-bold text-text-primary text-lg">paystack</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4">
          <div className="bg-bg-surface border border-bg-border rounded-xl p-6 sticky top-24">
            <h3 className="font-display font-bold text-xl mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Items ({items.length})</span>
                <span className="font-mono text-text-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-brand-cyan text-sm">Calculated after payment</span>
              </div>
            </div>
            <div className="border-t border-bg-border pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-lg">Total</span>
                <span className="font-mono text-2xl font-bold text-brand-cyan">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-text-muted text-right">Prices are in NGN</p>
              <p className="text-[10px] text-text-muted text-right mt-1 leading-normal">Final charge will be in NGN at current exchange rates</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;

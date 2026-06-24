import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../store/UserAuthContext';
import { ShieldAlert, Loader2, Mail, Lock, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { login } = useUserAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setError('');
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-bg-base">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-cyan/5 via-bg-base to-bg-base -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-bg-surface border border-bg-border rounded-2xl p-8 shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-brand-cyan" />
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
            Sign In
          </h1>
          <p className="font-body text-text-secondary text-sm mt-2">
            Welcome back! Access your elite setup profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-status-error/10 border border-status-error/20 text-status-error text-sm rounded-lg flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 font-display uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                {...register('email')}
                className={`w-full bg-bg-base border ${
                  errors.email ? 'border-status-error' : 'border-bg-border'
                } rounded-lg pl-10 pr-4 py-3 text-text-primary focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all font-body`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-status-error text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 font-display uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                {...register('password')}
                className={`w-full bg-bg-base border ${
                  errors.password ? 'border-status-error' : 'border-bg-border'
                } rounded-lg pl-10 pr-4 py-3 text-text-primary focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all font-body`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-status-error text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base font-display font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-bg-border">
          <p className="text-sm font-body text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-cyan hover:underline font-semibold ml-1">
              Create one here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

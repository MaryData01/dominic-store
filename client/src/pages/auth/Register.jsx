import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../store/UserAuthContext';
import { ShieldAlert, Loader2, Mail, Lock, UserPlus, User } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { register: signup } = useUserAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setError('');
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-bg-base">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-violet/5 via-bg-base to-bg-base -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-bg-surface border border-bg-border rounded-2xl p-8 shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-violet/10 border border-brand-violet/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-7 h-7 text-brand-violet" />
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
            Create Account
          </h1>
          <p className="font-body text-text-secondary text-sm mt-2">
            Join Dominic Store. Elevate your setup experience.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-status-error/10 border border-status-error/20 text-status-error text-sm rounded-lg flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 font-display uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                {...register('name')}
                className={`w-full bg-bg-base border ${
                  errors.name ? 'border-status-error' : 'border-bg-border'
                } rounded-lg pl-10 pr-4 py-3 text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all font-body`}
                placeholder="Dominic Gaming"
              />
            </div>
            {errors.name && (
              <p className="text-status-error text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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
                } rounded-lg pl-10 pr-4 py-3 text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all font-body`}
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
                } rounded-lg pl-10 pr-4 py-3 text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all font-body`}
                placeholder="min. 8 characters"
              />
            </div>
            {errors.password && (
              <p className="text-status-error text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 font-display uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full bg-bg-base border ${
                  errors.confirmPassword ? 'border-status-error' : 'border-bg-border'
                } rounded-lg pl-10 pr-4 py-3 text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all font-body`}
                placeholder="confirm password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-status-error text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-brand-violet hover:bg-brand-violet/90 text-text-primary font-display font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-bg-border">
          <p className="text-sm font-body text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-violet hover:underline font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

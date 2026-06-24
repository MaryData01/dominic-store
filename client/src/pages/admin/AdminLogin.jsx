import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../store/AuthContext';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Required'),
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/admin/login', data);
      login(res.data);
      toast.success('Admin logged in');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bg-surface via-bg-base to-bg-base">
      <div className="bg-bg-surface border border-bg-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-violet to-transparent" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-bg-raised rounded-full border border-bg-border flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-brand-violet" />
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-widest">Admin Portal</h1>
          <p className="text-text-muted mt-2">Dominic Store Management</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input 
              type="email"
              {...register('email')} 
              className="w-full bg-bg-base border border-bg-border rounded-lg p-3 text-text-primary focus:border-brand-violet outline-none"
            />
            {errors.email && <p className="text-status-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <input 
              type="password"
              {...register('password')} 
              className="w-full bg-bg-base border border-bg-border rounded-lg p-3 text-text-primary focus:border-brand-violet outline-none"
            />
            {errors.password && <p className="text-status-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-violet hover:bg-brand-violet/90 text-bg-base font-bold px-4 py-3 rounded-lg transition-colors flex items-center justify-center h-12"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Secure Area'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

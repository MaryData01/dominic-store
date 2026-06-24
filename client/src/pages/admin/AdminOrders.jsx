import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, Loader2, Eye } from 'lucide-react';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../store/AuthContext';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.put(`/admin/orders/${id}`, { status });
    },
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries(['adminOrders']);
      queryClient.invalidateQueries(['adminStats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  });

  const handleStatusChange = (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    if (window.confirm(`Change order status to ${newStatus}?`)) {
      updateStatusMutation.mutate({ id, status: newStatus });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredOrders = orders?.filter(o => filter === 'all' || o.status === filter) || [];

  return (
    <div className="flex min-h-screen bg-bg-base">
      <aside className="w-64 bg-bg-surface border-r border-bg-border hidden md:flex flex-col">
        <div className="p-6 border-b border-bg-border">
           <h2 className="font-display font-bold text-2xl tracking-widest text-brand-violet">DOMINIC<span className="text-text-primary">/ADMIN</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-lg transition-colors">
             <Package className="w-5 h-5" /> Dashboard
           </Link>
           <Link to="/admin/products" className="flex items-center gap-3 p-3 text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-lg transition-colors">
             <Package className="w-5 h-5" /> Products
           </Link>
           <Link to="/admin/orders" className="flex items-center gap-3 p-3 bg-brand-violet/10 text-brand-violet rounded-lg font-medium">
             <Package className="w-5 h-5" /> Orders
           </Link>
        </nav>
        <div className="p-4 border-t border-bg-border">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-left text-status-error hover:bg-status-error/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Orders Manager</h1>
        </header>

        <div className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden flex flex-col h-[calc(100vh-160px)]">
          <div className="p-4 border-b border-bg-border flex gap-2 overflow-x-auto">
            {['all', 'pending', 'paid', 'fulfilled', 'cancelled'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize ${
                  filter === f ? 'bg-brand-violet text-bg-base border-brand-violet' : 'border-bg-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left font-body text-sm min-w-[900px]">
              <thead className="bg-bg-raised text-text-secondary sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer Info</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium w-40">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {isLoading ? (
                  <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-violet" /></td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-text-secondary">No orders found for this status</td></tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-bg-base/50 transition-colors">
                      <td className="p-4 font-mono text-brand-cyan">{order.orderRef}</td>
                      <td className="p-4">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-text-muted">{order.customer.email}</p>
                        <p className="text-xs text-text-muted">{order.customer.phone}</p>
                      </td>
                      <td className="p-4">
                        <div className="text-xs space-y-1">
                          {order.items.slice(0,2).map(i => <p key={i._id} className="truncate w-40 text-text-secondary">{i.quantity}x {i.name}</p>)}
                          {order.items.length > 2 && <p className="text-brand-violet italic">+{order.items.length - 2} more</p>}
                        </div>
                      </td>
                      <td className="p-4 font-mono">{formatCurrency(order.total)}</td>
                      <td className="p-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, order.status, e.target.value)}
                          className={`text-xs font-bold rounded-full px-2 py-1 border outline-none appearance-none cursor-pointer ${
                            order.status === 'pending' ? 'bg-status-warning/10 text-status-warning border-status-warning/30' :
                            order.status === 'paid' ? 'bg-status-success/10 text-status-success border-status-success/30' :
                            order.status === 'fulfilled' ? 'bg-brand-violet/10 text-brand-violet border-brand-violet/30' :
                            'bg-status-error/10 text-status-error border-status-error/30'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Clock, LogOut, ShoppingCart } from 'lucide-react';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../store/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['adminRecentOrders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data.slice(0, 10);
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-surface border-r border-bg-border hidden md:flex flex-col">
        <div className="p-6 border-b border-bg-border">
           <h2 className="font-display font-bold text-2xl tracking-widest text-brand-violet">DOMINIC<span className="text-text-primary">/ADMIN</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 bg-brand-violet/10 text-brand-violet rounded-lg font-medium">
             <Package className="w-5 h-5" /> Dashboard
           </Link>
           <Link to="/admin/products" className="flex items-center gap-3 p-3 text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-lg transition-colors">
             <ShoppingBag className="w-5 h-5" /> Products
           </Link>
           <Link to="/admin/orders" className="flex items-center gap-3 p-3 text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-lg transition-colors">
             <ShoppingCart className="w-5 h-5" /> Orders
           </Link>
        </nav>
        <div className="p-4 border-t border-bg-border">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-left text-status-error hover:bg-status-error/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Dashboard Overview</h1>
          <button className="md:hidden p-2 text-text-secondary"><Package className="w-6 h-6" /></button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-brand-cyan' },
            { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-brand-violet' },
            { label: 'Revenue', value: formatCurrency(stats?.revenue || 0), icon: DollarSign, color: 'text-status-success' },
            { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'text-status-warning' },
          ].map((stat, i) => (
            <div key={i} className="bg-bg-surface border border-bg-border p-6 rounded-xl flex items-center gap-4">
              <div className={`p-4 rounded-lg bg-bg-base border border-bg-border ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">{stat.label}</p>
                <p className="font-mono text-2xl font-bold">{isLoading ? '...' : stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-bg-border flex justify-between items-center">
            <h2 className="font-display text-xl font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-brand-violet hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-bg-raised text-text-secondary">
                <tr>
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {recentOrders?.map(order => (
                  <tr key={order._id} className="hover:bg-bg-base/50 transition-colors">
                    <td className="p-4 font-mono text-brand-cyan">{order.orderRef}</td>
                    <td className="p-4">{order.customer.name}</td>
                    <td className="p-4">{order.items.length} items</td>
                    <td className="p-4 font-mono">{formatCurrency(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                        order.status === 'pending' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' :
                        order.status === 'paid' ? 'bg-status-success/10 text-status-success border-status-success/20' :
                        order.status === 'fulfilled' ? 'bg-brand-violet/10 text-brand-violet border-brand-violet/20' :
                        'bg-status-error/10 text-status-error border-status-error/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!recentOrders?.length && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-text-secondary">No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

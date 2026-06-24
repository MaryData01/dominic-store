import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Loader2, UploadCloud } from 'lucide-react';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

const specsToText = (specsObj) => {
  if (!specsObj) return '';
  const entries = specsObj instanceof Map ? Array.from(specsObj.entries()) : Object.entries(specsObj);
  return entries.map(([key, val]) => `${key}: ${val}`).join('\n');
};

const textToSpecs = (text) => {
  const specs = {};
  if (!text) return specs;
  text.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      if (key && val) {
        specs[key] = val;
      }
    }
  });
  return specs;
};

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const initialFormState = {
  name: '',
  category: 'keyboards',
  price: '',
  comparePrice: '',
  description: '',
  specs: '',
  stockStatus: 'in-stock',
  featured: false,
  images: []
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState(initialFormState);

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      if (id) {
        const res = await api.put(`/products/${id}`, data);
        return res.data;
      } else {
        const res = await api.post('/products', data);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(editingProduct ? 'Product updated' : 'Product created');
      queryClient.invalidateQueries(['adminProductsList']);
      queryClient.invalidateQueries(['adminStats']);
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormState(initialFormState);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name || '',
      category: product.category || 'keyboards',
      price: product.price || '',
      comparePrice: product.comparePrice || '',
      description: product.description || '',
      specs: specsToText(product.specs),
      stockStatus: product.stockStatus || 'in-stock',
      featured: !!product.featured,
      images: product.images || []
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    setIsUploading(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormState(prev => ({
        ...prev,
        images: [...prev.images, ...res.data.urls]
      }));
      toast.success('Images uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Basic Validation
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = 'Product name is required';
    if (!formState.price) newErrors.price = 'Price is required';
    if (isNaN(Number(formState.price)) || Number(formState.price) <= 0) newErrors.price = 'Price must be a positive number';
    if (formState.comparePrice && (isNaN(Number(formState.comparePrice)) || Number(formState.comparePrice) < 0)) {
      newErrors.comparePrice = 'Compare price must be a positive number';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name: formState.name,
      slug: generateSlug(formState.name),
      category: formState.category,
      price: Number(formState.price),
      comparePrice: formState.comparePrice ? Number(formState.comparePrice) : undefined,
      description: formState.description,
      specs: textToSpecs(formState.specs),
      stockStatus: formState.stockStatus,
      featured: formState.featured,
      images: formState.images
    };

    saveMutation.mutate({
      id: editingProduct?._id,
      data: payload
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ['adminProductsList', page, search],
    queryFn: async () => {
      const res = await api.get(`/products?page=${page}&limit=20${search ? `&search=${search}` : ''}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries(['adminProductsList']);
      queryClient.invalidateQueries(['adminStats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
        <header className="mb-8 flex justify-between items-center gap-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide">Products Manager</h1>
          <button 
            onClick={openAddModal}
            className="bg-brand-violet hover:bg-brand-violet/90 text-bg-base px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </header>

        <div className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden flex flex-col h-[calc(100vh-160px)]">
          <div className="p-4 border-b border-bg-border">
            <input 
              type="text" 
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-bg-base border border-bg-border rounded-lg px-4 py-2 w-full max-w-sm focus:border-brand-violet outline-none"
            />
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left font-body text-sm min-w-[800px]">
              <thead className="bg-bg-raised text-text-secondary sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-medium w-16">Image</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {isLoading ? (
                  <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-violet" /></td></tr>
                ) : data?.products?.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-text-secondary">No products found</td></tr>
                ) : (
                  data?.products?.map(product => (
                    <tr key={product._id} className="hover:bg-bg-base/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 bg-bg-raised rounded border border-bg-border overflow-hidden">
                          {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover mix-blend-screen" />}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-brand-cyan capitalize">{product.category.replace('-', ' ')}</td>
                      <td className="p-4 font-mono">{formatCurrency(product.price)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs border ${product.stockStatus === 'in-stock' ? 'border-status-success text-status-success' : 'border-status-error text-status-error'}`}>
                          {product.stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="text-text-secondary hover:text-brand-cyan"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="text-text-secondary hover:text-status-error"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pages > 1 && (
            <div className="p-4 border-t border-bg-border flex justify-between items-center bg-bg-surface">
              <span className="text-sm text-text-secondary">Showing page {page} of {data.pages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border border-bg-border rounded hover:bg-bg-raised disabled:opacity-50 text-sm"
                >
                  Prev
                </button>
                <button 
                  disabled={page === data.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border border-bg-border rounded hover:bg-bg-raised disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-bg-surface border-0 sm:border border-bg-border rounded-none sm:rounded-xl w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto flex flex-col p-4 sm:p-6 custom-scrollbar">
            <h2 className="font-display text-2xl font-bold mb-4 uppercase text-text-primary">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4 flex-1">
              {/* Name */}
              <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none"
                  placeholder="e.g. G PRO X Superlight"
                />
                {errors.name && <p className="text-status-error text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-mono text-text-secondary uppercase mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none"
                  >
                    <option value="keyboards">Keyboards</option>
                    <option value="mice">Mice</option>
                    <option value="headsets">Headsets</option>
                    <option value="monitors">Monitors</option>
                    <option value="controllers">Controllers</option>
                    <option value="chairs">Chairs</option>
                    <option value="capture-cards">Capture Cards</option>
                    <option value="lighting">Lighting</option>
                  </select>
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-xs font-mono text-text-secondary uppercase mb-1">Stock Status</label>
                  <select
                    value={formState.stockStatus}
                    onChange={(e) => setFormState(prev => ({ ...prev, stockStatus: e.target.value }))}
                    className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-mono text-text-secondary uppercase mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={formState.price}
                    onChange={(e) => setFormState(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none"
                    placeholder="e.g. 85000"
                  />
                  {errors.price && <p className="text-status-error text-xs mt-1">{errors.price}</p>}
                </div>

                {/* Compare Price */}
                <div>
                  <label className="block text-xs font-mono text-text-secondary uppercase mb-1">Compare Price (₦)</label>
                  <input
                    type="number"
                    value={formState.comparePrice}
                    onChange={(e) => setFormState(prev => ({ ...prev, comparePrice: e.target.value }))}
                    className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none"
                    placeholder="e.g. 95000"
                  />
                  {errors.comparePrice && <p className="text-status-error text-xs mt-1">{errors.comparePrice}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-1">Description</label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none h-20"
                  placeholder="Product description..."
                />
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-1">Specifications (One per line, e.g. "Key: Value")</label>
                <textarea
                  value={formState.specs}
                  onChange={(e) => setFormState(prev => ({ ...prev, specs: e.target.value }))}
                  className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none h-20 font-mono text-xs"
                  placeholder="Switch: Mechanical GL&#10;Wireless: Yes"
                />
              </div>

              {/* Featured & Images section */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formState.featured}
                  onChange={(e) => setFormState(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded bg-bg-base border-bg-border text-brand-violet focus:ring-brand-violet"
                />
                <label htmlFor="featured" className="text-sm font-medium text-text-primary cursor-pointer select-none">
                  Featured Product (shows on home page)
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-2">Product Images</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-input"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-upload-input').click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 border border-bg-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors disabled:opacity-50"
                  >
                    <UploadCloud className="w-5 h-5" />
                    {isUploading ? 'Uploading...' : 'Upload Images'}
                  </button>
                  <span className="text-xs text-text-muted">Max 5 images</span>
                </div>

                {/* Image URLs text input fallback */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={formState.images.join(', ')}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                    className="w-full bg-bg-base border border-bg-border rounded-lg px-4 py-2 text-text-primary focus:border-brand-violet outline-none text-xs"
                    placeholder="Or enter comma-separated image URLs..."
                  />
                </div>

                {/* Thumbnails */}
                {formState.images.length > 0 && (
                  <div className="grid grid-cols-6 gap-2 mt-3">
                    {formState.images.map((url, index) => (
                      <div key={index} className="relative group w-16 h-16 bg-bg-raised border border-bg-border rounded overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover mix-blend-screen" />
                        <button
                          type="button"
                          onClick={() => setFormState(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }))}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-status-error font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-bg-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-bg-border text-text-primary hover:bg-bg-raised rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isLoading || isUploading}
                  className="px-6 py-2 bg-brand-violet hover:bg-brand-violet/90 text-bg-base font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {saveMutation.isLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;

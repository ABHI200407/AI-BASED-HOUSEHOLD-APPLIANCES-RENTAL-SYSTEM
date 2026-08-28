import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search, X, RefreshCw } from 'lucide-react';
import { fetchAppliances, createAppliance, updateAppliance, deleteAppliance, fetchCategories } from '../utils/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', brand: '', category_id: '',
    monthly_rent: '', weekly_rent: '', daily_rent: '', deposit: '',
    status: 'available', description: 'Premium rental product'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([fetchAppliances(), fetchCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name, brand: product.brand, category_id: product.category,
        monthly_rent: product.monthly_rent, weekly_rent: product.weekly_rent,
        daily_rent: product.daily_rent, deposit: product.deposit,
        status: product.status, description: product.description
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', brand: '', category_id: categories.length > 0 ? categories[0].id : '',
        monthly_rent: '', weekly_rent: '', daily_rent: '', deposit: '',
        status: 'available', description: 'Premium rental product'
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, category_id: parseInt(formData.category_id) };
    
    try {
      if (editingId) {
        await updateAppliance(editingId, payload);
      } else {
        await createAppliance(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteAppliance(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert('Error deleting product');
      }
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2"><RefreshCw className="animate-spin" /> Loading Products...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products Inventory</h1>
          <p className="text-slate-500 mt-1">Manage your rental catalog</p>
        </div>
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Monthly Rent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-slate-600">{p.brand}</td>
                  <td className="px-6 py-4 font-bold text-indigo-700">₹{p.monthly_rent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${p.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(p)} className="text-slate-400 hover:text-indigo-600 p-2 transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-600 p-2 transition-colors ml-2"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 border-b border-slate-100 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Brand</label>
                  <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500">
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Monthly Rent (₹)</label>
                  <input type="number" required value={formData.monthly_rent} onChange={e => setFormData({...formData, monthly_rent: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Weekly Rent (₹)</label>
                  <input type="number" required value={formData.weekly_rent} onChange={e => setFormData({...formData, weekly_rent: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Daily Rent (₹)</label>
                  <input type="number" required value={formData.daily_rent} onChange={e => setFormData({...formData, daily_rent: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Deposit (₹)</label>
                  <input type="number" required value={formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

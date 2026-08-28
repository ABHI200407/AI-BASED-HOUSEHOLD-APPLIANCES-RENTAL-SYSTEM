import { useState, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import { fetchCategories } from '../utils/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-sky-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-fuchsia-500'
  ];

  if (loading) return <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2"><RefreshCw className="animate-spin" /> Loading Categories...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Categories</h1>
          <p className="text-slate-500 mt-1">Organize your inventory by sections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={cat.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} text-4xl mb-4 shadow-lg text-white`}>
              <Package size={28} />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">{cat.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{cat.description || 'Premium rental category'}</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradients[i % gradients.length]} bg-opacity-20 text-sm font-semibold text-white`}>
                Live on site
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

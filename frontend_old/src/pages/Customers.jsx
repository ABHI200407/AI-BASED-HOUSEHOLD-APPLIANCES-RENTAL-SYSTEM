import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Search, RefreshCw } from 'lucide-react';
import { fetchCustomers } from '../utils/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const avatarColor = (name) => {
    const colors = ['from-indigo-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-sky-500 to-blue-500', 'from-pink-500 to-rose-500'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2"><RefreshCw className="animate-spin" /> Loading Customers...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 mt-1">View your registered users.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {filtered.map(c => (
            <div key={c.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="flex flex-col items-center text-center mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor(c.name)} flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-3`}>
                  {c.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-slate-900">{c.name}</h3>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mt-1">Customer #{c.id}</span>
              </div>
              <div className="space-y-3 mt-6 pt-4 border-t border-slate-100 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{c.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

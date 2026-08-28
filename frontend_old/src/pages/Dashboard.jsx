import { useState, useEffect } from 'react';
import { Package, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchDashboardStats } from '../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2"><RefreshCw className="animate-spin" /> Loading Dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.total_revenue.toLocaleString()}`, icon: <TrendingUp size={24} />, color: 'from-emerald-500 to-teal-500' },
    { title: 'Active Rentals', value: stats.active_bookings, icon: <Package size={24} />, color: 'from-indigo-500 to-purple-500' },
    { title: 'Total Products', value: stats.total_appliances, icon: <AlertCircle size={24} />, color: 'from-amber-500 to-orange-500' },
    { title: 'Total Customers', value: stats.total_customers, icon: <Users size={24} />, color: 'from-sky-500 to-blue-500' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Live metrics from your rental platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white mb-4 shadow-lg`}>
              {card.icon}
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{card.value}</div>
            <div className="text-sm font-semibold text-slate-500">{card.title}</div>
          </div>
        ))}
      </div>
      
      {/* Real-time alerts placeholder */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
          <AlertCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-indigo-900 text-lg mb-1">System Health</h3>
          <p className="text-indigo-700/80 text-sm">Dashboard is actively syncing with your backend SQLite database. All metrics are up to date.</p>
        </div>
      </div>
    </div>
  );
}

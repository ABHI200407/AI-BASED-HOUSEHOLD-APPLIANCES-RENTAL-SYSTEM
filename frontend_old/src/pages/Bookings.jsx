import { useState, useEffect } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { fetchBookings } from '../utils/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2"><RefreshCw className="animate-spin" /> Loading Bookings...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Bookings</h1>
          <p className="text-slate-500 mt-1">Live feed of all customer rentals.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Appliance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">#{b.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{b.customer ? b.customer.name : 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-600">{b.appliance ? b.appliance.name : 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-100 text-indigo-700">
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₹{b.total_amount}</td>
                  <td className="px-6 py-4 text-slate-500 flex items-center gap-2"><Calendar size={14}/> {new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Receipt, User, LogOut, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('rentals');

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  JD
                </div>
                <div>
                  <h3 className="font-bold">John Doe</h3>
                  <p className="text-xs text-slate-500">Premium Member</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button onClick={() => setActiveTab('rentals')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'rentals' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Package size={18} /> Active Rentals
                </button>
                <button onClick={() => setActiveTab('invoices')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'invoices' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Receipt size={18} /> Invoices
                </button>
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <User size={18} /> Profile
                </button>
                <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 mt-4 transition-colors">
                  <LogOut size={18} /> Sign Out
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px]">
              
              {activeTab === 'rentals' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Active Rentals</h2>
                    <Link to="/" className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-700">
                      Rent More <ArrowRight size={16} />
                    </Link>
                  </div>
                  
                  <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-5xl mb-4">📦</div>
                    <h3 className="text-lg font-bold mb-2">No active rentals yet</h3>
                    <p className="text-slate-500 mb-6">Your confirmed orders will appear here.</p>
                    <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-indigo-700 transition-colors">
                      Start Browsing
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'invoices' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold mb-6">Payment History</h2>
                  <div className="text-slate-500 text-center py-10">No past invoices available.</div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                      <input type="text" defaultValue="John Doe" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                      <input type="email" defaultValue="john@example.com" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50" />
                    </div>
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4">
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

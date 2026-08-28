import { useState } from 'react'
import Dashboard from '../pages/Dashboard'
import Products from '../pages/Products'
import Appliances from '../pages/Appliances'
import Bookings from '../pages/Bookings'
import Customers from '../pages/Customers'
import Categories from '../pages/Categories'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
  { id: 'products', label: 'Products', icon: '🛒' },
  { id: 'appliances', label: 'Appliances', icon: '🏷️' },
  { id: 'categories', label: 'Categories', icon: '📁' },
  { id: 'bookings', label: 'Bookings', icon: '📋' },
  { id: 'customers', label: 'Customers', icon: '👥' },
]

const pages = {
  dashboard: Dashboard,
  products: Products,
  appliances: Appliances,
  categories: Categories,
  bookings: Bookings,
  customers: Customers,
}

export default function AdminLayout() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const PageComponent = pages[activePage]

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-violet-500/30 flex-shrink-0">
            🏠
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm leading-tight">RentEase</div>
              <div className="text-violet-400 text-xs">Management System</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 space-y-1 px-3">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                activePage === item.id
                  ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/20 border border-violet-500/30 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <span className={`text-xl flex-shrink-0 ${activePage === item.id ? '' : 'grayscale group-hover:grayscale-0 transition-all'}`}>{item.icon}</span>
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {sidebarOpen && activePage === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm">
            {sidebarOpen ? '← Collapse' : '→'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold capitalize">{activePage}</h2>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 text-sm">Household Appliances Rental</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow">
              A
            </div>
            <div className="text-sm text-white font-medium">Admin</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <PageComponent />
        </main>
      </div>
    </div>
  )
}

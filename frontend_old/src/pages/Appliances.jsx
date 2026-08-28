import { useState } from 'react'
import { useApi, apiPost } from '../api'

const statusColors = {
  available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rented: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  maintenance: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function Appliances() {
  const { data: appliances, loading, refetch } = useApi('/appliances/')
  const { data: categories } = useApi('/categories/')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', description: '', category: '', daily_rent: '', weekly_rent: '', monthly_rent: '', deposit: '' })

  const filtered = appliances?.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.brand.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || a.status === filterStatus
    const matchCat = !filterCat || a.category === parseInt(filterCat)
    return matchSearch && matchStatus && matchCat
  }) || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    await apiPost('/appliances/', { ...form, category: parseInt(form.category) })
    refetch()
    setShowModal(false)
    setForm({ name: '', brand: '', description: '', category: '', daily_rent: '', weekly_rent: '', monthly_rent: '', deposit: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Appliances</h1>
          <p className="text-slate-400 mt-1">Manage your rental inventory</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-violet-500/20">
          <span className="text-lg">+</span> Add Appliance
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search appliances..." className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:border-violet-500 transition">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:border-violet-500 transition">
          <option value="">All Categories</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(a => (
            <div key={a.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-violet-300 transition">{a.name}</h3>
                  <p className="text-sm text-slate-400">{a.brand} • {a.category_name}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusColors[a.status]}`}>{a.status}</span>
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{a.description}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <RentBadge label="Daily" value={a.daily_rent} />
                <RentBadge label="Weekly" value={a.weekly_rent} />
                <RentBadge label="Monthly" value={a.monthly_rent} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white font-medium">{a.rating}</span>
                  <span className="text-slate-500">({a.reviews_count})</span>
                </div>
                <span className="text-slate-400">Deposit: <span className="text-white font-medium">₹{Number(a.deposit).toLocaleString('en-IN')}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Appliance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">Add New Appliance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
                <Input label="Brand" value={form.brand} onChange={v => setForm({...form, brand: v})} required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-violet-500">
                  <option value="">Select Category</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-violet-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Daily Rent (₹)" type="number" value={form.daily_rent} onChange={v => setForm({...form, daily_rent: v})} required />
                <Input label="Weekly Rent (₹)" type="number" value={form.weekly_rent} onChange={v => setForm({...form, weekly_rent: v})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Monthly Rent (₹)" type="number" value={form.monthly_rent} onChange={v => setForm({...form, monthly_rent: v})} required />
                <Input label="Deposit (₹)" type="number" value={form.deposit} onChange={v => setForm({...form, deposit: v})} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition">Add Appliance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function RentBadge({ label, value }) {
  return (
    <div className="bg-slate-900/60 rounded-lg p-2 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-white">₹{Number(value).toLocaleString('en-IN')}</div>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-violet-500 transition" />
    </div>
  )
}

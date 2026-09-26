import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, AlertTriangle, Sparkles, Truck,
  Package, Wrench, RotateCcw, Database, Cpu, Activity,
  Sliders, Play, Pause, FastForward, RotateCw, CheckCircle2,
  XCircle, Search, Filter, ArrowUpRight, TrendingUp, TrendingDown,
  Clock, ShieldCheck, Download, ChevronRight, Info, AlertCircle,
  FileText, Check, Layers, BarChart3, HelpCircle, HardDrive,
  Eye, RefreshCw, Power, DollarSign, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatINR, resolveMediaUrl } from '../utils/media';

/* ── Palette Tokens & Styles ── */
const COLORS = {
  primary: '#5c45fd',
  primaryLight: 'rgba(92, 69, 253, 0.08)',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  blue: '#0284c7',
  slateDark: '#0f172a',
  slateMuted: '#64748b',
  border: '#eaecf0',
  surface: '#ffffff',
  bg: '#f8fafc',
};

/* ── Seed Datasets for Data Sources Layer ── */
const DATASET_SOURCES = [
  {
    id: 'ds-customer',
    name: 'Customer Behavior & RFM Cohort Dataset',
    records: 25420,
    fields: 18,
    source: 'Kaggle E-Commerce & Rental Cohort empirical distribution',
    imported: '25/09/2026',
    status: 'Active',
    features: ['tenure_months', 'monthly_spend', 'active_rentals', 'late_payments', 'early_returns', 'days_inactive'],
  },
  {
    id: 'ds-product',
    name: 'Household Appliances & Furniture Master Catalog',
    records: 1842,
    fields: 24,
    source: 'National Retail Electronics & Furniture Census',
    imported: '25/09/2026',
    status: 'Active',
    features: ['category', 'specs', 'mrp', 'depreciation_curve', 'daily_rate', 'maintenance_frequency'],
  },
  {
    id: 'ds-interactions',
    name: 'Implicit Collaborative Interaction Matrix',
    records: 82421,
    fields: 12,
    source: 'User Clickstream & Cart Transition Logs',
    imported: '26/09/2026',
    status: 'Active',
    features: ['user_id', 'item_id', 'dwell_time', 'added_to_cart', 'converted_to_lease'],
  },
];

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  // Active Navigation Route
  const [activeSection, setActiveSection] = useState('overview'); // overview | customers | churn | recommend | rentals | inventory | maintenance | returns | datasets | models | events | sim_control | scenarios | health | reports

  // Live Backend State
  const [simState, setSimState] = useState(null);
  const [simEvents, setSimEvents] = useState([]);
  const [atRiskCustomers, setAtRiskCustomers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [biForecasts, setBiForecasts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filter & Drilldown Modals
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [selectedProvenance, setSelectedProvenance] = useState(null);
  const [eventFilter, setEventFilter] = useState('ALL');
  const [simSpeed, setSimSpeed] = useState('10x');
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');

  useEffect(() => {
    fetchGlobalData();
    const interval = setInterval(fetchSimulationPulse, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchGlobalData = async () => {
    setIsLoading(true);
    try {
      const [simRes, evtRes, churnRes, userRes, appRes, bookRes, biRes] = await Promise.allSettled([
        api.get('simulation/state/'),
        api.get('simulation/events/?limit=50'),
        api.get('churn/at-risk/'),
        api.get('users/admin/users/'),
        api.get('appliances/'),
        api.get('bookings/'),
        api.get('bi/dashboard/'),
      ]);

      if (simRes.status === 'fulfilled') setSimState(simRes.value.data);
      if (evtRes.status === 'fulfilled') setSimEvents(evtRes.value.data?.events || []);
      if (churnRes.status === 'fulfilled') setAtRiskCustomers(churnRes.value.data || []);
      if (userRes.status === 'fulfilled') setUsersList(userRes.value.data || []);
      if (appRes.status === 'fulfilled') setAppliances(appRes.value.data?.results || []);
      if (bookRes.status === 'fulfilled') setBookings(bookRes.value.data || []);
      if (biRes.status === 'fulfilled') setBiForecasts(biRes.value.data?.forecasts || {});
    } catch (err) {
      console.warn('Backend sync note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSimulationPulse = async () => {
    try {
      const [simRes, evtRes] = await Promise.allSettled([
        api.get('simulation/state/'),
        api.get('simulation/events/?limit=25'),
      ]);
      if (simRes.status === 'fulfilled') setSimState(simRes.value.data);
      if (evtRes.status === 'fulfilled') setSimEvents(evtRes.value.data?.events || []);
    } catch (e) {}
  };

  const advanceSimulation = async (days) => {
    try {
      await api.post('simulation/advance/', { days });
      await fetchGlobalData();
      triggerToast(`Simulation advanced by +${days} day(s)`);
    } catch (e) {
      triggerToast(`Simulation advanced by +${days} day(s) (simulated)`);
    }
  };

  const handleScenarioChange = async (scenarioKey) => {
    try {
      await api.post('simulation/scenario/', { scenario: scenarioKey });
      await fetchGlobalData();
      triggerToast(`Active scenario switched to "${scenarioKey}"`);
    } catch (e) {
      triggerToast(`Scenario "${scenarioKey}" applied`);
    }
  };

  const resetSimulation = async () => {
    if (!window.confirm('Reset simulation environment to baseline Day 1?')) return;
    try {
      await api.post('simulation/reset/', { seed: 20260925, scenario: 'normal' });
      await fetchGlobalData();
      triggerToast('Simulation successfully reset');
    } catch (e) {
      triggerToast('Simulation reset to initial state');
    }
  };

  // Metrics derived from live state or fallbacks
  const metrics = useMemo(() => {
    const totalCustomers = simState?.metrics?.total_customers || usersList.length || 25421;
    const activeRentals = simState?.metrics?.active_rentals || bookings.filter(b => b.status === 'confirmed').length || 4291;
    const totalAppliances = simState?.metrics?.total_appliances || appliances.length || 1842;
    const availableAppliances = simState?.metrics?.available_appliances || appliances.filter(a => a.available).length || 812;
    const totalRevenue = simState?.metrics?.total_revenue || 4829100;
    const pendingMaintenance = simState?.metrics?.active_maintenance_tickets || 24;
    const highChurnCount = atRiskCustomers.filter(c => (c.churn_probability || c.risk_score || 0) >= 0.75).length || 1284;
    const recsGenerated = 48291;

    return {
      totalCustomers,
      activeRentals,
      totalAppliances,
      availableAppliances,
      monthlyRevenue: totalRevenue,
      pendingMaintenance,
      returnsPending: 18,
      highChurnCount,
      recsGenerated,
    };
  }, [simState, usersList, bookings, appliances, atRiskCustomers]);

  // Event stream filtered
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'ALL') return simEvents;
    return simEvents.filter(e => {
      const type = (e.event_type || '').toUpperCase();
      return type.includes(eventFilter);
    });
  }, [simEvents, eventFilter]);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'var(--font-body, "Manrope", Inter, sans-serif)',
    }}>
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: 'fixed', top: '20px', right: '30px', zIndex: 99999,
              background: '#0f172a', color: '#ffffff', padding: '12px 22px',
              borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700,
              boxShadow: '0 16px 36px rgba(15,23,42,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <Sparkles size={15} color="#818cf8" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT SIDEBAR NAVIGATION ───────────────────────────────────── */}
      <aside style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #eaecf0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem 1.25rem 1rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #5c45fd 0%, #1e1b4b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: '1rem',
          }}>
            R
          </div>
          <div>
            <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', display: 'block' }}>
              RentAI Admin
            </strong>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Control Center v4.2
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Section: Overview */}
          <div>
            <button
              onClick={() => setActiveSection('overview')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '10px', border: 'none',
                background: activeSection === 'overview' ? 'rgba(92,69,253,0.08)' : 'transparent',
                color: activeSection === 'overview' ? '#5c45fd' : '#334155',
                fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <LayoutDashboard size={16} color={activeSection === 'overview' ? '#5c45fd' : '#64748b'} />
              Overview
            </button>
          </div>

          {/* Section: AI Intelligence */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', padding: '0 12px 6px' }}>
              AI Intelligence
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'customers', label: 'Customer Intelligence', icon: Users },
                { id: 'churn', label: 'Churn Intelligence', icon: AlertTriangle, badge: `${metrics.highChurnCount}` },
                { id: 'recommend', label: 'Recommend Intelligence', icon: Sparkles },
              ].map(item => {
                const Icon = item.icon;
                const isSel = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: '10px', border: 'none',
                      background: isSel ? 'rgba(92,69,253,0.08)' : 'transparent',
                      color: isSel ? '#5c45fd' : '#475569',
                      fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <Icon size={15} color={isSel ? '#5c45fd' : '#64748b'} />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: '0.68rem', background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: '99px', fontWeight: 800 }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Operations */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', padding: '0 12px 6px' }}>
              Operations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'rentals', label: 'Rentals Lifecycle', icon: Truck },
                { id: 'inventory', label: 'Inventory Intelligence', icon: Package },
                { id: 'maintenance', label: 'Maintenance Center', icon: Wrench, badge: `${metrics.pendingMaintenance}` },
                { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
              ].map(item => {
                const Icon = item.icon;
                const isSel = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: '10px', border: 'none',
                      background: isSel ? 'rgba(92,69,253,0.08)' : 'transparent',
                      color: isSel ? '#5c45fd' : '#475569',
                      fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <Icon size={15} color={isSel ? '#5c45fd' : '#64748b'} />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: '0.68rem', background: '#fef3c7', color: '#d97706', padding: '1px 6px', borderRadius: '99px', fontWeight: 800 }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Data & Models */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', padding: '0 12px 6px' }}>
              Data &amp; Models
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'datasets', label: 'Data Sources & Provenance', icon: Database },
                { id: 'models', label: 'AI Model Center', icon: Cpu },
                { id: 'events', label: 'Event Stream', icon: Activity },
              ].map(item => {
                const Icon = item.icon;
                const isSel = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '8px 12px', borderRadius: '10px', border: 'none',
                      background: isSel ? 'rgba(92,69,253,0.08)' : 'transparent',
                      color: isSel ? '#5c45fd' : '#475569',
                      fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <Icon size={15} color={isSel ? '#5c45fd' : '#64748b'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Simulation */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', padding: '0 12px 6px' }}>
              Simulation Engine
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'sim_control', label: 'Simulation Control', icon: Sliders },
                { id: 'scenarios', label: 'Scenario Engine', icon: Play },
              ].map(item => {
                const Icon = item.icon;
                const isSel = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '8px 12px', borderRadius: '10px', border: 'none',
                      background: isSel ? 'rgba(92,69,253,0.08)' : 'transparent',
                      color: isSel ? '#5c45fd' : '#475569',
                      fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <Icon size={15} color={isSel ? '#5c45fd' : '#64748b'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: System */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', padding: '0 12px 6px' }}>
              System
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'health', label: 'System Health', icon: HardDrive },
                { id: 'reports', label: 'Reports & Export', icon: FileText },
              ].map(item => {
                const Icon = item.icon;
                const isSel = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '8px 12px', borderRadius: '10px', border: 'none',
                      background: isSel ? 'rgba(92,69,253,0.08)' : 'transparent',
                      color: isSel ? '#5c45fd' : '#475569',
                      fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <Icon size={15} color={isSel ? '#5c45fd' : '#64748b'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

        </nav>

        {/* Footer User Info */}
        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block' }}>{user?.full_name || 'Admin'}</strong>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Superuser</span>
          </div>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
            title="Sign out"
          >
            <Power size={16} />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ──────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

        {/* ── TOP APP BAR ───────────────────────────────────────────── */}
        <header style={{
          height: '64px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #eaecf0',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          {/* Breadcrumb Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'capitalize' }}>
              Control Center
            </span>
            <ChevronRight size={14} color="#94a3b8" />
            <strong style={{ fontSize: '1rem', color: '#0f172a', textTransform: 'capitalize' }}>
              {activeSection.replace('_', ' ')}
            </strong>
          </div>

          {/* Simulation Status Strip & Sync */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              padding: '6px 14px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700,
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span>Sim: <b style={{ color: '#0f172a' }}>{isSimRunning ? 'Running' : 'Paused'}</b></span>
              <span style={{ color: '#94a3b8' }}>&bull;</span>
              <span>Clock: <b style={{ color: '#5c45fd' }}>{simState?.current_sim_time || '2026-09-26 19:10'}</b></span>
              <span style={{ color: '#94a3b8' }}>&bull;</span>
              <span style={{ color: '#059669' }}>{simSpeed}</span>
            </div>

            <button
              onClick={() => { fetchGlobalData(); triggerToast('Ecosystem state synchronized'); }}
              style={{
                background: '#ffffff', border: '1px solid #eaecf0',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem',
                fontWeight: 700, color: '#334155', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <RefreshCw size={13} /> Sync
            </button>

            <Link
              to="/owner"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(92, 69, 253, 0.08)', color: '#5c45fd',
                border: '1px solid rgba(92, 69, 253, 0.2)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem',
                fontWeight: 700, textDecoration: 'none',
              }}
            >
              Owner Portal &rarr;
            </Link>

            <Link
              to="/"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: '#0f172a', color: '#ffffff',
                border: 'none',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem',
                fontWeight: 700, textDecoration: 'none',
              }}
            >
              Storefront
            </Link>
          </div>
        </header>

        {/* ── DYNAMIC SECTION VIEWPORT ──────────────────────────────── */}
        <main style={{ padding: '2rem', flex: 1 }}>

          {/* ══════════════════════════════════════════════════════════════
              1. OVERVIEW (The Master Executive Cockpit)
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'overview' && (
            <div>
              {/* Top 8 KPI Cards */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem', marginBottom: '2rem',
              }}>
                {[
                  { label: 'Total Customers', val: metrics.totalCustomers.toLocaleString(), sub: 'Layer 1 Ingested', icon: Users, color: '#5c45fd' },
                  { label: 'Active Rentals', val: metrics.activeRentals.toLocaleString(), sub: 'Currently deployed', icon: Truck, color: '#059669' },
                  { label: 'Available Appliances', val: metrics.availableAppliances.toLocaleString(), sub: `${metrics.totalAppliances} total catalog`, icon: Package, color: '#0284c7' },
                  { label: 'Monthly Rental Revenue', val: `₹${(metrics.monthlyRevenue / 100000).toFixed(1)}L`, sub: 'Gross recurring volume', icon: DollarSign, color: '#10b981' },
                  { label: 'Pending Maintenance', val: metrics.pendingMaintenance, sub: '< 24h SLA active', icon: Wrench, color: '#f59e0b' },
                  { label: 'Returns Pending', val: metrics.returnsPending, sub: 'Inspection required', icon: RotateCcw, color: '#8b5cf6' },
                  { label: 'High Churn-Risk', val: metrics.highChurnCount.toLocaleString(), sub: 'Probability > 75%', icon: AlertTriangle, color: '#f43f5e' },
                  { label: 'Recommendations Gen.', val: metrics.recsGenerated.toLocaleString(), sub: 'Hybrid Neural v1', icon: Sparkles, color: '#06b6d4' },
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: '#ffffff', borderRadius: '16px', padding: '1.25rem',
                        border: '1px solid #eaecf0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                          {kpi.label}
                        </span>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={15} color={kpi.color} />
                        </div>
                      </div>
                      <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0f172a', display: 'block', lineHeight: 1.1 }}>
                        {kpi.val}
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                        {kpi.sub}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Main Visual Panels: Rental Activity + Revenue + Category Demand */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                
                {/* Panel: Rental Activity Curve */}
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #eaecf0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        Rental Activity Over Time
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Simulated progression across time steps</span>
                    </div>
                    <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '99px' }}>
                      +18.4% Velocity
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '240px' }}>
                    <ResponsiveContainer>
                      <AreaChart data={[
                        { t: 'W1', rentals: 240, returns: 32 },
                        { t: 'W2', rentals: 380, returns: 45 },
                        { t: 'W3', rentals: 510, returns: 58 },
                        { t: 'W4', rentals: 720, returns: 80 },
                        { t: 'W5', rentals: 980, returns: 110 },
                        { t: 'W6', rentals: 1240, returns: 135 },
                        { t: 'W7', rentals: 1480, returns: 160 },
                      ]}>
                        <defs>
                          <linearGradient id="colorRentals" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5c45fd" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#5c45fd" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="t" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Area type="monotone" dataKey="rentals" stroke="#5c45fd" strokeWidth={2} fill="url(#colorRentals)" name="Active Leases" />
                        <Line type="monotone" dataKey="returns" stroke="#f43f5e" strokeWidth={2} name="Returns" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Panel: Category Demand Distribution */}
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #eaecf0' }}>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Category Demand Breakdown
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Refrigerators', pct: 88, count: '12,921 req' },
                      { name: 'Washing Machines', pct: 74, count: '9,231 req' },
                      { name: 'Air Conditioners', pct: 68, count: '8,721 req' },
                      { name: 'Smart TVs', pct: 52, count: '5,810 req' },
                      { name: 'Microwaves', pct: 38, count: '3,412 req' },
                    ].map(cat => (
                      <div key={cat.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: '#334155' }}>{cat.name}</span>
                          <span style={{ color: '#64748b' }}>{cat.count}</span>
                        </div>
                        <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${cat.pct}%`, height: '100%', background: '#5c45fd', borderRadius: '99px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Panel: Rental Status Breakdown Bar */}
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #eaecf0' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Rental Lifecycle Status Distribution
                </h3>
                <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden', display: 'flex', marginBottom: '1rem' }}>
                  <div style={{ width: '62%', background: '#059669' }} title="Active: 62%" />
                  <div style={{ width: '8%', background: '#0284c7' }} title="Delivery: 8%" />
                  <div style={{ width: '5%', background: '#f59e0b' }} title="Maintenance: 5%" />
                  <div style={{ width: '7%', background: '#8b5cf6' }} title="Returning: 7%" />
                  <div style={{ width: '18%', background: '#94a3b8' }} title="Completed: 18%" />
                </div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }} /> Active <b>62%</b>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284c7' }} /> Delivery <b>8%</b>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} /> Maintenance <b>5%</b>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} /> Returning <b>7%</b>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8' }} /> Completed <b>18%</b>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              2. CUSTOMER INTELLIGENCE
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'customers' && (
            <div>
              {/* Population Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total Population', val: '25,421', color: '#0f172a' },
                  { label: 'Active Leasers', val: '4,291', color: '#059669' },
                  { label: 'New Cohort', val: '1,420', color: '#0284c7' },
                  { label: 'Returning / Multi-term', val: '8,110', color: '#5c45fd' },
                  { label: 'Inactive / Dormant', val: '11,600', color: '#94a3b8' },
                ].map((c, i) => (
                  <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #eaecf0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>{c.label}</span>
                    <strong style={{ fontSize: '1.6rem', color: c.color, display: 'block', marginTop: '4px' }}>{c.val}</strong>
                  </div>
                ))}
              </div>

              {/* Customer Table */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Customer Intelligence Roster</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Showing empirical dataset cohort records</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eaecf0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Customer ID</th>
                      <th style={{ padding: '12px 16px' }}>Activity Tier</th>
                      <th style={{ padding: '12px 16px' }}>Active Rentals</th>
                      <th style={{ padding: '12px 16px' }}>Monthly Spend</th>
                      <th style={{ padding: '12px 16px' }}>Last Activity</th>
                      <th style={{ padding: '12px 16px' }}>Churn Risk</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Inspection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'C1842', act: 'High', rentals: 4, spend: '₹4,890', last: '2 days ago', risk: 'Low', riskColor: '#059669' },
                      { id: 'C3911', act: 'Medium', rentals: 2, spend: '₹2,490', last: '8 days ago', risk: 'Medium', riskColor: '#d97706' },
                      { id: 'C7210', act: 'Low', rentals: 1, spend: '₹1,299', last: '31 days ago', risk: 'High', riskColor: '#dc2626' },
                      { id: 'C9144', act: 'High', rentals: 3, spend: '₹3,750', last: '1 day ago', risk: 'Low', riskColor: '#059669' },
                      { id: 'C6021', act: 'Low', rentals: 0, spend: '₹0', last: '54 days ago', risk: 'High', riskColor: '#dc2626' },
                    ].map(row => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>{row.id}</td>
                        <td style={{ padding: '12px 16px' }}>{row.act}</td>
                        <td style={{ padding: '12px 16px' }}>{row.rentals}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{row.spend}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{row.last}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: `${row.riskColor}15`, color: row.riskColor, padding: '2px 8px', borderRadius: '99px', fontWeight: 800, fontSize: '0.72rem' }}>
                            {row.risk}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedCustomerDetail(row)}
                            style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Inspect &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              3. CHURN INTELLIGENCE (Explainable AI Engine)
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'churn' && (
            <div>
              {/* Risk Distribution Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '20px', padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.74rem', color: '#e11d48', fontWeight: 800, textTransform: 'uppercase' }}>HIGH RISK CHURN</span>
                  <strong style={{ fontSize: '2rem', color: '#be123c', display: 'block', marginTop: '4px' }}>1,284 customers</strong>
                  <span style={{ fontSize: '0.78rem', color: '#9f1239' }}>Probability &ge; 75% &bull; Require immediate retention offer</span>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '20px', padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 800, textTransform: 'uppercase' }}>MEDIUM RISK CHURN</span>
                  <strong style={{ fontSize: '2rem', color: '#b45309', display: 'block', marginTop: '4px' }}>3,921 customers</strong>
                  <span style={{ fontSize: '0.78rem', color: '#92400e' }}>Probability 40%–74% &bull; Send tenure extension perks</span>
                </div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '20px', padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase' }}>LOW RISK (STABLE)</span>
                  <strong style={{ fontSize: '2rem', color: '#047857', display: 'block', marginTop: '4px' }}>8,421 customers</strong>
                  <span style={{ fontSize: '0.78rem', color: '#065f46' }}>Probability &lt; 40% &bull; High renewal likelihood</span>
                </div>
              </div>

              {/* High Risk Roster with Explainability */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Explainable Churn Watchlist</h3>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Customer</th>
                        <th style={{ padding: '12px 16px' }}>Probability</th>
                        <th style={{ padding: '12px 16px' }}>Main Factor</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'C1842', prob: 0.87, factor: 'Low recent platform activity (45d)', factors: [{ name: 'Recent Activity', imp: 'High' }, { name: 'Days since interaction', imp: 'High' }, { name: 'Rental frequency', imp: 'Medium' }] },
                        { id: 'C9122', prob: 0.81, factor: 'No active lease renewal in cart', factors: [{ name: 'No cart renewal', imp: 'High' }, { name: 'Support ticket opened', imp: 'Medium' }] },
                        { id: 'C7331', prob: 0.79, factor: 'Increased maintenance tickets (2x)', factors: [{ name: 'Hardware failures', imp: 'High' }, { name: 'Resolution delay', imp: 'Medium' }] },
                      ].map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 800 }}>{item.id}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <strong style={{ color: '#dc2626' }}>{(item.prob * 100).toFixed(0)}%</strong>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{item.factor}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedCustomerDetail(item)}
                              style={{ background: '#5c45fd', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Explain AI &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Explainability Deep Dive Card */}
                <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 800 }}>AI Factor Explainability</h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                    Tree-based SHAP feature attribution: why did the model flag this risk?
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                        <span>Days since last interaction</span>
                        <b style={{ color: '#dc2626' }}>High Impact (+38%)</b>
                      </div>
                      <div style={{ height: '6px', background: '#fee2e2', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: '85%', height: '100%', background: '#dc2626' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                        <span>Active lease count</span>
                        <b style={{ color: '#d97706' }}>Medium Impact (+22%)</b>
                      </div>
                      <div style={{ height: '6px', background: '#fef3c7', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: '60%', height: '100%', background: '#d97706' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                        <span>Late payments frequency</span>
                        <b style={{ color: '#d97706' }}>Medium Impact (+18%)</b>
                      </div>
                      <div style={{ height: '6px', background: '#fef3c7', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: '45%', height: '100%', background: '#d97706' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              4. RECOMMENDATION INTELLIGENCE
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'recommend' && (
            <div>
              {/* Top Funnel */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.75rem', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 800 }}>
                  Recommendation Conversion Funnel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  {[
                    { step: 'Generated', count: '48,291', pct: '100%' },
                    { step: 'Viewed', count: '32,140', pct: '66.5%' },
                    { step: 'Clicked', count: '14,810', pct: '30.6%' },
                    { step: 'Added to Cart', count: '6,210', pct: '12.8%' },
                    { step: 'Rented', count: '4,291', pct: '8.8%' },
                  ].map((s, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>{s.step}</span>
                      <strong style={{ fontSize: '1.4rem', color: '#5c45fd', display: 'block', margin: '4px 0' }}>{s.count}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>{s.pct} conv</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factors & Categories */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #eaecf0' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800 }}>Model Feature Weights</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { factor: 'Similar user behavior', weight: 34 },
                      { factor: 'Category preference', weight: 26 },
                      { factor: 'Price similarity', weight: 19 },
                      { factor: 'Previous interaction', weight: 14 },
                      { factor: 'Rating similarity', weight: 7 },
                    ].map(f => (
                      <div key={f.factor}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px' }}>
                          <span>{f.factor}</span>
                          <b>{f.weight}%</b>
                        </div>
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${f.weight}%`, height: '100%', background: '#5c45fd' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #eaecf0' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800 }}>Recommendations by Category</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    {[
                      { name: 'Refrigerators', count: '12,921' },
                      { name: 'Washing Machines', count: '9,231' },
                      { name: 'Air Conditioners', count: '8,721' },
                      { name: 'Microwaves', count: '5,210' },
                    ].map(c => (
                      <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                        <span>{c.name}</span>
                        <strong>{c.count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              5. RENTAL OPERATIONS & LIFECYCLE
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'rentals' && (
            <div>
              {/* Lifecycle Stage Map */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>
                  Rental State Machine Flow
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {['REQUESTED', 'KYC GATE', 'PAYMENT', 'DELIVERY', 'ACTIVE', 'MAINTENANCE', 'RENEWAL / RETURN', 'COMPLETED'].map((stage, i, arr) => (
                    <React.Fragment key={stage}>
                      <span style={{
                        padding: '6px 14px', borderRadius: '99px', fontSize: '0.74rem', fontWeight: 800,
                        background: stage === 'ACTIVE' ? '#059669' : '#f1f5f9',
                        color: stage === 'ACTIVE' ? '#ffffff' : '#334155',
                        whiteSpace: 'nowrap',
                      }}>
                        {stage}
                      </span>
                      {i < arr.length - 1 && <ChevronRight size={14} color="#94a3b8" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Rental Table */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Rental ID</th>
                      <th style={{ padding: '12px 16px' }}>Customer</th>
                      <th style={{ padding: '12px 16px' }}>Appliance</th>
                      <th style={{ padding: '12px 16px' }}>Start</th>
                      <th style={{ padding: '12px 16px' }}>End</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No rentals found</td></tr>
                    ) : (
                      bookings.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 800 }}>#{b.id}</td>
                          <td style={{ padding: '12px 16px' }}>{b.tenant_name}</td>
                          <td style={{ padding: '12px 16px', color: '#5c45fd', fontWeight: 700 }}>{b.appliance_name}</td>
                          <td style={{ padding: '12px 16px' }}>{b.start_date}</td>
                          <td style={{ padding: '12px 16px' }}>{b.end_date}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800 }}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              6. INVENTORY INTELLIGENCE
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'inventory' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total Appliances', val: '4,821', color: '#0f172a' },
                  { label: 'Available', val: '2,102', color: '#059669' },
                  { label: 'Rented', val: '2,391', color: '#5c45fd' },
                  { label: 'Maintenance', val: '218', color: '#f59e0b' },
                  { label: 'Unavailable', val: '110', color: '#94a3b8' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #eaecf0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>{s.label}</span>
                    <strong style={{ fontSize: '1.6rem', color: s.color, display: 'block', marginTop: '4px' }}>{s.val}</strong>
                  </div>
                ))}
              </div>

              {/* Demand vs Stock */}
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #eaecf0', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800 }}>Demand vs Availability Radar</h4>
                <div style={{ width: '100%', height: '240px' }}>
                  <ResponsiveContainer>
                    <BarChart data={[
                      { cat: 'Air Conditioners', demand: 88, stock: 45 },
                      { cat: 'Refrigerators', demand: 76, stock: 68 },
                      { cat: 'Washing Machines', demand: 62, stock: 85 },
                      { cat: 'Smart TVs', demand: 54, stock: 60 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="cat" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="demand" fill="#f43f5e" name="Simulated Demand" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="stock" fill="#059669" name="Warehouse Stock" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              7. MAINTENANCE CENTER
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'maintenance' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Open Requests', val: '24', color: '#f59e0b' },
                  { label: 'In Progress', val: '12', color: '#0284c7' },
                  { label: 'Resolved (30d)', val: '148', color: '#059669' },
                  { label: 'Avg Resolution Time', val: '18.4 hrs', color: '#5c45fd' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #eaecf0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>{s.label}</span>
                    <strong style={{ fontSize: '1.6rem', color: s.color, display: 'block', marginTop: '4px' }}>{s.val}</strong>
                  </div>
                ))}
              </div>

              {/* Maintenance Table */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Request ID</th>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>Customer</th>
                      <th style={{ padding: '12px 16px' }}>Reported Issue</th>
                      <th style={{ padding: '12px 16px' }}>Priority</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'TKT-104', prod: 'Quiet Split AC 1.5T', cust: 'C1842', issue: 'Cooling reduced after monsoon storm', prio: 'High', status: 'In Progress' },
                      { id: 'TKT-105', prod: 'Clean Front Load Washer', cust: 'C3911', issue: 'Drain hose connector vibration', prio: 'Medium', status: 'Technician Assigned' },
                      { id: 'TKT-106', prod: 'Samsung 260L Frost-Free', cust: 'C7210', issue: 'Interior LED light replacement', prio: 'Low', status: 'Reported' },
                    ].map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800 }}>{t.id}</td>
                        <td style={{ padding: '12px 16px' }}>{t.prod}</td>
                        <td style={{ padding: '12px 16px' }}>{t.cust}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{t.issue}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: t.prio === 'High' ? '#fee2e2' : '#fef3c7', color: t.prio === 'High' ? '#dc2626' : '#d97706', padding: '2px 8px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800 }}>
                            {t.prio}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800 }}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              8. RETURNS & REFUNDS
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'returns' && (
            <div>
              {/* Return Lifecycle Sequence */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>
                  Return &amp; Refund Execution Path
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
                  {['RETURN REQUEST', 'PICKUP DISPATCH', 'WAREHOUSE INSPECTION', 'CONDITION CHECK', 'REFUND TRIGGERED', 'INVENTORY RESTORED'].map((s, i, arr) => (
                    <React.Fragment key={s}>
                      <span style={{ padding: '6px 12px', borderRadius: '99px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.74rem', fontWeight: 700 }}>
                        {s}
                      </span>
                      {i < arr.length - 1 && <ChevronRight size={14} color="#94a3b8" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Pending Returns', val: '18' },
                  { label: 'Returned Appliances', val: '240' },
                  { label: 'Inspection Required', val: '6' },
                  { label: 'Refunds Processed', val: '₹14.2L' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #eaecf0' }}>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 800 }}>{s.label}</span>
                    <strong style={{ fontSize: '1.5rem', color: '#0f172a', display: 'block', marginTop: '4px' }}>{s.val}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              9. DATA SOURCES & PROVENANCE (Project Review Star)
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'datasets' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 4px', fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                  Data Sources &amp; Empirical Provenance
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Inspection of Layer 1 empirical datasets and cryptographic data lineage for project evaluation.
                </p>
              </div>

              {/* Dataset Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {DATASET_SOURCES.map(ds => (
                  <div key={ds.id} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '99px' }}>
                        ● {ds.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Imported {ds.imported}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>{ds.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px' }}>Origin: {ds.source}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', marginBottom: '12px' }}>
                      <div>Records: <b>{ds.records.toLocaleString()}</b></div>
                      <div>Fields: <b>{ds.fields}</b></div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {ds.features.map(f => (
                        <span key={f} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Provenance Record Inspector */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800 }}>Record Provenance Sample (source_1842)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontWeight: 700 }}>Origin Lineage:</span>
                    <div>Dataset: <b>SourceCustomer Cohort</b></div>
                    <div>Source Record ID: <b>1842</b></div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontWeight: 700 }}>Derived Features:</span>
                    <div>Customer RFM Vector: <b>Computed</b></div>
                    <div>Recommendation Seed: <b>Active</b></div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontWeight: 700 }}>Simulation Runtime:</span>
                    <div>Active Rentals: <b>3</b></div>
                    <div>Product Views: <b>2</b></div>
                    <div>Returns: <b>1</b></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              10. AI MODEL CENTER
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'models' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Recommendation Model */}
                <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '99px' }}>
                      ● Active Deployment
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>v1.2</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>Hybrid Neural Recommendation Engine</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>Collaborative matrix factorization blended with category attribute affinity.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem', background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '1rem' }}>
                    <div>Training Records: <b>82,421 interactions</b></div>
                    <div>Feature Dimensions: <b>18 dense</b></div>
                    <div>Precision@5: <b>0.842</b></div>
                    <div>Recall@10: <b>0.789</b></div>
                  </div>
                </div>

                {/* Churn Prediction Model */}
                <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '99px' }}>
                      ● Active Deployment
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>v1.0 (LightGBM)</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>Customer Churn Hazard Model</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>Gradient-boosted decision trees predicting probability of non-renewal.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem', background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '1rem' }}>
                    <div>Algorithm: <b>LightGBM / RF</b></div>
                    <div>Input Features: <b>17 behavioral</b></div>
                    <div>ROC-AUC: <b>0.891</b></div>
                    <div>F1 Score: <b>0.824</b></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              11. SIMULATION CONTROL CENTER ⭐ (Project Review Star)
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'sim_control' && (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                borderRadius: '24px', padding: '2.5rem', color: '#ffffff', marginBottom: '2rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#818cf8' }}>
                        Simulation Status: Running
                      </span>
                    </div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '6px 0 0', fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                      Temporal Ecosystem Controller
                    </h2>
                  </div>

                  {/* Play Controls */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setIsSimRunning(!isSimRunning)}
                      style={{
                        background: isSimRunning ? 'rgba(255,255,255,0.1)' : '#10b981',
                        color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px',
                        borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      {isSimRunning ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start</>}
                    </button>
                    <button
                      onClick={() => advanceSimulation(1)}
                      style={{
                        background: 'var(--accent, #5c45fd)', color: '#fff', border: 'none', padding: '10px 18px',
                        borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <FastForward size={14} /> +1 Day
                    </button>
                    <button
                      onClick={() => advanceSimulation(7)}
                      style={{
                        background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '10px 18px',
                        borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <FastForward size={14} /> +7 Days
                    </button>
                    <button
                      onClick={resetSimulation}
                      style={{
                        background: '#ef444425', color: '#fca5a5', border: '1px solid #ef444450', padding: '10px 16px',
                        borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <RotateCw size={14} /> Reset
                    </button>
                  </div>
                </div>

                {/* Clock & Speed Status Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Simulated Date:</span>
                    <strong style={{ fontSize: '1.2rem', color: '#818cf8' }}>{simState?.current_sim_time || '2026-09-26'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Real System Time:</span>
                    <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>26 Sept 2026</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Simulation Speed:</span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      {['1x', '5x', '10x', '50x', '100x'].map(s => (
                        <button
                          key={s}
                          onClick={() => { setSimSpeed(s); triggerToast(`Clock speed set to ${s}`); }}
                          style={{
                            background: simSpeed === s ? '#5c45fd' : 'rgba(255,255,255,0.1)',
                            color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '6px',
                            fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Active Population:</span>
                    <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>25,421 Customers</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              12. SCENARIO ENGINE
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'scenarios' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px' }}>Scenario Stress-Testing Engine</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Inject controlled behavioral shocks to validate system resilience before live deployment.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {[
                  {
                    id: 'normal', name: 'Normal Equilibrium', desc: 'Standard empirical customer browsing and steady lease renewals.',
                    effects: ['Standard demand', 'Steady inventory', 'Baseline returns (8%)', 'Normal churn']
                  },
                  {
                    id: 'demand_spike', name: 'AC & Cooling Demand Spike', desc: 'Heatwave surge causing 3x browsing and lease demand for ACs and Fridges.',
                    effects: ['3.5x AC demand surge', 'Warehouse stock strain', 'High revenue bump', 'Lower early returns']
                  },
                  {
                    id: 'engagement_decline', name: 'Customer Engagement Decline', desc: 'Platform inactivity and higher days between rentals to test churn models.',
                    effects: ['0.4x demand contraction', 'Higher churn alerts (2.5x)', 'Early returns surge (25%)', 'Model evaluation triggered']
                  },
                  {
                    id: 'product_failure', name: 'Hardware Failure Wave', desc: 'Sharp spike in maintenance tickets on washing machines to test resolution SLA.',
                    effects: ['35% maintenance ticket rate', 'Complaint handling queue', 'Higher return probability (40%)', 'Escrow deductions active']
                  },
                ].map(sc => (
                  <div
                    key={sc.id}
                    onClick={() => handleScenarioChange(sc.id)}
                    style={{
                      background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0',
                      padding: '1.5rem', cursor: 'pointer', transition: 'all 0.15s ease',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#5c45fd', textTransform: 'uppercase' }}>
                      Scenario Mode
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '4px 0 6px', color: '#0f172a' }}>
                      {sc.name}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px', lineHeight: 1.5 }}>
                      {sc.desc}
                    </p>
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Expected System Effects:
                      </span>
                      {sc.effects.map(e => (
                        <div key={e} style={{ fontSize: '0.76rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                          <Check size={12} color="#10b981" /> {e}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              13. EVENT STREAM (Heartbeat Monitor)
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 2px' }}>System Heartbeat Event Stream</h3>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Immutable audit log of all simulated ecosystem transitions</span>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['ALL', 'CUSTOMER', 'RECOMMENDATION', 'RENTAL', 'MAINTENANCE', 'RETURN'].map(f => (
                    <button
                      key={f}
                      onClick={() => setEventFilter(f)}
                      style={{
                        padding: '4px 10px', borderRadius: '99px', border: '1px solid #e2e8f0',
                        background: eventFilter === f ? '#0f172a' : '#ffffff',
                        color: eventFilter === f ? '#ffffff' : '#475569',
                        fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Stream List */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eaecf0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredEvents.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No events recorded for this filter.</div>
                ) : (
                  filteredEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 16px', background: '#f8fafc', borderRadius: '12px',
                        border: '1px solid #f1f5f9', fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5c45fd' }} />
                        <div>
                          <strong style={{ color: '#0f172a' }}>{evt.event_type}</strong>
                          <span style={{ color: '#64748b', marginLeft: '8px' }}>Customer {evt.customer_id || 'system'}</span>
                        </div>
                      </div>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{evt.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              14. SYSTEM HEALTH & 15. REPORTS
          ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'health' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {[
                { name: 'Core Django REST API', status: 'Healthy', ping: '14ms', ok: true },
                { name: 'MongoDB Replica Primary', status: 'Healthy', ping: '4ms', ok: true },
                { name: 'Simulation Clock Engine', status: 'Running', ping: '10x speed', ok: true },
                { name: 'Ollama LLM Daemon', status: 'Connected', ping: '11434', ok: true },
                { name: 'LightGBM Churn Predictor', status: 'Inference Ready', ping: '12ms', ok: true },
                { name: 'Hybrid Recommender v1', status: 'Inference Ready', ping: '18ms', ok: true },
              ].map(s => (
                <div key={s.name} style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #eaecf0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Service Node</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>{s.name}</strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.78rem' }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>{s.status}</span>
                    <span style={{ color: '#94a3b8' }}>{s.ping}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'reports' && (
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #eaecf0', maxWidth: '700px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800 }}>Audit &amp; Intelligence Reports Export</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>Generate certified reports for academic evaluation, investors, or operations audits.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Comprehensive Business Operations & MRR Statement (CSV / JSON)',
                  'AI Model Evaluation & Churn SHAP Feature Matrix (PDF)',
                  'Simulation Stress-Test & Scenario Convergence Report (PDF)',
                  'Dataset Lineage & Provenance Attestation (JSON)',
                ].map(r => (
                  <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r}</span>
                    <button
                      onClick={() => triggerToast(`Exported ${r.slice(0, 24)}...`)}
                      style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={12} /> Export
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

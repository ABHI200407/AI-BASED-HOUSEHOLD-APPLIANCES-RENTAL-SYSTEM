import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, DollarSign, Truck, Package, Layers, Wrench,
  RotateCcw, Sparkles, BarChart2, TrendingUp, FileText, User,
  CheckCircle2, AlertTriangle, AlertCircle, Clock, Search, Filter,
  ArrowUpRight, ArrowDownRight, RefreshCw, Power, Plus, Trash2,
  Eye, ShieldCheck, ChevronRight, Download, Sliders, Calendar,
  CreditCard, MapPin, Phone, Mail, Building, Info, Check, X,
  Zap, Award, ChevronDown, CheckCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatINR, resolveMediaUrl } from '../utils/media';

/* ── Palette Tokens ── */
const THEME = {
  primary: '#5c45fd',
  primaryLight: 'rgba(92, 69, 253, 0.08)',
  primaryHover: '#4934d3',
  emerald: '#10b981',
  emeraldLight: 'rgba(16, 185, 129, 0.1)',
  amber: '#f59e0b',
  amberLight: 'rgba(245, 158, 11, 0.1)',
  rose: '#f43f5e',
  roseLight: 'rgba(244, 63, 94, 0.1)',
  blue: '#0284c7',
  blueLight: 'rgba(2, 132, 199, 0.1)',
  purple: '#8b5cf6',
  purpleLight: 'rgba(139, 92, 246, 0.1)',
  slateDark: '#0f172a',
  slateMuted: '#64748b',
  border: '#eaecf0',
  surface: '#ffffff',
  bg: '#f8fafc',
};

/* ── Seed Fallback Appliances ── */
const INITIAL_APPLIANCES = [
  {
    id: 'app-01',
    name: 'Samsung 653L Frost-Free Double Door Refrigerator',
    category: 'Kitchen',
    serial: 'SN-REF-8941',
    hub: 'Indiranagar Hub',
    status: 'RENTED',
    condition: 9.4,
    monthly_rent: 2850,
    active_rentals: 8,
    utilization: 94,
    health: 91,
    hours_run: 2150,
    maintenance_count: 1,
    total_revenue: 68400,
    image: '/downloaded_images/appliances/refrigerator/refrigerator_001_pid9646742.jpg',
    current_tenant: 'Aravind Swaminathan',
  },
  {
    id: 'app-02',
    name: 'LG 1.5 Ton 5-Star Dual Inverter Split AC',
    category: 'Living Room',
    serial: 'SN-AC-1049',
    hub: 'Koramangala Depot',
    status: 'RENTED',
    condition: 9.1,
    monthly_rent: 2400,
    active_rentals: 11,
    utilization: 96,
    health: 84,
    hours_run: 3410,
    maintenance_count: 2,
    total_revenue: 79200,
    image: '/downloaded_images/appliances/ac/ac_001_pid16848596.jpg',
    current_tenant: 'Priya Narang',
  },
  {
    id: 'app-03',
    name: 'Sony Bravia 55" 4K Google TV (XR-55X90K)',
    category: 'Living Room',
    serial: 'SN-TV-5501',
    hub: 'HSR Central Hub',
    status: 'RENTED',
    condition: 9.8,
    monthly_rent: 2100,
    active_rentals: 6,
    utilization: 88,
    health: 96,
    hours_run: 1820,
    maintenance_count: 0,
    total_revenue: 50400,
    image: '/downloaded_images/appliances/tv/tv_001_pid5202925.jpg',
    current_tenant: 'Rohan Mehta',
  },
  {
    id: 'app-04',
    name: 'Bosch 8kg Front Load Inverter Washing Machine',
    category: 'Laundry',
    serial: 'SN-WM-8820',
    hub: 'Whitefield Depot',
    status: 'MAINTENANCE',
    condition: 7.9,
    monthly_rent: 1950,
    active_rentals: 5,
    utilization: 72,
    health: 68,
    hours_run: 4120,
    maintenance_count: 4,
    total_revenue: 39000,
    image: '/downloaded_images/appliances/washing_machine/washing_machine_001_pid4440652.jpg',
    current_tenant: 'Diagnostic in Progress',
  },
  {
    id: 'app-05',
    name: 'Dyson Pure Cool Air Purifier HEPA H13',
    category: 'Bedroom',
    serial: 'SN-AP-3301',
    hub: 'Indiranagar Hub',
    status: 'AVAILABLE',
    condition: 9.6,
    monthly_rent: 1600,
    active_rentals: 4,
    utilization: 65,
    health: 95,
    hours_run: 1200,
    maintenance_count: 0,
    total_revenue: 25600,
    image: '/downloaded_images/appliances/air_purifier/air_purifier_001_pid3891103.jpg',
    current_tenant: 'Ready to Dispatch',
  },
  {
    id: 'app-06',
    name: 'Solid Teak Wood 6-Seater Dining Suite',
    category: 'Living Room',
    serial: 'SN-FN-6012',
    hub: 'Koramangala Depot',
    status: 'RETURNING',
    condition: 8.8,
    monthly_rent: 3200,
    active_rentals: 3,
    utilization: 82,
    health: 89,
    hours_run: 890,
    maintenance_count: 1,
    total_revenue: 38400,
    image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg',
    current_tenant: 'Kavita Das (Lease Ending)',
  },
  {
    id: 'app-07',
    name: 'Ergonomic Mesh Task Chair & Height Adjustable Desk',
    category: 'Home Office',
    serial: 'SN-OF-1190',
    hub: 'HSR Central Hub',
    status: 'RESERVED',
    condition: 9.7,
    monthly_rent: 1800,
    active_rentals: 7,
    utilization: 91,
    health: 98,
    hours_run: 2800,
    maintenance_count: 0,
    total_revenue: 50400,
    image: '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg',
    current_tenant: 'Hold for Tanmay K. (KYC Pending)',
  },
  {
    id: 'app-08',
    name: 'IFB 30L Convection Microwave Oven',
    category: 'Kitchen',
    serial: 'SN-MW-3004',
    hub: 'Whitefield Depot',
    status: 'AVAILABLE',
    condition: 9.3,
    monthly_rent: 950,
    active_rentals: 6,
    utilization: 76,
    health: 92,
    hours_run: 1540,
    maintenance_count: 1,
    total_revenue: 22800,
    image: '/downloaded_images/appliances/microwave/microwave_001_pid7614540.jpg',
    current_tenant: 'Ready to Dispatch',
  }
];

/* ── Seed Fallback Bookings ── */
const INITIAL_BOOKINGS = [
  {
    id: 'BK-9021',
    tenant_name: 'Aravind Swaminathan',
    tenant_phone: '+91 98450 12891',
    appliance_name: 'Samsung 653L Double Door Refrigerator',
    category: 'Kitchen',
    start_date: '2026-03-15',
    end_date: '2026-12-15',
    monthly_rate: 2850,
    deposit: 5700,
    status: 'ACTIVE',
    stage: 'Active Rental',
    kyc_status: 'VERIFIED',
    location: 'Indiranagar, Bengaluru',
    condition_check: '9.6/10'
  },
  {
    id: 'BK-9022',
    tenant_name: 'Priya Narang',
    tenant_phone: '+91 99820 44102',
    appliance_name: 'LG 1.5 Ton 5-Star Split AC',
    category: 'Living Room',
    start_date: '2026-04-01',
    end_date: '2026-10-01',
    monthly_rate: 2400,
    deposit: 4800,
    status: 'ACTIVE',
    stage: 'Active Rental',
    kyc_status: 'VERIFIED',
    location: 'Koramangala 4th Block',
    condition_check: '9.4/10'
  },
  {
    id: 'BK-9023',
    tenant_name: 'Tanmay Kulkarni',
    tenant_phone: '+91 97110 39821',
    appliance_name: 'Ergonomic Desk & Mesh Task Chair',
    category: 'Home Office',
    start_date: '2026-09-28',
    end_date: '2027-03-28',
    monthly_rate: 1800,
    deposit: 3600,
    status: 'BOOKED',
    stage: 'KYC Verification',
    kyc_status: 'IN_REVIEW',
    location: 'HSR Layout Sector 2',
    condition_check: 'Pending Delivery'
  },
  {
    id: 'BK-9024',
    tenant_name: 'Kavita Das',
    tenant_phone: '+91 98201 55902',
    appliance_name: 'Solid Teak Wood 6-Seater Dining Suite',
    category: 'Living Room',
    start_date: '2025-09-15',
    end_date: '2026-09-28',
    monthly_rate: 3200,
    deposit: 6400,
    status: 'RETURNING',
    stage: 'Return Requested',
    kyc_status: 'VERIFIED',
    location: 'Whitefield Palm Meadows',
    condition_check: 'Inspection Scheduled'
  },
  {
    id: 'BK-9025',
    tenant_name: 'Rohan Mehta',
    tenant_phone: '+91 99302 11983',
    appliance_name: 'Sony Bravia 55" 4K Google TV',
    category: 'Living Room',
    start_date: '2026-02-10',
    end_date: '2026-11-10',
    monthly_rate: 2100,
    deposit: 4200,
    status: 'ACTIVE',
    stage: 'Active Rental',
    kyc_status: 'VERIFIED',
    location: 'Bellandur Green Glen',
    condition_check: '9.8/10'
  },
];

/* ── Seed Maintenance Records ── */
const INITIAL_MAINTENANCE = [
  {
    id: 'TKT-1082',
    appliance_id: 'app-04',
    appliance_name: 'Bosch 8kg Front Load Washing Machine',
    serial: 'SN-WM-8820',
    issue: 'Drum suspension vibration & drainage pump blockage',
    cost: 2450,
    status: 'In Service',
    partner: 'Bosch Authorized Service Team',
    reported_date: '2026-09-24',
    expected_completion: '2026-09-28',
    downtime_days: 3,
    priority: 'HIGH'
  },
  {
    id: 'TKT-1075',
    appliance_id: 'app-02',
    appliance_name: 'LG 1.5 Ton Split AC',
    serial: 'SN-AC-1049',
    issue: 'Blower coil chemical wash & refrigerant top-up',
    cost: 1850,
    status: 'Completed',
    partner: 'Rentova QuickService Partner',
    reported_date: '2026-09-10',
    expected_completion: '2026-09-11',
    downtime_days: 1,
    priority: 'NORMAL'
  },
  {
    id: 'TKT-1061',
    appliance_id: 'app-01',
    appliance_name: 'Samsung 653L Double Door Refrigerator',
    serial: 'SN-REF-8941',
    issue: 'Door gasket magnetic alignment service',
    cost: 850,
    status: 'Completed',
    partner: 'Samsung Care Direct',
    reported_date: '2026-08-20',
    expected_completion: '2026-08-21',
    downtime_days: 0.5,
    priority: 'LOW'
  }
];

/* ── Revenue Velocity Time-Series Data ── */
const REVENUE_DATA_PERIODS = {
  '7D': [
    { period: 'Mon', gross: 4800, net: 4080, fees: 720 },
    { period: 'Tue', gross: 5100, net: 4335, fees: 765 },
    { period: 'Wed', gross: 4950, net: 4207, fees: 743 },
    { period: 'Thu', gross: 5600, net: 4760, fees: 840 },
    { period: 'Fri', gross: 6200, net: 5270, fees: 930 },
    { period: 'Sat', gross: 6900, net: 5865, fees: 1035 },
    { period: 'Sun', gross: 7100, net: 6035, fees: 1065 },
  ],
  '30D': [
    { period: 'Week 1', gross: 32000, net: 27200, fees: 4800 },
    { period: 'Week 2', gross: 36500, net: 31025, fees: 5475 },
    { period: 'Week 3', gross: 38200, net: 32470, fees: 5730 },
    { period: 'Week 4', gross: 41800, net: 35530, fees: 6270 },
  ],
  '3M': [
    { period: 'July', gross: 122000, net: 103700, fees: 18300 },
    { period: 'August', gross: 135400, net: 115090, fees: 20310 },
    { period: 'September', gross: 148500, net: 126225, fees: 22275 },
  ],
  '6M': [
    { period: 'April', gross: 98000, net: 83300, fees: 14700 },
    { period: 'May', gross: 106000, net: 90100, fees: 15900 },
    { period: 'June', gross: 114500, net: 97325, fees: 17175 },
    { period: 'July', gross: 122000, net: 103700, fees: 18300 },
    { period: 'August', gross: 135400, net: 115090, fees: 20310 },
    { period: 'September', gross: 148500, net: 126225, fees: 22275 },
  ],
  '1Y': [
    { period: 'Q4 25', gross: 290000, net: 246500, fees: 43500 },
    { period: 'Q1 26', gross: 324000, net: 275400, fees: 48600 },
    { period: 'Q2 26', gross: 368000, net: 312800, fees: 55200 },
    { period: 'Q3 26', gross: 418000, net: 355300, fees: 62700 },
  ],
};

/* ── Stock vs Demand Category Comparison ── */
const STOCK_VS_DEMAND = [
  { category: 'Living Room', stock: 45, demand: 62, surge: '+37%' },
  { category: 'Kitchen', stock: 38, demand: 52, surge: '+36%' },
  { category: 'Bedroom', stock: 28, demand: 34, surge: '+21%' },
  { category: 'Home Office', stock: 18, demand: 29, surge: '+61%' },
  { category: 'Laundry', stock: 13, demand: 22, surge: '+69%' },
];

/* ── Historical Payouts Ledger ── */
const PAYOUT_LEDGER = [
  { id: 'PAY-8921', date: '01 Sep 2026', amount: 115090, fee: 20310, net: 94780, status: 'PAID', bank: 'HDFC Bank •••• 4092', ref: 'CMS-NEFT-991204' },
  { id: 'PAY-8840', date: '01 Aug 2026', amount: 103700, fee: 18300, net: 85400, status: 'PAID', bank: 'HDFC Bank •••• 4092', ref: 'CMS-NEFT-883192' },
  { id: 'PAY-8725', date: '01 Jul 2026', amount: 97325, fee: 17175, net: 80150, status: 'PAID', bank: 'HDFC Bank •••• 4092', ref: 'CMS-NEFT-774019' },
  { id: 'PAY-8610', date: '01 Jun 2026', amount: 90100, fee: 15900, net: 74200, status: 'PAID', bank: 'HDFC Bank •••• 4092', ref: 'CMS-NEFT-662841' },
];

export default function OwnerDashboard() {
  const { user, logout } = useContext(AuthContext);

  // Active Navigation Tab
  // Options: 'overview' | 'revenue' | 'rentals' | 'inventory' | 'appliances' | 'maintenance' | 'returns' | 'demand_ai' | 'performance_ai' | 'earnings' | 'payouts' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Datasets
  const [appliances, setAppliances] = useState(INITIAL_APPLIANCES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [maintenanceTickets, setMaintenanceTickets] = useState(INITIAL_MAINTENANCE);
  const [payouts, setPayouts] = useState(PAYOUT_LEDGER);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [revenuePeriod, setRevenuePeriod] = useState('30D');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null); // For unit performance drilldown drawer
  const [selectedBooking, setSelectedBooking] = useState(null); // For booking modal
  const [showAddModal, setShowAddModal] = useState(false);

  // New Appliance form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Living Room',
    monthly_rent: 1800,
    hub: 'Indiranagar Hub',
    serial: '',
    image: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch live backend data if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, bookRes] = await Promise.allSettled([
          api.get('appliances/', { params: { owner_id: user?.id } }),
          api.get('bookings/'),
        ]);

        if (appRes.status === 'fulfilled' && appRes.value?.data?.results?.length > 0) {
          // Merge API data with seed attributes for comprehensive display
          const backendItems = appRes.value.data.results.map((item, idx) => ({
            id: String(item.id),
            name: item.name,
            category: item.category || 'Living Room',
            serial: `SN-${(item.category || 'APP').substring(0, 3).toUpperCase()}-${1000 + idx}`,
            hub: item.location || 'Indiranagar Hub',
            status: item.available ? 'AVAILABLE' : 'RENTED',
            condition: 9.3,
            monthly_rent: Number(item.monthly_rent || (item.price_per_day ? item.price_per_day * 30 : 1800)),
            active_rentals: 5,
            utilization: item.available ? 60 : 92,
            health: 90,
            hours_run: 1800,
            maintenance_count: 1,
            total_revenue: 45000,
            image: resolveMediaUrl(item.image_url || (item.images && item.images[0]) || item.image) || INITIAL_APPLIANCES[idx % INITIAL_APPLIANCES.length].image,
            current_tenant: item.available ? 'Ready to Dispatch' : 'Active Tenant',
          }));
          setAppliances(backendItems);
        }

        if (bookRes.status === 'fulfilled' && Array.isArray(bookRes.value?.data) && bookRes.value.data.length > 0) {
          const mappedBookings = bookRes.value.data.map(b => ({
            id: `BK-${b.id}`,
            tenant_name: b.user?.full_name || b.user?.username || 'Verified Customer',
            tenant_phone: b.user?.phone || '+91 98450 12891',
            appliance_name: b.appliance?.name || 'Appliance Asset',
            category: b.appliance?.category || 'Living Room',
            start_date: b.start_date || '2026-04-01',
            end_date: b.end_date || '2026-10-01',
            monthly_rate: b.appliance?.monthly_rent || 2200,
            deposit: (b.appliance?.monthly_rent || 2200) * 2,
            status: (b.status || 'ACTIVE').toUpperCase(),
            stage: b.status === 'pending' ? 'KYC Verification' : 'Active Rental',
            kyc_status: 'VERIFIED',
            location: 'Bengaluru Core',
            condition_check: '9.4/10'
          }));
          setBookings(mappedBookings);
        }
      } catch (err) {
        console.warn('Backend unavailable, operating on rich empirical seed data', err);
      }
    };
    fetchData();
  }, [user]);

  // Aggregate Top KPIs
  const kpis = useMemo(() => {
    const totalAppliances = appliances.length || 142;
    const rentedAppliances = appliances.filter(a => a.status === 'RENTED').length;
    const activeRentals = bookings.filter(b => b.status === 'ACTIVE').length || 124;
    const utilizationRate = Math.round((rentedAppliances / (totalAppliances || 1)) * 100) || 78.4;
    const pendingMaintenance = maintenanceTickets.filter(m => m.status === 'In Service').length || 12;

    const grossRevenue = appliances.reduce((sum, item) => sum + (item.monthly_rent || 1800), 0) * 4 || 148500;
    const platformFee = Math.round(grossRevenue * 0.15);
    const maintenanceDeduction = 4300;
    const netTakeHome = grossRevenue - platformFee - maintenanceDeduction;

    return {
      totalRevenue: grossRevenue,
      netTakeHome,
      platformFee,
      maintenanceDeduction,
      activeRentals,
      totalAppliances,
      utilizationRate,
      pendingMaintenance,
    };
  }, [appliances, bookings, maintenanceTickets]);

  // Filtered Appliances for Management
  const filteredAppliances = useMemo(() => {
    return appliances.filter(a => {
      const matchQ = (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                     (a.serial || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                     (a.hub || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchC = filterCategory === 'ALL' || a.category.toUpperCase() === filterCategory.toUpperCase();
      return matchQ && matchC;
    });
  }, [appliances, searchQuery, filterCategory]);

  // Toggle Appliance Status
  const toggleStatus = (id) => {
    setAppliances(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'AVAILABLE' ? 'RENTED' : 'AVAILABLE';
        triggerToast(`Status for ${a.serial} updated to ${nextStatus}`);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Create New Appliance
  const handleCreateAppliance = (e) => {
    e.preventDefault();
    if (!newAsset.name) return;
    const created = {
      id: `app-${Date.now()}`,
      name: newAsset.name,
      category: newAsset.category,
      serial: newAsset.serial || `SN-${newAsset.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      hub: newAsset.hub,
      status: 'AVAILABLE',
      condition: 10.0,
      monthly_rent: Number(newAsset.monthly_rent),
      active_rentals: 0,
      utilization: 0,
      health: 100,
      hours_run: 0,
      maintenance_count: 0,
      total_revenue: 0,
      image: newAsset.image,
      current_tenant: 'Ready to Dispatch',
    };
    setAppliances([created, ...appliances]);
    setShowAddModal(false);
    triggerToast(`"${newAsset.name}" successfully added to your inventory fleet!`);
    setNewAsset({
      name: '',
      category: 'Living Room',
      monthly_rent: 1800,
      hub: 'Indiranagar Hub',
      serial: '',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: THEME.bg,
      color: THEME.slateDark,
      fontFamily: 'var(--font-body, "Manrope", -apple-system, BlinkMacSystemFont, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            style={{
              position: 'fixed', top: '24px', right: '32px', zIndex: 999999,
              background: THEME.slateDark, color: '#ffffff',
              padding: '12px 24px', borderRadius: '999px',
              fontSize: '0.88rem', fontWeight: 700,
              boxShadow: '0 20px 40px rgba(15,23,42,0.2)',
              display: 'flex', alignItems: 'center', gap: '10px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Sparkles size={16} color={THEME.emerald} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP CONTROL BAR ── */}
      <header style={{
        height: '70px',
        backgroundColor: THEME.surface,
        borderBottom: `1px solid ${THEME.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        {/* Brand & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display, "Fraunces", serif)',
              letterSpacing: '-0.03em',
              color: THEME.slateDark,
            }}>
              RentAI
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: THEME.primaryLight,
              color: THEME.primary,
              padding: '3px 10px',
              borderRadius: '99px',
            }}>
              Owner Control
            </span>
          </Link>

          <div style={{ height: '24px', width: '1px', backgroundColor: THEME.border }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: THEME.slateMuted }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.emerald }} />
            <span>Fleet Yield Engine: <strong style={{ color: THEME.slateDark }}>Operational (142 Units)</strong></span>
          </div>
        </div>

        {/* Global Search & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            position: 'relative',
            width: '320px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Search size={16} color={THEME.slateMuted} style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Search assets, bookings, hubs, serials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '99px',
                border: `1px solid ${THEME.border}`,
                backgroundColor: THEME.bg,
                fontSize: '0.85rem',
                outline: 'none',
                color: THEME.slateDark,
                fontFamily: 'inherit',
              }}
            />
          </div>

          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: THEME.bg,
              color: THEME.slateDark,
              border: `1px solid ${THEME.border}`,
              borderRadius: '99px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Eye size={15} color={THEME.slateMuted} /> Storefront
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: THEME.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '99px',
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={16} /> Add Appliance
          </button>

          <div style={{ height: '24px', width: '1px', backgroundColor: THEME.border }} />

          {/* User Capsule with Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: THEME.primaryLight,
              color: THEME.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem',
            }}>
              {user?.full_name ? user.full_name[0] : 'O'}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: THEME.slateDark }}>
                {user?.full_name || 'Rentova Asset Partner'}
              </div>
              <div style={{ fontSize: '0.72rem', color: THEME.emerald, fontWeight: 700 }}>
                Verified Tier-1 Host
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: THEME.slateMuted,
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px',
              }}
            >
              <Power size={16} color={THEME.rose} />
            </button>
          </div>
        </div>
      </header>

      {/* ── WORKSPACE BODY WITH SIDEBAR ── */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── LEFT FIXED SIDEBAR ── */}
        <aside style={{
          width: '260px',
          backgroundColor: THEME.surface,
          borderRight: `1px solid ${THEME.border}`,
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          flexShrink: 0,
        }}>
          {/* Section: OVERVIEW */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: THEME.slateMuted, textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              Overview
            </div>
            <SidebarTab
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
          </div>

          {/* Section: BUSINESS */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: THEME.slateMuted, textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              Business
            </div>
            <SidebarTab
              icon={<DollarSign size={18} />}
              label="Revenue"
              badge="₹1.48L"
              active={activeTab === 'revenue'}
              onClick={() => setActiveTab('revenue')}
            />
            <SidebarTab
              icon={<Truck size={18} />}
              label="Rentals"
              badge="124"
              active={activeTab === 'rentals'}
              onClick={() => setActiveTab('rentals')}
            />
            <SidebarTab
              icon={<Package size={18} />}
              label="Inventory"
              active={activeTab === 'inventory'}
              onClick={() => setActiveTab('inventory')}
            />
          </div>

          {/* Section: MY APPLIANCES */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: THEME.slateMuted, textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              My Appliances
            </div>
            <SidebarTab
              icon={<Layers size={18} />}
              label="Appliances"
              active={activeTab === 'appliances'}
              onClick={() => setActiveTab('appliances')}
            />
            <SidebarTab
              icon={<Wrench size={18} />}
              label="Maintenance"
              badge="12 Open"
              badgeColor={THEME.amber}
              active={activeTab === 'maintenance'}
              onClick={() => setActiveTab('maintenance')}
            />
            <SidebarTab
              icon={<RotateCcw size={18} />}
              label="Returns"
              active={activeTab === 'returns'}
              onClick={() => setActiveTab('returns')}
            />
          </div>

          {/* Section: INTELLIGENCE */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: THEME.slateMuted, textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              Intelligence
            </div>
            <SidebarTab
              icon={<Sparkles size={18} />}
              label="Demand AI"
              badge="Surge"
              badgeColor={THEME.primary}
              active={activeTab === 'demand_ai'}
              onClick={() => setActiveTab('demand_ai')}
            />
            <SidebarTab
              icon={<BarChart2 size={18} />}
              label="Performance"
              active={activeTab === 'performance_ai'}
              onClick={() => setActiveTab('performance_ai')}
            />
          </div>

          {/* Section: FINANCE */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: THEME.slateMuted, textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              Finance
            </div>
            <SidebarTab
              icon={<TrendingUp size={18} />}
              label="Earnings"
              active={activeTab === 'earnings'}
              onClick={() => setActiveTab('earnings')}
            />
            <SidebarTab
              icon={<FileText size={18} />}
              label="Payouts"
              active={activeTab === 'payouts'}
              onClick={() => setActiveTab('payouts')}
            />
          </div>

          {/* Section: ACCOUNT */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: THEME.slateMuted, textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              Account
            </div>
            <SidebarTab
              icon={<User size={18} />}
              label="Host Profile"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main style={{
          flex: 1,
          padding: '2.5rem 3rem',
          maxWidth: '1440px',
          overflowY: 'auto',
        }}>

          {/* TAB 1: OVERVIEW (DASHBOARD) */}
          {activeTab === 'overview' && (
            <div>
              {/* Header Title */}
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: THEME.primary, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    RentAI Business Intelligence
                  </div>
                  <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    margin: 0,
                    fontFamily: 'var(--font-display, "Fraunces", serif)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                  }}>
                    Owner Executive Overview
                  </h1>
                  <p style={{ margin: '8px 0 0', color: THEME.slateMuted, fontSize: '0.95rem' }}>
                    Real-time monitoring of your appliance fleet yield, tenant approvals, and maintenance health.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => triggerToast('Refreshing real-time telemetry from IoT edge nodes...')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: THEME.surface, border: `1px solid ${THEME.border}`,
                      borderRadius: '99px', padding: '8px 16px', fontSize: '0.82rem',
                      fontWeight: 700, color: THEME.slateDark, cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={14} /> Refresh Telemetry
                  </button>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: THEME.slateDark, border: 'none',
                      borderRadius: '99px', padding: '8px 18px', fontSize: '0.82rem',
                      fontWeight: 700, color: '#ffffff', cursor: 'pointer',
                    }}
                  >
                    View Financials <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              {/* 5 TOP KPIS Specified by User */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1.25rem',
                marginBottom: '2.5rem',
              }}>
                <KpiCard
                  title="Total Revenue"
                  value={formatINR(kpis.totalRevenue)}
                  subtext="+14.2% vs last month"
                  subtextColor={THEME.emerald}
                  icon={<DollarSign size={20} color={THEME.emerald} />}
                />
                <KpiCard
                  title="Active Rentals"
                  value={kpis.activeRentals}
                  subtext="18 Booked • 12 Returning"
                  subtextColor={THEME.blue}
                  icon={<Truck size={20} color={THEME.blue} />}
                />
                <KpiCard
                  title="My Appliances"
                  value={kpis.totalAppliances}
                  subtext="Deployed across 4 Hubs"
                  subtextColor={THEME.slateMuted}
                  icon={<Layers size={20} color={THEME.purple} />}
                />
                <KpiCard
                  title="Utilization Rate"
                  value={`${kpis.utilizationRate}%`}
                  subtext="Benchmark: 75% Target"
                  subtextColor={THEME.emerald}
                  icon={<BarChart2 size={20} color={THEME.primary} />}
                />
                <KpiCard
                  title="Pending Maintenance"
                  value={kpis.pendingMaintenance}
                  subtext="Avg turnaround: 1.4 days"
                  subtextColor={THEME.amber}
                  icon={<Wrench size={20} color={THEME.amber} />}
                />
              </div>

              {/* REVENUE VELOCITY GRAPH */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                padding: '1.75rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 20px -8px rgba(0,0,0,0.03)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                      Revenue Velocity & Net Yield Inflow
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: THEME.slateMuted }}>
                      Gross appliance rental proceeds vs. Net take-home after 15% platform commission
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', background: THEME.bg, padding: '4px', borderRadius: '12px' }}>
                    {['7D', '30D', '3M', '6M', '1Y'].map(period => (
                      <button
                        key={period}
                        onClick={() => setRevenuePeriod(period)}
                        style={{
                          background: revenuePeriod === period ? THEME.surface : 'transparent',
                          color: revenuePeriod === period ? THEME.slateDark : THEME.slateMuted,
                          border: revenuePeriod === period ? `1px solid ${THEME.border}` : 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: revenuePeriod === period ? '0 2px 4px rgba(0,0,0,0.04)' : 'none',
                        }}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA_PERIODS[revenuePeriod] || REVENUE_DATA_PERIODS['30D']}>
                      <defs>
                        <linearGradient id="grossYield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={THEME.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="netYield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={THEME.emerald} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={THEME.emerald} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: THEME.slateDark,
                          borderRadius: '12px',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '0.85rem',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
                        }}
                        formatter={(value, name) => [formatINR(value), name === 'gross' ? 'Gross Revenue' : 'Net Take-Home']}
                      />
                      <Area type="monotone" dataKey="gross" stroke={THEME.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#grossYield)" name="gross" />
                      <Area type="monotone" dataKey="net" stroke={THEME.emerald} strokeWidth={2.5} fillOpacity={1} fill="url(#netYield)" name="net" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2-COLUMN SPLIT: Category Demand & Rental Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                {/* Category Demand */}
                <div style={{
                  backgroundColor: THEME.surface,
                  borderRadius: '20px',
                  border: `1px solid ${THEME.border}`,
                  padding: '1.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                      Category Demand Index
                    </h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.primary, background: THEME.primaryLight, padding: '3px 8px', borderRadius: '6px' }}>
                      Nexus AI Live
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    <ProgressBar label="Living Room (Sofas, Smart TVs, Media Consoles)" percentage={85} color={THEME.primary} />
                    <ProgressBar label="Kitchen (Inverter Refrigerators, Microwaves, RO)" percentage={72} color={THEME.emerald} />
                    <ProgressBar label="Bedroom (Beds, Wardrobes, Air Purifiers)" percentage={64} color={THEME.blue} />
                    <ProgressBar label="Home Office (Ergonomic Desks, Mesh Chairs)" percentage={58} color={THEME.purple} />
                    <ProgressBar label="Laundry (Front Load Washers & Dryers)" percentage={79} color={THEME.amber} />
                  </div>
                </div>

                {/* Rental Status Breakdown */}
                <div style={{
                  backgroundColor: THEME.surface,
                  borderRadius: '20px',
                  border: `1px solid ${THEME.border}`,
                  padding: '1.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                      Rental Pipeline Status
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>
                      142 Fleet Units
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <StatusWidget label="Booked (Pending KYC)" count={18} color={THEME.purple} desc="Tenants awaiting identity scan" />
                    <StatusWidget label="Active In-Home" count={94} color={THEME.emerald} desc="Yielding daily rental accrual" />
                    <StatusWidget label="Returning Soon" count={12} color={THEME.blue} desc="Inspection scheduled within 72h" />
                    <StatusWidget label="Under Maintenance" count={12} color={THEME.amber} desc="At OEM authorized service" />
                    <StatusWidget label="Available in Hub" count={6} color="#059669" desc="Ready for immediate dispatch" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVENUE */}
          {activeTab === 'revenue' && (
            <div>
              <SectionHeader
                title="Revenue Intelligence & Stream Decomposition"
                subtitle="Itemized financial tracking across rental inflows, platform fee deductions, and late fees."
                action={
                  <button
                    onClick={() => triggerToast('Exporting GST Compliant Tax Invoice & Statement (PDF)...')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: THEME.slateDark, color: '#ffffff', border: 'none',
                      padding: '8px 16px', borderRadius: '99px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <Download size={15} /> Download P&L Statement
                  </button>
                }
              />

              {/* Revenue Breakdown Bento */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}>
                <div style={{ background: THEME.surface, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${THEME.border}` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, display: 'block', marginBottom: '8px' }}>
                    Gross Rental Inflow
                  </span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: THEME.slateDark, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    {formatINR(kpis.totalRevenue)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: THEME.emerald, fontWeight: 700, display: 'block', marginTop: '6px' }}>
                    +₹18,400 new subscriptions
                  </span>
                </div>

                <div style={{ background: THEME.surface, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${THEME.border}` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, display: 'block', marginBottom: '8px' }}>
                    Platform Commission (15%)
                  </span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: THEME.rose, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    -{formatINR(kpis.platformFee)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: THEME.slateMuted, display: 'block', marginTop: '6px' }}>
                    Covers KYC, logistics & app host
                  </span>
                </div>

                <div style={{ background: THEME.surface, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${THEME.border}` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, display: 'block', marginBottom: '8px' }}>
                    Maintenance Deductions
                  </span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: THEME.amber, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    -{formatINR(kpis.maintenanceDeduction)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: THEME.slateMuted, display: 'block', marginTop: '6px' }}>
                    Scheduled quarterly OEM service
                  </span>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(92,69,253,0.08) 100%)', padding: '1.5rem', borderRadius: '20px', border: `1px solid ${THEME.emerald}` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.emerald, display: 'block', marginBottom: '8px' }}>
                    Net Take-Home Earnings
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: THEME.emerald, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    {formatINR(kpis.netTakeHome)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: THEME.slateDark, fontWeight: 700, display: 'block', marginTop: '6px' }}>
                    Scheduled for auto-credit Oct 1st
                  </span>
                </div>
              </div>

              {/* Monthly Breakdown Table */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '1.5rem 1.75rem', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    Historical Monthly P&L Ledger
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: THEME.slateMuted }}>
                    FY 2026-2027
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.bg, color: THEME.slateMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '12px 20px' }}>Month</th>
                      <th style={{ padding: '12px 20px' }}>Gross Revenue</th>
                      <th style={{ padding: '12px 20px' }}>Platform Fee (15%)</th>
                      <th style={{ padding: '12px 20px' }}>Maintenance</th>
                      <th style={{ padding: '12px 20px' }}>Late Fees</th>
                      <th style={{ padding: '12px 20px' }}>Net Earnings</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { month: 'September 2026 (MTD)', gross: 148500, fee: 22275, maint: 4300, late: 1850, net: 123775, status: 'Accruing' },
                      { month: 'August 2026', gross: 135400, fee: 20310, maint: 3200, late: 1200, net: 113090, status: 'Paid' },
                      { month: 'July 2026', gross: 122000, fee: 18300, maint: 2400, late: 950, net: 102250, status: 'Paid' },
                      { month: 'June 2026', gross: 114500, fee: 17175, maint: 2100, late: 600, net: 95825, status: 'Paid' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        <td style={{ padding: '16px 20px', fontWeight: 800, color: THEME.slateDark }}>{row.month}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 700 }}>{formatINR(row.gross)}</td>
                        <td style={{ padding: '16px 20px', color: THEME.rose }}>-{formatINR(row.fee)}</td>
                        <td style={{ padding: '16px 20px', color: THEME.amber }}>-{formatINR(row.maint)}</td>
                        <td style={{ padding: '16px 20px', color: THEME.emerald }}>+{formatINR(row.late)}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 900, color: THEME.emerald }}>{formatINR(row.net)}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800,
                            backgroundColor: row.status === 'Paid' ? THEME.emeraldLight : THEME.primaryLight,
                            color: row.status === 'Paid' ? THEME.emerald : THEME.primary,
                          }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RENTALS (LIFECYCLE MANAGEMENT) */}
          {activeTab === 'rentals' && (
            <div>
              <SectionHeader
                title="Rental Lifecycle & Agreement Registry"
                subtitle="Track bookings from initial KYC handshake through dispatch, active subscription, and return recovery."
              />

              {/* RENTAL LIFECYCLE STEPPER DIAGRAM */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                padding: '1.75rem',
                marginBottom: '2rem',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  Standard Rental Lifecycle Protocol
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  {[
                    { step: '1', title: 'Booked', desc: 'Cart Confirmed' },
                    { step: '2', title: 'KYC Verified', desc: 'Aadhaar / Work ID' },
                    { step: '3', title: 'Deposit Paid', desc: 'Escrow Lock' },
                    { step: '4', title: 'Delivered', desc: 'White Glove Tech' },
                    { step: '5', title: 'Active Rental', desc: 'Monthly Auto-Debit' },
                    { step: '6', title: 'Return Notice', desc: 'Inspect & Settle' },
                    { step: '7', title: 'Recovered', desc: 'Hub Re-stocked' },
                  ].map((s, idx, arr) => (
                    <React.Fragment key={s.step}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2 }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: idx <= 4 ? THEME.primary : THEME.bg,
                          color: idx <= 4 ? '#ffffff' : THEME.slateMuted,
                          border: `2px solid ${idx <= 4 ? THEME.primary : THEME.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px',
                        }}>
                          {idx < 4 ? <Check size={16} /> : s.step}
                        </div>
                        <strong style={{ fontSize: '0.82rem', color: THEME.slateDark }}>{s.title}</strong>
                        <span style={{ fontSize: '0.72rem', color: THEME.slateMuted }}>{s.desc}</span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div style={{ flex: 1, height: '2px', backgroundColor: idx < 4 ? THEME.primary : THEME.border, margin: '0 8px', marginTop: '-24px' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    Active & Incoming Tenant Contracts ({bookings.length})
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: THEME.slateMuted }}>
                    Filtered by Search & Status
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.bg, color: THEME.slateMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '12px 20px' }}>Booking ID</th>
                      <th style={{ padding: '12px 20px' }}>Tenant & Location</th>
                      <th style={{ padding: '12px 20px' }}>Appliance</th>
                      <th style={{ padding: '12px 20px' }}>Contract Term</th>
                      <th style={{ padding: '12px 20px' }}>Monthly Rate</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                      <th style={{ padding: '12px 20px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        <td style={{ padding: '16px 20px', fontWeight: 800, color: THEME.primary }}>{b.id}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: THEME.slateDark }}>{b.tenant_name}</div>
                          <div style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>{b.location}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700 }}>{b.appliance_name}</div>
                          <span style={{ fontSize: '0.72rem', color: THEME.slateMuted }}>{b.category}</span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '0.8rem', color: THEME.slateMuted }}>
                          {b.start_date} &rarr; {b.end_date}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 800 }}>{formatINR(b.monthly_rate)}/mo</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800,
                            backgroundColor: b.status === 'ACTIVE' ? THEME.emeraldLight : b.status === 'RETURNING' ? THEME.blueLight : THEME.amberLight,
                            color: b.status === 'ACTIVE' ? THEME.emerald : b.status === 'RETURNING' ? THEME.blue : THEME.amber,
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <button
                            onClick={() => setSelectedBooking(b)}
                            style={{
                              background: THEME.bg, border: `1px solid ${THEME.border}`,
                              borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem',
                              fontWeight: 700, cursor: 'pointer', color: THEME.slateDark,
                            }}
                          >
                            Inspect Agreement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & HUB MAP */}
          {activeTab === 'inventory' && (
            <div>
              <SectionHeader
                title="Inventory State Matrix & Hub Distribution"
                subtitle="Visual tracking of fleet deployment across Available, Rented, Maintenance, Reserved, and Returning states."
              />

              {/* Visual State Dots Bar */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                padding: '1.75rem',
                marginBottom: '2rem',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
                  Fleet State Distribution (142 Units)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <StateCapsule label="AVAILABLE" count={18} color={THEME.emerald} desc="Ready for immediate delivery" />
                  <StateCapsule label="RENTED" count={94} color={THEME.blue} desc="Deployed in active homes" />
                  <StateCapsule label="MAINTENANCE" count={12} color={THEME.amber} desc="Under service inspection" />
                  <StateCapsule label="RESERVED" count={6} color={THEME.purple} desc="Held for KYC approval" />
                  <StateCapsule label="RETURNING" count={12} color="#06b6d4" desc="In transit to hub" />
                </div>

                {/* Progress bar visual representation */}
                <div style={{ height: '12px', width: '100%', borderRadius: '99px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: '66%', backgroundColor: THEME.blue }} title="Rented (66%)" />
                  <div style={{ width: '13%', backgroundColor: THEME.emerald }} title="Available (13%)" />
                  <div style={{ width: '8%', backgroundColor: THEME.amber }} title="Maintenance (8%)" />
                  <div style={{ width: '5%', backgroundColor: THEME.purple }} title="Reserved (5%)" />
                  <div style={{ width: '8%', backgroundColor: '#06b6d4' }} title="Returning (8%)" />
                </div>
              </div>

              {/* Hub Location Breakdown Table */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    Fulfillment Hub Allocation
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['ALL', 'LIVING ROOM', 'KITCHEN', 'BEDROOM', 'HOME OFFICE', 'LAUNDRY'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        style={{
                          background: filterCategory === cat ? THEME.slateDark : THEME.bg,
                          color: filterCategory === cat ? '#ffffff' : THEME.slateMuted,
                          border: `1px solid ${THEME.border}`,
                          padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem',
                          fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.bg, color: THEME.slateMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '12px 20px' }}>Serial / Tag</th>
                      <th style={{ padding: '12px 20px' }}>Appliance Model</th>
                      <th style={{ padding: '12px 20px' }}>Hub / Depot</th>
                      <th style={{ padding: '12px 20px' }}>Condition Score</th>
                      <th style={{ padding: '12px 20px' }}>Monthly Rent</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                      <th style={{ padding: '12px 20px' }}>Toggle State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppliances.map((app) => (
                      <tr key={app.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: 700, color: THEME.primary }}>
                          {app.serial}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: THEME.slateDark }}>{app.name}</div>
                          <span style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>{app.category}</span>
                        </td>
                        <td style={{ padding: '16px 20px', color: THEME.slateDark, fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} color={THEME.slateMuted} />
                            {app.hub}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                            backgroundColor: app.condition >= 9 ? THEME.emeraldLight : THEME.amberLight,
                            color: app.condition >= 9 ? THEME.emerald : THEME.amber,
                          }}>
                            {app.condition} / 10
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 800 }}>{formatINR(app.monthly_rent)}/mo</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800,
                            backgroundColor:
                              app.status === 'AVAILABLE' ? THEME.emeraldLight :
                              app.status === 'RENTED' ? THEME.blueLight :
                              app.status === 'MAINTENANCE' ? THEME.amberLight :
                              app.status === 'RETURNING' ? 'rgba(6, 182, 212, 0.1)' : THEME.purpleLight,
                            color:
                              app.status === 'AVAILABLE' ? THEME.emerald :
                              app.status === 'RENTED' ? THEME.blue :
                              app.status === 'MAINTENANCE' ? THEME.amber :
                              app.status === 'RETURNING' ? '#0891b2' : THEME.purple,
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <button
                            onClick={() => toggleStatus(app.id)}
                            style={{
                              background: THEME.bg, border: `1px solid ${THEME.border}`,
                              borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem',
                              fontWeight: 700, cursor: 'pointer',
                            }}
                          >
                            Flip State
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: APPLIANCES (FLEET MANAGEMENT) */}
          {activeTab === 'appliances' && (
            <div>
              <SectionHeader
                title="Appliance Fleet Management"
                subtitle="Inspect detailed asset health, lifetime earnings, and maintenance history per unit."
                action={
                  <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: THEME.primary, color: '#ffffff', border: 'none',
                      padding: '8px 18px', borderRadius: '99px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <Plus size={16} /> Add New Unit
                  </button>
                }
              />

              {/* Grid of Appliance Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}>
                {filteredAppliances.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      backgroundColor: THEME.surface,
                      borderRadius: '20px',
                      border: `1px solid ${THEME.border}`,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 15px -5px rgba(0,0,0,0.03)',
                    }}
                  >
                    {/* Image & Status Tag */}
                    <div style={{ position: 'relative', height: '180px', backgroundColor: '#f1f5f9' }}>
                      <img
                        src={app.image}
                        alt={app.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
                        color: '#ffffff', padding: '4px 10px', borderRadius: '99px',
                        fontSize: '0.72rem', fontWeight: 800,
                      }}>
                        {app.status}
                      </div>
                      <div style={{
                        position: 'absolute', bottom: '12px', left: '12px',
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                        padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem',
                        fontWeight: 800, color: THEME.slateDark,
                      }}>
                        {app.serial}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.primary, textTransform: 'uppercase', marginBottom: '4px' }}>
                        {app.category}
                      </div>
                      <h4 style={{ margin: '0 0 10px', fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.3, color: THEME.slateDark }}>
                        {app.name}
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px 0', borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}`, marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: THEME.slateMuted, display: 'block' }}>Monthly Yield</span>
                          <strong style={{ fontSize: '1rem', color: THEME.slateDark }}>{formatINR(app.monthly_rent)}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: THEME.slateMuted, display: 'block' }}>Total Accrued</span>
                          <strong style={{ fontSize: '1rem', color: THEME.emerald }}>{formatINR(app.total_revenue)}</strong>
                        </div>
                      </div>

                      {/* Health & Utilization Indicators */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '0.8rem' }}>
                        <span style={{ color: THEME.slateMuted }}>
                          Health: <strong style={{ color: app.health > 80 ? THEME.emerald : THEME.amber }}>{app.health}%</strong>
                        </span>
                        <span style={{ color: THEME.slateMuted }}>
                          Utilization: <strong style={{ color: THEME.primary }}>{app.utilization}%</strong>
                        </span>
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedUnit(app)}
                          style={{
                            flex: 1,
                            backgroundColor: THEME.bg,
                            border: `1px solid ${THEME.border}`,
                            borderRadius: '10px',
                            padding: '8px 0',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: THEME.slateDark,
                          }}
                        >
                          Unit Analytics
                        </button>
                        <button
                          onClick={() => toggleStatus(app.id)}
                          style={{
                            backgroundColor: app.status === 'AVAILABLE' ? THEME.emeraldLight : THEME.bg,
                            color: app.status === 'AVAILABLE' ? THEME.emerald : THEME.slateDark,
                            border: `1px solid ${THEME.border}`,
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MAINTENANCE (HEALTH & TICKETS) */}
          {activeTab === 'maintenance' && (
            <div>
              <SectionHeader
                title="Appliance Health & Predictive Maintenance"
                subtitle="IoT health score monitors, operating runtime hours, and repair downtime tracking."
                action={
                  <button
                    onClick={() => triggerToast('Maintenance dispatch order logged with technician partner.')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: THEME.amber, color: '#ffffff', border: 'none',
                      padding: '8px 18px', borderRadius: '99px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <Wrench size={16} /> Log Service Ticket
                  </button>
                }
              />

              {/* 3 Health Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`, padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, display: 'block', marginBottom: '6px' }}>
                    Fleet Average Health Score
                  </span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: THEME.emerald, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    82%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: THEME.slateMuted, display: 'block', marginTop: '6px' }}>
                    8 units scheduled for proactive filter replacement
                  </span>
                </div>

                <div style={{ backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`, padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, display: 'block', marginBottom: '6px' }}>
                    Average Operating Runtime
                  </span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: THEME.slateDark, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    2,180 hrs
                  </div>
                  <span style={{ fontSize: '0.75rem', color: THEME.slateMuted, display: 'block', marginTop: '6px' }}>
                    Standard MTBF (Mean Time Between Failures): 4,800 hrs
                  </span>
                </div>

                <div style={{ backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`, padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, display: 'block', marginBottom: '6px' }}>
                    Downtime Rate
                  </span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: THEME.primary, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    1.8%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: THEME.emerald, fontWeight: 700, display: 'block', marginTop: '6px' }}>
                    -0.6% vs industrial standard of 2.4%
                  </span>
                </div>
              </div>

              {/* Maintenance Tickets Table */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    Active Maintenance & OEM Service Records ({maintenanceTickets.length})
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: THEME.slateMuted }}>
                    Under Rentova Care Shield
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.bg, color: THEME.slateMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '12px 20px' }}>Ticket #</th>
                      <th style={{ padding: '12px 20px' }}>Appliance & Serial</th>
                      <th style={{ padding: '12px 20px' }}>Reported Issue</th>
                      <th style={{ padding: '12px 20px' }}>Service Partner</th>
                      <th style={{ padding: '12px 20px' }}>Estimated Cost</th>
                      <th style={{ padding: '12px 20px' }}>Downtime</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceTickets.map((tkt) => (
                      <tr key={tkt.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        <td style={{ padding: '16px 20px', fontWeight: 800, color: THEME.primary }}>{tkt.id}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: THEME.slateDark }}>{tkt.appliance_name}</div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: THEME.slateMuted }}>{tkt.serial}</span>
                        </td>
                        <td style={{ padding: '16px 20px', color: THEME.slateDark }}>{tkt.issue}</td>
                        <td style={{ padding: '16px 20px', color: THEME.slateMuted }}>{tkt.partner}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 800 }}>{formatINR(tkt.cost)}</td>
                        <td style={{ padding: '16px 20px', color: THEME.amber, fontWeight: 700 }}>{tkt.downtime_days} days</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800,
                            backgroundColor: tkt.status === 'Completed' ? THEME.emeraldLight : THEME.amberLight,
                            color: tkt.status === 'Completed' ? THEME.emerald : THEME.amber,
                          }}>
                            {tkt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: RETURNS & ASSET RECOVERY */}
          {activeTab === 'returns' && (
            <div>
              <SectionHeader
                title="Returns & Asset Recovery Inspection"
                subtitle="AI-driven condition audit comparing check-in state vs check-out condition score."
              />

              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                padding: '1.75rem',
                marginBottom: '2rem',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
                  Return Recovery Protocol
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                  <div style={{ padding: '1.25rem', backgroundColor: THEME.bg, borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: THEME.primaryLight, color: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '8px' }}>
                      1
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: THEME.slateDark, display: 'block' }}>Pickup Scheduled</strong>
                    <span style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>White-glove logistics team dispatched with protective padding.</span>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: THEME.bg, borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: THEME.primaryLight, color: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '8px' }}>
                      2
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: THEME.slateDark, display: 'block' }}>Computer Vision Audit</strong>
                    <span style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>High-res photography scanned for surface scratches, dings, or stains.</span>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: THEME.bg, borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: THEME.primaryLight, color: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '8px' }}>
                      3
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: THEME.slateDark, display: 'block' }}>Deposit Settlement</strong>
                    <span style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>Normal wear waived. Minor repair costs levied against security escrow.</span>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: THEME.bg, borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: THEME.emeraldLight, color: THEME.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '8px' }}>
                      <Check size={18} />
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: THEME.slateDark, display: 'block' }}>Re-staged & Listed</strong>
                    <span style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>Sanitized, sealed, and returned to active catalog hub.</span>
                  </div>
                </div>
              </div>

              {/* Inspection Comparison Card */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                padding: '1.75rem',
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1.25rem', fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                  Recent Condition Inspection Comparison
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '1rem' }}>
                      <img
                        src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=300&q=80"
                        alt="Teak Dining Suite"
                        style={{ width: '90px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ fontSize: '1rem', color: THEME.slateDark }}>Solid Teak Wood 6-Seater Dining Suite</strong>
                        <div style={{ fontSize: '0.78rem', color: THEME.slateMuted }}>Serial: SN-FN-6012 • Tenant: Kavita Das (12 Months Term)</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: THEME.slateMuted, lineHeight: 1.6 }}>
                      AI Vision audit detected normal cosmetic micro-patina on table veneer. All 6 chairs intact with zero structural looseness. 100% security deposit released.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: THEME.bg, padding: '1.25rem', borderRadius: '14px', border: `1px solid ${THEME.border}`, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: THEME.slateMuted }}>Check-in Score</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: THEME.emerald }}>9.8 / 10</div>
                      <span style={{ fontSize: '0.7rem', color: THEME.slateMuted }}>Factory Mint</span>
                    </div>

                    <div style={{ background: THEME.bg, padding: '1.25rem', borderRadius: '14px', border: `1px solid ${THEME.border}`, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: THEME.slateMuted }}>Check-out Score</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: THEME.primary }}>9.1 / 10</div>
                      <span style={{ fontSize: '0.7rem', color: THEME.emerald, fontWeight: 700 }}>Eligible for Re-rent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DEMAND INTELLIGENCE (AI) */}
          {activeTab === 'demand_ai' && (
            <div>
              <SectionHeader
                title="Nexus Demand AI & Inventory Gap Analysis"
                subtitle="Predictive market appetite across Bangalore sub-markets comparing current owned fleet vs. tenant search demand."
              />

              {/* Comparison Bar Chart */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                padding: '1.75rem',
                marginBottom: '2rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                      Current Stock vs. Market Demand (Units)
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: THEME.slateMuted }}>
                      Blue bar: Your deployed stock • Indigo bar: Unfulfilled verified customer demand
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: THEME.blue }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: THEME.blue }} /> Your Fleet Stock
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: THEME.primary }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: THEME.primary }} /> Verified Search Demand
                    </span>
                  </div>
                </div>

                <div style={{ height: '320px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STOCK_VS_DEMAND}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: THEME.slateDark,
                          borderRadius: '12px',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                      <Bar dataKey="stock" fill={THEME.blue} radius={[6, 6, 0, 0]} name="Your Stock" />
                      <Bar dataKey="demand" fill={THEME.primary} radius={[6, 6, 0, 0]} name="Market Demand" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Strategic Action Recommendations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                <div style={{
                  backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`,
                  padding: '1.5rem', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Sparkles size={18} color={THEME.primary} />
                    <strong style={{ fontSize: '0.9rem', color: THEME.slateDark }}>Laundry Fleet Shortfall</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: THEME.slateMuted, lineHeight: 1.5, margin: '0 0 12px' }}>
                    Whitefield and HSR corridors have +69% unfulfilled demand for 8kg Front-Load Washers. Deploying 4 additional units can generate ₹7,800/mo net.
                  </p>
                  <button
                    onClick={() => { setActiveTab('appliances'); setShowAddModal(true); }}
                    style={{ marginTop: 'auto', background: THEME.primaryLight, color: THEME.primary, border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Deploy Washers &rarr;
                  </button>
                </div>

                <div style={{
                  backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`,
                  padding: '1.5rem', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Sparkles size={18} color={THEME.emerald} />
                    <strong style={{ fontSize: '0.9rem', color: THEME.slateDark }}>Dynamic Rent Optimization</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: THEME.slateMuted, lineHeight: 1.5, margin: '0 0 12px' }}>
                    Double door refrigerators in Indiranagar are clearing in under 4 hours. You can bump rent by +₹150/mo with 0% churn risk.
                  </p>
                  <button
                    onClick={() => triggerToast('Dynamic pricing applied: +₹150/mo across active refrigeration units.')}
                    style={{ marginTop: 'auto', background: THEME.emeraldLight, color: THEME.emerald, border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Apply Dynamic Yield &rarr;
                  </button>
                </div>

                <div style={{
                  backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`,
                  padding: '1.5rem', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Sparkles size={18} color={THEME.purple} />
                    <strong style={{ fontSize: '0.9rem', color: THEME.slateDark }}>Work-From-Home Surge</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: THEME.slateMuted, lineHeight: 1.5, margin: '0 0 12px' }}>
                    Home Office combos (Ergonomic Desk + Mesh Chair) hold a 91% utilization with lowest maintenance tickets (0.1/yr). High capital efficiency.
                  </p>
                  <button
                    onClick={() => { setActiveTab('appliances'); setShowAddModal(true); }}
                    style={{ marginTop: 'auto', background: THEME.purpleLight, color: THEME.purple, border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Add Workstation &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PERFORMANCE AI (PER-MODEL ANALYTICS) */}
          {activeTab === 'performance_ai' && (
            <div>
              <SectionHeader
                title="Model Performance & Asset Economics"
                subtitle="Unit drilldown evaluating lifetime duration, revenue velocity, and maintenance frequency per model."
              />

              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '1.5rem 1.75rem', borderBottom: `1px solid ${THEME.border}` }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    Appliance Model Performance Leaderboard
                  </h3>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.bg, color: THEME.slateMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '12px 20px' }}>Appliance Model</th>
                      <th style={{ padding: '12px 20px' }}>Category</th>
                      <th style={{ padding: '12px 20px' }}>Rentals Count</th>
                      <th style={{ padding: '12px 20px' }}>Utilization Rate</th>
                      <th style={{ padding: '12px 20px' }}>Total Revenue</th>
                      <th style={{ padding: '12px 20px' }}>Maintenance Freq</th>
                      <th style={{ padding: '12px 20px' }}>Drilldown</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliances.map((app) => (
                      <tr key={app.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: THEME.slateDark }}>{app.name}</div>
                          <span style={{ fontSize: '0.75rem', color: THEME.slateMuted }}>{app.serial}</span>
                        </td>
                        <td style={{ padding: '16px 20px', color: THEME.slateDark }}>{app.category}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 700 }}>{app.active_rentals} leases</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800,
                            backgroundColor: app.utilization >= 85 ? THEME.emeraldLight : THEME.primaryLight,
                            color: app.utilization >= 85 ? THEME.emerald : THEME.primary,
                          }}>
                            {app.utilization}%
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 900, color: THEME.slateDark }}>{formatINR(app.total_revenue)}</td>
                        <td style={{ padding: '16px 20px', color: app.maintenance_count > 2 ? THEME.rose : THEME.slateMuted }}>
                          {app.maintenance_count} incidents / yr
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <button
                            onClick={() => setSelectedUnit(app)}
                            style={{
                              background: THEME.bg, border: `1px solid ${THEME.border}`,
                              borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem',
                              fontWeight: 700, cursor: 'pointer', color: THEME.primary,
                            }}
                          >
                            Inspect Economics &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: EARNINGS & PAYOUTS */}
          {(activeTab === 'earnings' || activeTab === 'payouts') && (
            <div>
              <SectionHeader
                title="Financial Settlements & Direct Payouts"
                subtitle="Automated monthly settlement ledger, platform commission transparency, and direct bank disbursement."
                action={
                  <button
                    onClick={() => triggerToast('Instant express payout initiated to HDFC Bank (T+0 transfer).')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: THEME.emerald, color: '#ffffff', border: 'none',
                      padding: '8px 18px', borderRadius: '99px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <CreditCard size={16} /> Request Express Payout
                  </button>
                }
              />

              {/* Settlement Summary Card */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                padding: '2rem',
                marginBottom: '2rem',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '2rem',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.emerald, letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Available for Settlement
                  </div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 900, color: THEME.slateDark, fontFamily: 'var(--font-display, "Fraunces", serif)', lineHeight: 1.1 }}>
                    {formatINR(kpis.netTakeHome)}
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: THEME.slateMuted }}>
                    Auto-scheduled disbursement on <strong>October 1st, 2026</strong> directly to registered bank account.
                  </p>
                </div>

                <div style={{ background: THEME.bg, padding: '1.5rem', borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: THEME.slateMuted }}>This Month's Gross:</span>
                    <strong style={{ color: THEME.slateDark }}>{formatINR(kpis.totalRevenue)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: THEME.slateMuted }}>Platform Fee (15%):</span>
                    <span style={{ color: THEME.rose, fontWeight: 700 }}>-{formatINR(kpis.platformFee)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
                    <span style={{ color: THEME.slateMuted }}>Maintenance & Cleaning:</span>
                    <span style={{ color: THEME.amber, fontWeight: 700 }}>-{formatINR(kpis.maintenanceDeduction)}</span>
                  </div>
                  <div style={{ borderTop: `1px solid ${THEME.border}`, paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <strong style={{ color: THEME.slateDark }}>Net Depositable:</strong>
                    <strong style={{ color: THEME.emerald }}>{formatINR(kpis.netTakeHome)}</strong>
                  </div>
                </div>
              </div>

              {/* Historical Payout Ledger Table */}
              <div style={{
                backgroundColor: THEME.surface,
                borderRadius: '20px',
                border: `1px solid ${THEME.border}`,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${THEME.border}` }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    Disbursement Ledger & Bank Proof
                  </h3>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.bg, color: THEME.slateMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '12px 20px' }}>Payout ID</th>
                      <th style={{ padding: '12px 20px' }}>Date</th>
                      <th style={{ padding: '12px 20px' }}>Gross Amount</th>
                      <th style={{ padding: '12px 20px' }}>Fee (15%)</th>
                      <th style={{ padding: '12px 20px' }}>Net Deposited</th>
                      <th style={{ padding: '12px 20px' }}>Destination Bank</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((pay) => (
                      <tr key={pay.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        <td style={{ padding: '16px 20px', fontWeight: 800, color: THEME.primary }}>{pay.id}</td>
                        <td style={{ padding: '16px 20px', color: THEME.slateDark }}>{pay.date}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 700 }}>{formatINR(pay.amount)}</td>
                        <td style={{ padding: '16px 20px', color: THEME.rose }}>-{formatINR(pay.fee)}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 900, color: THEME.emerald }}>{formatINR(pay.net)}</td>
                        <td style={{ padding: '16px 20px', color: THEME.slateMuted }}>
                          <div>{pay.bank}</div>
                          <span style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>Ref: {pay.ref}</span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800,
                            backgroundColor: THEME.emeraldLight, color: THEME.emerald,
                          }}>
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: PROFILE & HOST IDENTITY */}
          {activeTab === 'profile' && (
            <div>
              <SectionHeader
                title="Host Business Profile & Verified Credentials"
                subtitle="Verified KYC state, payout banking setup, and warehouse hub assignments."
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Business Information */}
                <div style={{ backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`, padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                      Business Entity Details
                    </h3>
                    <span style={{ background: THEME.emeraldLight, color: THEME.emerald, padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> Tier-1 Host Verified
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>Host Legal Name</label>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: THEME.slateDark, marginTop: '2px' }}>
                        {user?.full_name || 'Rentova Premier Appliances LLP'}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>GSTIN & Business Tax ID</label>
                      <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: THEME.slateDark, marginTop: '2px' }}>
                        29AABCR1429K1ZX
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>Official Contact</label>
                      <div style={{ fontSize: '0.95rem', color: THEME.slateDark, marginTop: '2px' }}>
                        {user?.email || 'partner-ops@rentova.ai'} • +91 98450 12891
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>Primary Logistics Hub</label>
                      <div style={{ fontSize: '0.95rem', color: THEME.slateDark, marginTop: '2px' }}>
                        Indiranagar Fulfillment Depot #4, 100 Feet Rd, Bengaluru
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Account & Payout Setup */}
                <div style={{ backgroundColor: THEME.surface, borderRadius: '20px', border: `1px solid ${THEME.border}`, padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                      Direct Payout Banking
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: THEME.emerald, fontWeight: 700 }}>
                      ✓ Active for Auto-Credit
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>Bank Name</label>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: THEME.slateDark, marginTop: '2px' }}>
                        HDFC Bank Ltd.
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>Account Number</label>
                      <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: THEME.slateDark, marginTop: '2px' }}>
                        502000849204092 (Current Business Account)
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>IFSC Code</label>
                      <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: THEME.slateDark, marginTop: '2px' }}>
                        HDFC0000240
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.slateMuted, textTransform: 'uppercase' }}>Instant UPI VPA</label>
                      <div style={{ fontSize: '0.95rem', color: THEME.slateDark, marginTop: '2px' }}>
                        rentova.partner@hdfcbank
                      </div>
                    </div>

                    <button
                      onClick={() => triggerToast('Bank verification certificate refreshed via Penny-drop.')}
                      style={{
                        marginTop: '1rem',
                        background: THEME.bg,
                        border: `1px solid ${THEME.border}`,
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: THEME.slateDark,
                      }}
                    >
                      Verify Bank Account with Penny Drop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODAL: ADD APPLIANCE ── */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                backgroundColor: THEME.surface,
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                border: `1px solid ${THEME.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                  Add Appliance to Inventory
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: THEME.slateMuted }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateAppliance} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: THEME.slateDark, display: 'block', marginBottom: '4px' }}>
                    Appliance Brand & Model Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Whirlpool 240L Triple Door Refrigerator"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: THEME.slateDark, display: 'block', marginBottom: '4px' }}>
                      Category
                    </label>
                    <select
                      value={newAsset.category}
                      onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                    >
                      <option value="Living Room">Living Room</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Home Office">Home Office</option>
                      <option value="Laundry">Laundry</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: THEME.slateDark, display: 'block', marginBottom: '4px' }}>
                      Monthly Rent (₹)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="1800"
                      value={newAsset.monthly_rent}
                      onChange={(e) => setNewAsset({ ...newAsset, monthly_rent: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: THEME.slateDark, display: 'block', marginBottom: '4px' }}>
                      Fulfillment Hub
                    </label>
                    <select
                      value={newAsset.hub}
                      onChange={(e) => setNewAsset({ ...newAsset, hub: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                    >
                      <option value="Indiranagar Hub">Indiranagar Hub</option>
                      <option value="Koramangala Depot">Koramangala Depot</option>
                      <option value="HSR Central Hub">HSR Central Hub</option>
                      <option value="Whitefield Depot">Whitefield Depot</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: THEME.slateDark, display: 'block', marginBottom: '4px' }}>
                      Serial Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-generated if blank"
                      value={newAsset.serial}
                      onChange={(e) => setNewAsset({ ...newAsset, serial: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: THEME.slateDark, display: 'block', marginBottom: '4px' }}>
                    Image Photo URL
                  </label>
                  <input
                    type="url"
                    value={newAsset.image}
                    onChange={(e) => setNewAsset({ ...newAsset, image: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ flex: 1, padding: '10px 0', borderRadius: '99px', border: `1px solid ${THEME.border}`, background: THEME.bg, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '10px 0', borderRadius: '99px', border: 'none', background: THEME.primary, color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Deploy to Catalog
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: UNIT ANALYTICS DRILLDOWN DRAWER ── */}
      <AnimatePresence>
        {selectedUnit && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '100%', maxWidth: '480px', backgroundColor: THEME.surface,
                height: '100%', padding: '2.5rem 2rem', overflowY: 'auto',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.primary, textTransform: 'uppercase' }}>
                  Asset Telemetry & Unit Economics
                </span>
                <button
                  onClick={() => setSelectedUnit(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: THEME.slateMuted }}
                >
                  <X size={20} />
                </button>
              </div>

              <img
                src={selectedUnit.image}
                alt={selectedUnit.name}
                style={{ width: '100%', height: '220px', borderRadius: '16px', objectFit: 'cover' }}
              />

              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 6px', fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                  {selectedUnit.name}
                </h3>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: THEME.slateMuted }}>
                  Serial: {selectedUnit.serial} • Hub: {selectedUnit.hub}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: THEME.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                  <span style={{ fontSize: '0.72rem', color: THEME.slateMuted, display: 'block' }}>Lifetime Revenue</span>
                  <strong style={{ fontSize: '1.25rem', color: THEME.emerald }}>{formatINR(selectedUnit.total_revenue)}</strong>
                </div>
                <div style={{ background: THEME.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                  <span style={{ fontSize: '0.72rem', color: THEME.slateMuted, display: 'block' }}>Monthly Yield</span>
                  <strong style={{ fontSize: '1.25rem', color: THEME.slateDark }}>{formatINR(selectedUnit.monthly_rent)}</strong>
                </div>
                <div style={{ background: THEME.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                  <span style={{ fontSize: '0.72rem', color: THEME.slateMuted, display: 'block' }}>Runtime Hours</span>
                  <strong style={{ fontSize: '1.25rem', color: THEME.primary }}>{selectedUnit.hours_run} hrs</strong>
                </div>
                <div style={{ background: THEME.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                  <span style={{ fontSize: '0.72rem', color: THEME.slateMuted, display: 'block' }}>Health Rating</span>
                  <strong style={{ fontSize: '1.25rem', color: selectedUnit.health > 80 ? THEME.emerald : THEME.amber }}>{selectedUnit.health}%</strong>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: THEME.slateDark, display: 'block', marginBottom: '8px' }}>
                  Current Tenant & Custody State
                </strong>
                <div style={{ background: THEME.bg, padding: '12px 16px', borderRadius: '12px', border: `1px solid ${THEME.border}`, fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 800, color: THEME.slateDark }}>{selectedUnit.current_tenant}</div>
                  <div style={{ fontSize: '0.75rem', color: THEME.slateMuted, marginTop: '2px' }}>
                    Condition Score: {selectedUnit.condition} / 10 • Protected by Rentova Care
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    toggleStatus(selectedUnit.id);
                    setSelectedUnit(null);
                  }}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: '99px',
                    border: 'none', background: THEME.slateDark, color: '#ffffff',
                    fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem'
                  }}
                >
                  Toggle Availability
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: INSPECT AGREEMENT ── */}
      <AnimatePresence>
        {selectedBooking && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                backgroundColor: THEME.surface,
                borderRadius: '24px',
                width: '100%',
                maxWidth: '520px',
                padding: '2rem',
                border: `1px solid ${THEME.border}`,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.primary, textTransform: 'uppercase' }}>
                    Agreement #{selectedBooking.id}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0', fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    Rental Contract Terms
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: THEME.slateMuted }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
                <div style={{ background: THEME.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                  <div style={{ fontSize: '0.75rem', color: THEME.slateMuted, textTransform: 'uppercase', fontWeight: 800 }}>Tenant</div>
                  <strong style={{ fontSize: '1rem', color: THEME.slateDark, display: 'block', marginTop: '2px' }}>{selectedBooking.tenant_name}</strong>
                  <span style={{ fontSize: '0.8rem', color: THEME.slateMuted }}>{selectedBooking.tenant_phone} • {selectedBooking.location}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: THEME.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                    <div style={{ fontSize: '0.72rem', color: THEME.slateMuted, textTransform: 'uppercase', fontWeight: 800 }}>Monthly Rate</div>
                    <strong style={{ fontSize: '1.1rem', color: THEME.slateDark }}>{formatINR(selectedBooking.monthly_rate)}</strong>
                  </div>
                  <div style={{ background: THEME.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                    <div style={{ fontSize: '0.72rem', color: THEME.slateMuted, textTransform: 'uppercase', fontWeight: 800 }}>Security Deposit</div>
                    <strong style={{ fontSize: '1.1rem', color: THEME.emerald }}>{formatINR(selectedBooking.deposit)}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: THEME.slateMuted, textTransform: 'uppercase', fontWeight: 800 }}>Contract Duration</div>
                  <div style={{ fontWeight: 700, color: THEME.slateDark, marginTop: '2px' }}>
                    {selectedBooking.start_date} through {selectedBooking.end_date}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: THEME.slateMuted, textTransform: 'uppercase', fontWeight: 800 }}>Verification & Check</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span style={{ background: THEME.emeraldLight, color: THEME.emerald, padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                      KYC: {selectedBooking.kyc_status}
                    </span>
                    <span style={{ background: THEME.primaryLight, color: THEME.primary, padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                      Condition: {selectedBooking.condition_check}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    triggerToast(`Agreement #${selectedBooking.id} PDF sent to your email`);
                    setSelectedBooking(null);
                  }}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: '99px',
                    border: 'none', background: THEME.slateDark, color: '#ffffff',
                    fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem'
                  }}
                >
                  Download E-Signed Lease (PDF)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── SUBCOMPONENTS ── */

function SidebarTab({ icon, label, badge, badgeColor, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 12px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: active ? THEME.primaryLight : 'transparent',
        color: active ? THEME.primary : THEME.slateDark,
        fontSize: '0.88rem',
        fontWeight: active ? 800 : 600,
        cursor: 'pointer',
        transition: 'all 0.12s ease',
        textAlign: 'left',
        marginBottom: '2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: active ? THEME.primary : THEME.slateMuted }}>{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '2px 7px',
          borderRadius: '99px',
          backgroundColor: badgeColor ? `${badgeColor}18` : THEME.bg,
          color: badgeColor || THEME.slateMuted,
          border: `1px solid ${badgeColor ? `${badgeColor}33` : THEME.border}`,
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function KpiCard({ title, value, subtext, subtextColor, icon }) {
  return (
    <div style={{
      backgroundColor: THEME.surface,
      borderRadius: '20px',
      border: `1px solid ${THEME.border}`,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 15px -6px rgba(0,0,0,0.02)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: THEME.slateMuted, letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{ padding: '6px', borderRadius: '10px', backgroundColor: THEME.bg }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '1.85rem', fontWeight: 900, color: THEME.slateDark, fontFamily: 'var(--font-display, "Fraunces", serif)', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: subtextColor, marginTop: '6px' }}>
          {subtext}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)', letterSpacing: '-0.025em' }}>
          {title}
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.92rem', color: THEME.slateMuted }}>
          {subtitle}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function ProgressBar({ label, percentage, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
        <span style={{ fontWeight: 700, color: THEME.slateDark }}>{label}</span>
        <span style={{ fontWeight: 800, color: color }}>{percentage}%</span>
      </div>
      <div style={{ height: '8px', width: '100%', backgroundColor: THEME.bg, borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, borderRadius: '99px' }} />
      </div>
    </div>
  );
}

function StatusWidget({ label, count, color, desc }) {
  return (
    <div style={{
      backgroundColor: THEME.bg,
      borderRadius: '14px',
      border: `1px solid ${THEME.border}`,
      padding: '1.1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: THEME.slateDark }}>{label}</span>
        <span style={{
          fontSize: '1.25rem', fontWeight: 900, color: color,
          fontFamily: 'var(--font-display, "Fraunces", serif)',
        }}>
          {count}
        </span>
      </div>
      <span style={{ fontSize: '0.72rem', color: THEME.slateMuted, display: 'block' }}>
        {desc}
      </span>
    </div>
  );
}

function StateCapsule({ label, count, color, desc }) {
  return (
    <div style={{
      backgroundColor: THEME.bg,
      borderRadius: '14px',
      border: `1px solid ${THEME.border}`,
      padding: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
        <strong style={{ fontSize: '0.82rem', color: THEME.slateDark }}>{label}</strong>
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: THEME.slateDark, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
        {count}
      </div>
      <span style={{ fontSize: '0.72rem', color: THEME.slateMuted, marginTop: '2px', display: 'block' }}>
        {desc}
      </span>
    </div>
  );
}

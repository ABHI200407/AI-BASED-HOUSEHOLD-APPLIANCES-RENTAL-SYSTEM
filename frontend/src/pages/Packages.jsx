import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Check, CheckCircle2, ArrowRight, ShieldCheck,
  Truck, Sparkles, Layers, Clock, RotateCcw, Plus,
  Minus, ShoppingBag, Info, ChevronDown, Calculator,
  Home, Sofa, Bed, Tv, Zap
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

/* ── Packages Database ──────────────────────────────────────────────── */
const PACKAGES = [
  {
    id: 'first-key',
    title: 'The First-Key Kit',
    subtitle: 'Everything you need to move into your first 1 BHK without lifting a finger.',
    tag: '1 BHK Starter',
    basePrice: 2899,
    color: '#5c45fd',
    badge: 'Most Popular',
    heroImage: '/downloaded_images/combos/1bhk/1bhk_001_pid3990542.jpg',
    targetRooms: 'Living + Bedroom + Kitchen',
    idealFor: 'Solo professionals, young couples, 1st time movers',
    items: [
      {
        id: 'fk-bed',
        name: 'Queen Storage Bed & Mattress',
        category: 'Bedroom',
        desc: 'Engineered oak hydraulic storage bed with 6-inch orthopedic memory foam mattress.',
        image: '/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg',
        specs: ['160 × 200 cm', 'Dual hydraulic lift', 'Medium-firm ortho support'],
      },
      {
        id: 'fk-sofa',
        name: '3-Seater Comfort Sectional',
        category: 'Living Room',
        desc: 'Stain-resistant Olefin woven fabric sofa with high-density resilient foam cushions.',
        image: '/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg',
        specs: ['3-seater with chaise', 'Stain guard coating', 'Solid pine frame'],
      },
      {
        id: 'fk-fridge',
        name: 'Frost-Free Refrigerator (260L)',
        category: 'Appliances',
        desc: 'Double-door digital inverter refrigerator with deodorizer and rapid freeze chamber.',
        image: '/downloaded_images/appliances/refrigerator/refrigerator_001_pid9646742.jpg',
        specs: ['260 Litres', '3-Star Energy rated', 'Digital inverter motor'],
      },
      {
        id: 'fk-washer',
        name: 'Fully Automatic Washing Machine',
        category: 'Appliances',
        desc: '7.0 kg smart cycle top-load washing machine with built-in heater and aqua-saver.',
        image: '/downloaded_images/appliances/washing_machine/washing_machine_001_pid4440652.jpg',
        specs: ['7.0 kg capacity', '720 RPM spin', 'Anti-tangle pulsator'],
      },
    ],
    addOns: [
      { id: 'ao-tv', name: '43" 4K Smart TV', price: 699, image: '/downloaded_images/appliances/tv/tv_001_pid5202925.jpg' },
      { id: 'ao-micro', name: 'Convection Microwave (23L)', price: 299, image: '/downloaded_images/appliances/microwave/microwave_002_pid6636288.jpg' },
      { id: 'ao-dining', name: '2-Seater Dining Nook', price: 399, image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg' },
    ],
  },
  {
    id: 'homebody',
    title: 'The Homebody Edit',
    subtitle: 'The full 2 BHK residence. Two furnished bedrooms, full living room, and high-efficiency appliances.',
    tag: '2 BHK Complete',
    basePrice: 4799,
    color: '#059669',
    badge: 'Best Value',
    heroImage: '/downloaded_images/combos/2bhk/2bhk_001_pid6585598.jpg',
    targetRooms: 'Master Bed + Guest Bed + Living + Dining + Kitchen',
    idealFor: 'Couples, families, roommates sharing a 2BHK',
    items: [
      {
        id: 'hb-master-bed',
        name: 'Master Suite King Bed & Mattress',
        category: 'Master Bedroom',
        desc: 'Upholstered headboard king storage bed with 8-inch dual-comfort pocket spring mattress.',
        image: '/downloaded_images/bedroom/beds/beds_002_pid5644286.jpg',
        specs: ['180 × 200 cm', 'Pocket spring core', 'Soft-touch velvet headboard'],
      },
      {
        id: 'hb-guest-bed',
        name: 'Guest Queen Bed + Wardrobe Set',
        category: 'Guest Bedroom',
        desc: 'Minimalist queen platform bed with memory foam mattress plus 2-door engineered wood wardrobe.',
        image: '/downloaded_images/bedroom/beds/beds_003_pid7055750.jpg',
        specs: ['Queen size bed', '2-door modular wardrobe', 'Pre-assembled on site'],
      },
      {
        id: 'hb-dining',
        name: '4-Seater Solid Oak Dining Set',
        category: 'Dining',
        desc: 'Natural finish solid wood dining table with 4 cushioned ergonomic dining chairs.',
        image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg',
        specs: ['120 × 80 cm oak table', '4 cushioned chairs', 'Scratch resistant'],
      },
      {
        id: 'hb-sofa',
        name: 'L-Shaped Velvet Sectional + Coffee Table',
        category: 'Living Room',
        desc: 'Spacious sectional sofa with matching minimalist tempered-glass and wood coffee table.',
        image: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
        specs: ['Deep lounge seating', 'Matching coffee table', 'Removable cushion covers'],
      },
      {
        id: 'hb-tv',
        name: '43" 4K Ultra HD Smart TV',
        category: 'Living Room',
        desc: 'Bezel-less 4K HDR display with Dolby Audio, Google TV OS, and wall-mount installation included.',
        image: '/downloaded_images/appliances/tv/tv_001_pid5202925.jpg',
        specs: ['4K Ultra HD 3840×2160', 'Dolby Audio 24W', 'Pre-installed Netflix & Prime'],
      },
      {
        id: 'hb-appliances',
        name: 'Kitchen Pack: Inverter Fridge + 7.5kg Washer',
        category: 'Appliances',
        desc: '310L Frost-free double door inverter refrigerator paired with 7.5kg front-loading washing machine.',
        image: '/downloaded_images/appliances/refrigerator/refrigerator_001_pid9646742.jpg',
        specs: ['310L double door fridge', '7.5kg front-load washer', 'Free water connection setup'],
      },
    ],
    addOns: [
      { id: 'ao-ac', name: '1.5 Ton Inverter Split AC', price: 1199, image: '/downloaded_images/appliances/ac/ac_002_pid6914713.jpg' },
      { id: 'ao-wfh', name: 'Ergonomic Desk & Chair', price: 499, image: '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg' },
      { id: 'ao-purifier', name: 'RO + UV Water Purifier', price: 299, image: '/downloaded_images/appliances/water_purifier/water_purifier_001_pid31944365.jpg' },
    ],
  },
  {
    id: 'work-ready',
    title: 'The Work-Ready Kit',
    subtitle: 'A serious workstation setup for remote builders, founders, and creators.',
    tag: 'Studio / WFH',
    basePrice: 1299,
    color: '#0284c7',
    badge: 'WFH Essential',
    heroImage: '/downloaded_images/combos/bachelor/bachelor_001_pid1571453.jpg',
    targetRooms: 'Dedicated Office / Study Corner',
    idealFor: 'Remote engineers, founders, digital nomads, writers',
    items: [
      {
        id: 'wr-desk',
        name: 'Motorized Height-Adjustable Desk',
        category: 'Workstation',
        desc: 'Dual-motor sit-to-stand desk with 4 memory presets, anti-collision sensor, and walnut finish top.',
        image: '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg',
        specs: ['140 × 70 cm surface', 'Height: 70–120 cm', '100 kg weight capacity'],
      },
      {
        id: 'wr-chair',
        name: 'Ergonomic Breathable Mesh Chair',
        category: 'Workstation',
        desc: 'High-back lumbar support chair with 4D adjustable armrests, tilt limiter, and breathable elastomeric mesh.',
        image: '/downloaded_images/office_furniture/chairs/chairs_001_pid7792750.jpg',
        specs: ['Self-adjusting lumbar support', '4D armrests', 'BIFMA Class 4 gas lift'],
      },
      {
        id: 'wr-pedestal',
        name: '3-Drawer Lockable Metal Pedestal',
        category: 'Storage',
        desc: 'Under-desk mobile storage unit with central locking mechanism, stationary tray, and file drawer.',
        image: '/downloaded_images/storage/wardrobes/wardrobes_001_pid7587809.jpg',
        specs: ['Anti-tilt caster wheel', 'Central key lock', 'Fits standard filing folders'],
      },
      {
        id: 'wr-lamp',
        name: 'Architect LED Task Lamp & Cable Spine',
        category: 'Accessories',
        desc: 'Touch-dimmable warm/cool LED arm lamp with built-in 15W Qi wireless phone charger and magnetic cable tidy.',
        image: '/downloaded_images/lifestyle/apartments/apartments_001_pid4792297.jpg',
        specs: ['5 color temperatures', '15W wireless charger', 'Neat magnetic cable spine'],
      },
    ],
    addOns: [
      { id: 'ao-monitor', name: '27" 4K USB-C Hub Monitor', price: 899, image: '/downloaded_images/appliances/tv/tv_001_pid5202925.jpg' },
      { id: 'ao-ac', name: '1.0 Ton Split Inverter AC', price: 999, image: '/downloaded_images/appliances/ac/ac_002_pid6914713.jpg' },
      { id: 'ao-bed', name: 'Studio Single Daybed + Mattress', price: 799, image: '/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg' },
    ],
  },
  {
    id: 'executive-suite',
    title: 'The Executive 3 BHK Suite',
    subtitle: 'The ultimate luxury full-home experience. Three full bedroom suites, designer dining, and smart living.',
    tag: '3 BHK Suite',
    basePrice: 7499,
    color: '#d97706',
    badge: 'Luxury Edition',
    heroImage: '/downloaded_images/combos/3bhk/3bhk_001_pid6585598.jpg',
    targetRooms: '3 Bedrooms + Large Living + 6-Seat Dining + Full Kitchen',
    idealFor: 'Executive relocations, large families, luxury apartments',
    items: [
      {
        id: 'ex-master',
        name: 'Master Sanctuary King Suite',
        category: 'Master Bedroom',
        desc: 'Handcrafted solid wood king bed with 10-inch luxury hybrid latex mattress, dual nightstands, and dressing console.',
        image: '/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg',
        specs: ['King 180 × 200 cm', 'Organic latex layer', 'Dual matching nightstands'],
      },
      {
        id: 'ex-beds-2',
        name: '2 Additional Furnished Queen Bedrooms',
        category: 'Bedrooms 2 & 3',
        desc: 'Two complete bedroom suites with queen storage beds, orthopedic mattresses, and 3-door wardrobes.',
        image: '/downloaded_images/bedroom/beds/beds_002_pid5644286.jpg',
        specs: ['2 × Queen storage beds', '2 × Ortho mattresses', '2 × 3-door modular wardrobes'],
      },
      {
        id: 'ex-dining',
        name: '6-Seater Hardwood Dining Ensemble',
        category: 'Dining Room',
        desc: 'Handcrafted Sheesham wood dining table with 6 cushioned leatherette ergonomic dining chairs.',
        image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg',
        specs: ['180 × 90 cm dining table', '6 cushioned chairs', 'Hand-rubbed oil finish'],
      },
      {
        id: 'ex-living',
        name: 'Designer Italian Leather Sectional + 55" OLED TV',
        category: 'Living Room',
        desc: 'Top-grain leather sectional, nested marble coffee tables, and 55-inch 4K OLED Smart TV with Dolby Atmos soundbar.',
        image: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
        specs: ['Top-grain genuine leather', '55" OLED 120Hz display', 'Dolby Atmos soundbar included'],
      },
    ],
    addOns: [
      { id: 'ao-ac3', name: 'Dual Split Inverter ACs (1.5T x 2)', price: 1999, image: '/downloaded_images/appliances/ac/ac_002_pid6914713.jpg' },
      { id: 'ao-dish', name: '14-Place Setting Dishwasher', price: 599, image: '/downloaded_images/appliances/washing_machine/washing_machine_001_pid4440652.jpg' },
    ],
  },
];

const TENURES = [
  { months: 3, label: '3 Months', discount: 0.05, depositMult: 1.3, badge: '5% off' },
  { months: 6, label: '6 Months', discount: 0.10, depositMult: 1.1, badge: '10% off' },
  { months: 12, label: '12 Months', discount: 0.20, depositMult: 0.9, badge: '20% off' },
];

/* ── Main Component ─────────────────────────────────────────────────── */
export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const packParam = searchParams.get('pack') || 'first-key';
  const activePackage = useMemo(() => {
    return PACKAGES.find(p => p.id === packParam) || PACKAGES[0];
  }, [packParam]);

  const [tenureMonths, setTenureMonths] = useState(6);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [addedToast, setAddedToast] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // When switching packages, reset add-ons
  useEffect(() => {
    setSelectedAddOns({});
  }, [activePackage.id]);

  const tenure = useMemo(() => {
    return TENURES.find(t => t.months === tenureMonths) || TENURES[1];
  }, [tenureMonths]);

  // Price calculations
  const addOnsTotal = useMemo(() => {
    return Object.entries(selectedAddOns).reduce((sum, [id, selected]) => {
      if (!selected) return sum;
      const item = activePackage.addOns.find(a => a.id === id);
      return sum + (item ? item.price : 0);
    }, 0);
  }, [selectedAddOns, activePackage]);

  const rawBase = activePackage.basePrice + addOnsTotal;
  const discountedMonthly = Math.round(rawBase * (1 - tenure.discount));
  const gstAmount = Math.round(discountedMonthly * 0.18);
  const totalMonthlyWithGst = discountedMonthly + gstAmount;
  const securityDeposit = Math.round(discountedMonthly * tenure.depositMult);

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRentPackage = () => {
    const packageCartItem = {
      id: `pkg-${activePackage.id}-${Date.now()}`,
      name: `${activePackage.title} (${tenureMonths} Mo Plan)`,
      price: discountedMonthly,
      image: activePackage.heroImage,
      category: 'Rental Package',
      badge: activePackage.tag,
      description: activePackage.subtitle,
      tenure: tenureMonths,
      purchaseModel: 'rent',
    };

    addToCart(packageCartItem, { tenure: tenureMonths, purchaseModel: 'rent' });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2600);
  };

  const faqs = [
    {
      q: 'How does delivery and setup work for full packages?',
      a: 'We schedule a single delivery window (typically 24–48 hours after booking). Our white-glove logistics team unboxes, assembles, positions every piece in its designated room, cleans up packaging debris, and performs an electrical/functional safety test on appliances before handing over the keys.'
    },
    {
      q: 'Can I swap or modify items in this bundle?',
      a: 'Yes! You can customize add-ons directly on this page before ordering. If you need a specific dimension adjustment (e.g. swapping a King bed for a Queen), our onboarding concierge will coordinate that with you immediately after checkout with zero hassle.'
    },
    {
      q: 'How and when is the security deposit refunded?',
      a: 'Your security deposit is 100% refundable. When your tenure ends or you choose to move out, our team conducts a quick handover inspection. Normal wear and tear is fully forgiven under our Rentova Care policy. The deposit is credited back to your bank account or UPI within 24 hours.'
    },
    {
      q: 'What if I need to relocate to another city?',
      a: 'Rentova operates across 14+ major Indian cities. We offer 1-click inter-city transfer: we pick up your items at your old address, ship them, and install them into your new apartment at your destination city seamlessly.'
    }
  ];

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f9fafb',
      color: '#111827',
      fontFamily: 'var(--font-body, "Manrope", Inter, sans-serif)',
      paddingTop: '6rem',
      paddingBottom: '6rem',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(92, 69, 253, 0.08)', border: '1px solid rgba(92, 69, 253, 0.2)',
            borderRadius: '99px', padding: '6px 16px', marginBottom: '1.25rem',
            fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#5c45fd',
          }}>
            <Package size={14} /> Curated Room Packages
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 900, lineHeight: 1.08,
            fontFamily: 'var(--font-display, "Fraunces", serif)',
            letterSpacing: '-0.03em', marginBottom: '1rem', color: '#0f172a',
          }}>
            Walk into a finished home.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            No measuring tape, no weekend furniture showroom trips, no coordinating 10 delivery vans. Everything curated to fit together perfectly, delivered &amp; assembled in 48 hours.
          </p>
        </div>

        {/* ── Package Navigation Tabs ────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: '3rem',
        }}>
          {PACKAGES.map((pkg) => {
            const isSelected = pkg.id === activePackage.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSearchParams({ pack: pkg.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 24px', borderRadius: '99px',
                  border: `2px solid ${isSelected ? pkg.color : '#e2e8f0'}`,
                  background: isSelected ? pkg.color : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: isSelected ? `0 8px 20px -4px ${pkg.color}50` : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                <span>{pkg.title}</span>
                <span style={{
                  fontSize: '0.72rem', padding: '2px 8px', borderRadius: '99px',
                  background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                }}>
                  {pkg.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Active Package Hero Card ───────────────────────────────── */}
        <section style={{
          background: '#ffffff', borderRadius: '28px', border: '1px solid #e2e8f0',
          overflow: 'hidden', boxShadow: '0 16px 40px -12px rgba(0,0,0,0.06)',
          marginBottom: '3.5rem',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', alignItems: 'stretch' }}>
            
            {/* Left: Image Showcase */}
            <div style={{ position: 'relative', minHeight: '440px', overflow: 'hidden' }}>
              <img
                src={activePackage.heroImage}
                alt={activePackage.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)',
              }} />
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px' }}>
                <span style={{
                  background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
                  color: '#ffffff', padding: '6px 14px', borderRadius: '99px',
                  fontSize: '0.8rem', fontWeight: 800,
                }}>
                  {activePackage.tag}
                </span>
                <span style={{
                  background: activePackage.color, color: '#ffffff',
                  padding: '6px 14px', borderRadius: '99px',
                  fontSize: '0.8rem', fontWeight: 800,
                }}>
                  {activePackage.badge}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', color: '#ffffff' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.85, marginBottom: '4px' }}>Rooms Covered:</div>
                <strong style={{ fontSize: '1.15rem' }}>{activePackage.targetRooms}</strong>
              </div>
            </div>

            {/* Right: Overview & Pricing Panel */}
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: activePackage.color, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {activePackage.tag} Bundle
                </span>
                <h2 style={{
                  fontSize: '2.4rem', fontWeight: 900, margin: '0.5rem 0 0.75rem',
                  fontFamily: 'var(--font-display, "Fraunces", serif)', color: '#0f172a',
                }}>
                  {activePackage.title}
                </h2>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {activePackage.subtitle}
                </p>

                {/* Tenure Selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                    Choose Lease Duration:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {TENURES.map(t => (
                      <button
                        key={t.months}
                        onClick={() => setTenureMonths(t.months)}
                        style={{
                          padding: '10px 8px', borderRadius: '12px',
                          border: `2px solid ${tenureMonths === t.months ? activePackage.color : '#e2e8f0'}`,
                          background: tenureMonths === t.months ? `${activePackage.color}0c` : '#f8fafc',
                          color: tenureMonths === t.months ? activePackage.color : '#334155',
                          fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                          textAlign: 'center', transition: 'all 0.15s',
                          fontFamily: 'inherit',
                        }}
                      >
                        <div>{t.label}</div>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                          {t.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Breakdown Box */}
                <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Base Monthly Rent ({tenure.badge}):</span>
                    <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>₹{discountedMonthly.toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                    <span>18% GST (Rental SAC 997212):</span>
                    <span>+₹{gstAmount.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#059669' }}>
                    <span>Refundable Deposit ({tenure.depositMult}×):</span>
                    <strong>₹{securityDeposit.toLocaleString('en-IN')} (100% Refundable)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '1.6rem', color: activePackage.color, lineHeight: 1 }}>
                        ₹{totalMonthlyWithGst.toLocaleString('en-IN')}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '4px' }}>/mo (incl. GST)</span>
                    </div>
                    <Link to="/financials" style={{ fontSize: '0.78rem', color: '#5c45fd', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calculator size={13} /> View full tax breakdown
                    </Link>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleRentPackage}
                    style={{
                      flex: 1, background: activePackage.color, color: '#ffffff',
                      border: 'none', padding: '14px 24px', borderRadius: '14px',
                      fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: `0 8px 20px -4px ${activePackage.color}60`,
                      transition: 'transform 0.18s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <ShoppingBag size={18} /> Rent This Entire Package
                  </button>
                  <Link
                    to="/cart"
                    style={{
                      background: '#ffffff', color: '#1e293b',
                      border: '1px solid #cbd5e1', padding: '14px 20px', borderRadius: '14px',
                      fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    View Cart
                  </Link>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '0.78rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Truck size={14} color="#10b981" /> Free 48-hr setup
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={14} color="#10b981" /> Zero damage penalty
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <RotateCcw size={14} color="#10b981" /> Free annual swap
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Itemized Inventory Section ─────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                Inventory Checklist
              </span>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)', color: '#0f172a' }}>
                Everything included in {activePackage.title}
              </h3>
            </div>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
              {activePackage.items.length} Essential Pieces Included
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {activePackage.items.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(15,23,42,0.85)', color: '#ffffff',
                    padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    {item.category}
                  </span>
                  <span style={{
                    position: 'absolute', bottom: '10px', right: '10px',
                    background: '#ffffff', color: '#10b981',
                    padding: '3px 8px', borderRadius: '99px', fontSize: '0.72rem',
                    fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Check size={12} /> Included
                  </span>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55, margin: '0 0 12px' }}>
                    {item.desc}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.specs.map(spec => (
                      <li key={spec} style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: activePackage.color }} />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Optional Package Add-ons ─────────────────────────────────── */}
        <section style={{
          background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0',
          padding: '2.5rem', marginBottom: '4rem',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: activePackage.color, display: 'block', marginBottom: '4px' }}>
              Customise Your Move
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)', color: '#0f172a' }}>
              Optional Add-Ons for this Package
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0' }}>
              Need an air conditioner or an extra display? Bundle them in with zero extra deposit.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {activePackage.addOns.map(addon => {
              const isSelected = !!selectedAddOns[addon.id];
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddOn(addon.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px', borderRadius: '16px',
                    border: `2px solid ${isSelected ? activePackage.color : '#e2e8f0'}`,
                    background: isSelected ? `${activePackage.color}0a` : '#f8fafc',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  <img
                    src={addon.image}
                    alt={addon.name}
                    style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{addon.name}</div>
                    <div style={{ fontSize: '0.82rem', color: activePackage.color, fontWeight: 700, marginTop: '2px' }}>
                      +₹{addon.price}/month
                    </div>
                  </div>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: isSelected ? activePackage.color : '#ffffff',
                    border: `2px solid ${isSelected ? activePackage.color : '#cbd5e1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff',
                  }}>
                    {isSelected ? <Check size={16} /> : <Plus size={16} color="#64748b" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Value Comparison / Guarantee Strip ─────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '3rem 2.5rem', color: '#ffffff',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem', marginBottom: '4rem',
        }}>
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(92,69,253,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Truck size={20} color="#818cf8" />
            </div>
            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>48-Hour White-Glove Setup</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Delivery, room assembly, electrical testing, and packaging cleanup — 100% free of charge.
            </p>
          </div>

          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={20} color="#10b981" />
            </div>
            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Zero Damage Hassle</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Normal scratches and fabric scuffs are forgiven under Rentova Care. No surprise exit deductions.
            </p>
          </div>

          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <RotateCcw size={20} color="#38bdf8" />
            </div>
            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Free Annual Style Swaps</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Get tired of your sofa color or need a bigger dining table? Swap items once a year with zero penalty.
            </p>
          </div>

          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Calculator size={20} color="#f59e0b" />
            </div>
            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Rent vs. Buy Advantage</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Save up to ₹85,000 in upfront capital compared to purchasing retail furniture that depreciates 40%/yr.
            </p>
          </div>
        </section>

        {/* ── Package FAQs ───────────────────────────────────────────── */}
        <section style={{ maxWidth: '820px', margin: '0 auto 2rem' }}>
          <h3 style={{
            fontSize: '2rem', fontWeight: 900, textAlign: 'center',
            marginBottom: '2rem', fontFamily: 'var(--font-display, "Fraunces", serif)',
            color: '#0f172a',
          }}>
            Package Rental FAQs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{f.q}</span>
                  <ChevronDown
                    size={18}
                    color="#64748b"
                    style={{
                      transform: activeFaq === i ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
                {activeFaq === i && (
                  <div style={{ padding: '0 1.5rem 1.25rem', color: '#64748b', fontSize: '0.92rem', lineHeight: 1.65 }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── Floating Added Toast Notification ───────────────────────── */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '30px', right: '30px', zIndex: 99999,
              background: '#0f172a', color: '#ffffff',
              padding: '14px 22px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={16} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Package Added to Cart!</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{activePackage.title} ({tenureMonths} Mo)</div>
            </div>
            <Link
              to="/cart"
              style={{
                marginLeft: '10px', background: 'var(--accent, #5c45fd)', color: '#ffffff',
                padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem',
                fontWeight: 700, textDecoration: 'none',
              }}
            >
              Checkout →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

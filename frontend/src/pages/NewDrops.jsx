import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  TrendingUp, 
  Layers,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const API = 'http://localhost:8000';

export default function NewDrops() {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Interactive Live Countdown Timer for Next Drop
  const [countdown, setCountdown] = useState({ days: 3, hours: 14, mins: 28, secs: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNewDrops = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/appliances/?limit=24`);
        const items = res.data?.results || res.data || [];
        
        const formatted = items.map((app, idx) => ({
          id: app.id,
          name: app.name,
          category: app.category,
          brand: app.brand || '',
          price: app.monthly_rent ? Number(app.monthly_rent) : Math.round(app.price_per_day * 30 * 0.7),
          price_per_day: app.price_per_day,
          deposit: app.deposit,
          rating: String(app.rating ? Number(app.rating).toFixed(1) : '4.9'),
          badge: idx % 3 === 0 ? '✦ Drop Exclusive' : (idx % 2 === 0 ? '⚡ Batch 04' : '🔥 Just Landed'),
          tenure: 'from 1 month',
          location: app.location || 'Bengaluru &bull; NCR &bull; Mumbai',
          image: app.image_url || (app.images && app.images[0]) || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
          images: app.images || [],
          available: app.available !== false,
          description: app.description || '',
          serial: `DROP-2026-0${idx + 1}`,
        }));

        setDrops(formatted);
      } catch (err) {
        console.error('Failed to load new drops', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewDrops();
  }, []);

  const categories = [
    { name: 'All', icon: Sparkles, count: drops.length },
    { name: 'AC', icon: Zap, count: drops.filter(d => d.category?.toLowerCase() === 'ac').length },
    { name: 'Refrigerator', icon: Layers, count: drops.filter(d => d.category?.toLowerCase() === 'refrigerator').length },
    { name: 'Laptop', icon: TrendingUp, count: drops.filter(d => d.category?.toLowerCase() === 'laptop').length },
    { name: 'Appliances', icon: ShieldCheck, count: drops.filter(d => d.category?.toLowerCase() === 'appliances').length },
    { name: 'Furniture', icon: Flame, count: drops.filter(d => d.category?.toLowerCase() === 'furniture').length },
    { name: 'Electronics', icon: SlidersHorizontal, count: drops.filter(d => d.category?.toLowerCase() === 'electronics').length },
  ];

  let filteredDrops = selectedCategory === 'All'
    ? drops
    : drops.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  if (sortBy === 'lowest_rent') {
    filteredDrops = [...filteredDrops].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'rating') {
    filteredDrops = [...filteredDrops].sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  return (
    <main style={{
      backgroundColor: 'var(--bg, #f9fafb)',
      backgroundImage: `
        radial-gradient(circle at 10% 8%, rgba(92, 69, 253, 0.08) 0%, transparent 35%),
        radial-gradient(circle at 90% 18%, rgba(99, 102, 241, 0.06) 0%, transparent 35%),
        radial-gradient(circle at 50% 80%, rgba(92, 69, 253, 0.04) 0%, transparent 40%),
        radial-gradient(rgba(17, 24, 39, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 100% 100%, 28px 28px',
      color: 'var(--text, #111827)',
      minHeight: '100vh',
      paddingTop: '5rem',
      paddingBottom: '8rem',
      fontFamily: 'var(--font-body, "Manrope", Inter, sans-serif)',
      overflowX: 'hidden'
    }}>

      {/* ── TOP RUNNING MARQUEE TICKER ── */}
      <div style={{
        background: 'var(--accent-gradient, linear-gradient(135deg, #5c45fd 0%, #818cf8 145%))',
        color: '#ffffff',
        padding: '9px 0',
        fontWeight: 800,
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 16px rgba(92, 69, 253, 0.25)',
      }}>
        <div style={{ display: 'inline-block', animation: 'marquee 25s linear infinite' }}>
          ✦ AUTUMN DROP BATCH #04 NOW LIVE &bull; 24-HOUR WHITE-GLOVE DISPATCH &bull; 100% REFUNDABLE DYNAMIC DEPOSITS &bull; CRYO-INVERTER HARDWARE &bull; MODULAR SEATING CELLS &bull; ZERO DAMAGE PENALTY &bull;
          ✦ AUTUMN DROP BATCH #04 NOW LIVE &bull; 24-HOUR WHITE-GLOVE DISPATCH &bull; 100% REFUNDABLE DYNAMIC DEPOSITS &bull; CRYO-INVERTER HARDWARE &bull; MODULAR SEATING CELLS &bull; ZERO DAMAGE PENALTY &bull;
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        .creative-pill:hover {
          transform: translateY(-1px);
          border-color: #cbd5e1 !important;
          background-color: #f3f4f6 !important;
        }
        @media (max-width: 960px) {
          .rv-drops-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .rv-drops-hero-left, .rv-drops-hero-right {
            grid-column: span 1 !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 2rem 0' }}>
        
        {/* ── HERO RELEASE CONSOLE (Harmonized with Rentova Palette) ── */}
        <section style={{
          background: '#ffffff',
          borderRadius: '28px',
          border: '1px solid var(--rv-color-border, #e5e7eb)',
          padding: '3.5rem 3rem',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '3rem',
          boxShadow: '0 20px 45px rgba(15, 23, 32, 0.05)',
        }}>
          {/* Subtle Ambient Violet Blur */}
          <div style={{
            position: 'absolute',
            top: '-25%',
            right: '-10%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92, 69, 253, 0.09) 0%, rgba(129, 140, 248, 0.04) 50%, transparent 70%)',
            
            pointerEvents: 'none',
            animation: 'pulseGlow 6s ease-in-out infinite',
          }} />

          <div className="rv-drops-hero-grid" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'center' }}>
            
            {/* Left Column: Typography & Concept (7 cols) */}
            <div className="rv-drops-hero-left" style={{ gridColumn: 'span 7' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(92, 69, 253, 0.08)',
                border: '1px solid rgba(92, 69, 253, 0.22)',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
                color: 'var(--accent, #5c45fd)',
              }}>
                <Flame size={15} color="#5c45fd" /> Batch Release 04 &bull; Weekly Drop
              </div>

              <h1 style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-display, "Fraunces", Georgia, serif)',
                color: 'var(--text, #111827)',
              }}>
                New Drops<span style={{ color: 'var(--accent, #5c45fd)' }}>.</span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                lineHeight: 1.6,
                color: 'var(--text-soft, #4b5563)',
                marginBottom: '2rem',
                maxWidth: '600px',
                fontWeight: 400
              }}>
                High-performance climate units, cinematic OLED panels, and modular living cells sourced directly from laboratory test batches. Delivered with insured white-glove installation in 24 hours.
              </p>

              {/* Three Live Drop Pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid var(--rv-color-border, #e5e7eb)',
                  borderRadius: '16px',
                  padding: '1.1rem 1rem',
                }}>
                  <div style={{ color: 'var(--accent, #5c45fd)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>
                    ⚡ 24H DELIVERY
                  </div>
                  <strong style={{ fontSize: '1.05rem', color: '#111827', display: 'block' }}>White-Glove</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Zero setup charge</span>
                </div>

                <div style={{
                  background: '#f9fafb',
                  border: '1px solid var(--rv-color-border, #e5e7eb)',
                  borderRadius: '16px',
                  padding: '1.1rem 1rem',
                }}>
                  <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>
                    🛡️ DEPOSIT
                  </div>
                  <strong style={{ fontSize: '1.05rem', color: '#111827', display: 'block' }}>0.9× Monthly</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>100% Refundable</span>
                </div>

                <div style={{
                  background: '#f9fafb',
                  border: '1px solid var(--rv-color-border, #e5e7eb)',
                  borderRadius: '16px',
                  padding: '1.1rem 1rem',
                }}>
                  <div style={{ color: '#4f46e5', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>
                    🔄 ZERO DAMAGE
                  </div>
                  <strong style={{ fontSize: '1.05rem', color: '#111827', display: 'block' }}>Rentova Care</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Free wear protection</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Drop Countdown & Telemetry Box (5 cols) */}
            <div className="rv-drops-hero-right" style={{ gridColumn: 'span 5' }}>
              <div style={{
                background: '#fcfcfd',
                border: '1px solid var(--rv-color-border, #e5e7eb)',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(15, 23, 32, 0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent, #5c45fd)', letterSpacing: '0.08em' }}>
                    ✦ LIVE DROP TELEMETRY
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '3px 10px', borderRadius: '99px', fontWeight: 700 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Live Allocation
                  </span>
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Next Exclusive Drop Closes In:
                  </span>
                  {/* Countdown Clock Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                    <div style={{ background: '#ffffff', padding: '12px 4px', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(15, 23, 32, 0.04)' }}>
                      <strong style={{ fontSize: '1.6rem', color: '#111827', fontWeight: 900, display: 'block', lineHeight: 1 }}>
                        {String(countdown.days).padStart(2, '0')}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px', display: 'block' }}>Days</span>
                    </div>
                    <div style={{ background: '#ffffff', padding: '12px 4px', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(15, 23, 32, 0.04)' }}>
                      <strong style={{ fontSize: '1.6rem', color: '#111827', fontWeight: 900, display: 'block', lineHeight: 1 }}>
                        {String(countdown.hours).padStart(2, '0')}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px', display: 'block' }}>Hours</span>
                    </div>
                    <div style={{ background: '#ffffff', padding: '12px 4px', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(15, 23, 32, 0.04)' }}>
                      <strong style={{ fontSize: '1.6rem', color: '#111827', fontWeight: 900, display: 'block', lineHeight: 1 }}>
                        {String(countdown.mins).padStart(2, '0')}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px', display: 'block' }}>Mins</span>
                    </div>
                    <div style={{ background: 'rgba(92, 69, 253, 0.04)', padding: '12px 4px', borderRadius: '14px', border: '1px solid rgba(92, 69, 253, 0.28)', boxShadow: '0 2px 8px rgba(92, 69, 253, 0.08)' }}>
                      <strong style={{ fontSize: '1.6rem', color: 'var(--accent, #5c45fd)', fontWeight: 900, display: 'block', lineHeight: 1 }}>
                        {String(countdown.secs).padStart(2, '0')}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent, #5c45fd)', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px', display: 'block' }}>Secs</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--rv-color-border, #e5e7eb)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Drop Capacity:</span>
                    <strong style={{ display: 'block', fontSize: '1.05rem', color: '#111827' }}>24 Units Allocated</strong>
                  </div>
                  <Link
                    to="/journal"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--accent, #5c45fd)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Read Drop Monograph &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── FILTER & SORT CAPSULES (Rentova Style) ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--rv-color-border, #e5e7eb)',
        }}>
          {/* Category Capsules */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft, #4b5563)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> FILTER:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat.name;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={active ? '' : 'creative-pill'}
                  style={{
                    background: active ? '#111827' : '#ffffff',
                    color: active ? '#ffffff' : '#4b5563',
                    border: active ? '1px solid #111827' : '1px solid var(--rv-color-border, #e5e7eb)',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 4px 14px rgba(17, 24, 39, 0.15)' : 'none',
                  }}
                >
                  <Icon size={14} color={active ? '#ffffff' : '#64748b'} />
                  <span>{cat.name}</span>
                  {cat.count > 0 && (
                    <span style={{
                      fontSize: '0.7rem',
                      background: active ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
                      color: active ? '#ffffff' : '#64748b',
                      padding: '2px 7px',
                      borderRadius: '99px',
                      fontWeight: 800
                    }}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#111827',
                border: '1px solid var(--rv-color-border, #e5e7eb)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="newest">Latest Drops</option>
              <option value="lowest_rent">Lowest Rent</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* ── PRODUCTS GRID ── */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '2rem',
          }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                style={{
                  height: '380px',
                  borderRadius: '20px',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  animation: 'pulseGlow 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : filteredDrops.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px dashed #d1d5db',
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>
              No new drops currently available in this category
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Our certified mobile technicians release new batches every Friday.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                background: '#111827',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '99px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(17, 24, 39, 0.15)',
              }}
            >
              View All 24 Drops
            </button>
          </div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2.5rem',
            }}
          >
            <AnimatePresence>
              {filteredDrops.map((product) => (
                <div 
                  key={product.id}
                  style={{
                    position: 'relative',
                  }}
                >
                  {/* Serial Stamp */}
                  <div style={{
                    position: 'absolute',
                    top: '-9px',
                    right: '16px',
                    zIndex: 20,
                    background: '#111827',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '999px',
                    letterSpacing: '0.06em',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
                    {product.serial}
                  </div>

                  <ProductCard product={product} />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </main>
  );
}

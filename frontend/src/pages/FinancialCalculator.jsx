import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calculator, TrendingDown, ShieldCheck, IndianRupee,
  ArrowRight, CheckCircle2, Info, ToggleLeft, ToggleRight,
  Clock, Percent, BadgeCheck, ChevronDown
} from 'lucide-react';

/* ── Constants ────────────────────────────────────────────────────── */
const GST_RATE = 0.18;

const TENURE_OPTIONS = [
  { months: 1,  label: '1 Month',   discount: 0,    depositMult: 1.5,  badge: null },
  { months: 3,  label: '3 Months',  discount: 0.05, depositMult: 1.3,  badge: '5% off' },
  { months: 6,  label: '6 Months',  discount: 0.10, depositMult: 1.1,  badge: '10% off' },
  { months: 12, label: '12 Months', discount: 0.20, depositMult: 0.9,  badge: '20% off' },
  { months: 24, label: '24 Months', discount: 0.30, depositMult: 0.75, badge: '30% off' },
];

const SAMPLE_PRODUCTS = [
  { id: 'tv',    name: 'Smart 4K TV (55")',         baseRent: 1200, buyPrice: 55000 },
  { id: 'fridge', name: 'Double-Door Refrigerator', baseRent: 800,  buyPrice: 35000 },
  { id: 'ac',    name: 'Split AC (1.5 Ton)',         baseRent: 1500, buyPrice: 45000 },
  { id: 'sofa',  name: '3-Seater Sofa',             baseRent: 900,  buyPrice: 28000 },
  { id: 'bed',   name: 'King Bed + Mattress',        baseRent: 1100, buyPrice: 40000 },
  { id: 'wm',    name: 'Washing Machine (7 kg)',     baseRent: 650,  buyPrice: 22000 },
];

/* ── Small helper ─────────────────────────────────────────────────── */
const fmt = (n) => `₹${Number(Math.round(n)).toLocaleString('en-IN')}`;

/* ── Main Component ───────────────────────────────────────────────── */
export default function FinancialCalculator() {
  /* Tenure calculator state */
  const [baseRent, setBaseRent]   = useState(1200);
  const [tenureIdx, setTenureIdx] = useState(2);        // defaults to 6-month
  const [gstIncluded, setGstIncluded] = useState(true);

  /* Rent vs Buy state */
  const [selectedProduct, setSelectedProduct] = useState(SAMPLE_PRODUCTS[0]);
  const [customBaseRent, setCustomBaseRent]   = useState('');
  const [customBuyPrice, setCustomBuyPrice]   = useState('');
  const [rvbTenureMonths, setRvbTenureMonths] = useState(12);
  const [depreciationRate, setDepreciationRate] = useState(20); // % per year

  /* ── Tenure calc derived ──────────────────────────────────────────── */
  const tenure = TENURE_OPTIONS[tenureIdx];
  const discounted    = Math.round(baseRent * (1 - tenure.discount));
  const gstAmount     = Math.round(discounted * GST_RATE);
  const monthlyTotal  = gstIncluded ? discounted + gstAmount : discounted;
  const deposit       = Math.round(discounted * tenure.depositMult);
  const tenureTotal   = monthlyTotal * tenure.months;
  const savings       = Math.round(baseRent * tenure.months - discounted * tenure.months);

  /* ── Rent vs Buy derived ──────────────────────────────────────────── */
  const rvbBase    = parseFloat(customBaseRent) || selectedProduct.baseRent;
  const rvbBuyP   = parseFloat(customBuyPrice)  || selectedProduct.buyPrice;
  const rvbTenure = TENURE_OPTIONS.find(t => t.months === rvbTenureMonths) || TENURE_OPTIONS[2];

  const rvbDiscounted = Math.round(rvbBase * (1 - rvbTenure.discount));
  const rvbGst        = Math.round(rvbDiscounted * GST_RATE);
  const rvbMonthly    = gstIncluded ? rvbDiscounted + rvbGst : rvbDiscounted;
  const rvbDeposit    = Math.round(rvbDiscounted * rvbTenure.depositMult);
  const totalRentCost = rvbMonthly * rvbTenureMonths + rvbDeposit;

  // Buy depreciation: after N months the item is worth buyPrice * (1 - depRate/100)^(N/12)
  const residualValue  = Math.round(rvbBuyP * Math.pow(1 - depreciationRate / 100, rvbTenureMonths / 12));
  const effectiveBuyCost = rvbBuyP - residualValue; // money you "lose"
  const totalBuyCost   = rvbBuyP; // upfront

  const rentWins = totalRentCost < effectiveBuyCost;
  const saving   = Math.abs(effectiveBuyCost - totalRentCost);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: 'var(--font-body, "Manrope", Inter, sans-serif)',
      color: '#111827',
      paddingTop: '7rem',
      paddingBottom: '6rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

        {/* ── Page Header ──────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(92,69,253,0.08)', border: '1px solid rgba(92,69,253,0.2)',
            borderRadius: '99px', padding: '5px 16px', marginBottom: '1.5rem',
            fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#5c45fd',
          }}>
            <Calculator size={13} /> Dynamic Financials
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 900, lineHeight: 1.08,
            fontFamily: 'var(--font-display, "Fraunces", serif)',
            letterSpacing: '-0.03em', marginBottom: '1rem', color: '#0f172a',
          }}>
            Know exactly what you pay.
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
            Transparent pricing. See your tenure discount, 18% GST, refundable security deposit, and full cost breakdown — before you commit.
          </p>
        </div>

        {/* ── GST Toggle ───────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: '3rem',
          gap: '12px', alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Exclude GST</span>
          <button
            onClick={() => setGstIncluded(g => !g)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          >
            {gstIncluded
              ? <ToggleRight size={36} color="#5c45fd" />
              : <ToggleLeft  size={36} color="#94a3b8" />}
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: gstIncluded ? '#5c45fd' : '#64748b' }}>
            Include 18% GST
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SECTION 1 — Tenure Discount Calculator */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '2.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(92,69,253,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Percent size={18} color="#5c45fd" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Tenure Discount Calculator</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '2rem', marginLeft: '46px' }}>
            Longer tenure = bigger discount on your monthly rent + lower security deposit multiplier.
          </p>

          {/* Base Rent Slider */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#374151' }}>Base Monthly Rent (₹)</label>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#5c45fd' }}>{fmt(baseRent)}</span>
            </div>
            <input
              type="range" min={200} max={10000} step={50}
              value={baseRent}
              onChange={e => setBaseRent(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#5c45fd', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              <span>₹200</span><span>₹10,000</span>
            </div>
          </div>

          {/* Tenure Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: '0.75rem' }}>Select Tenure</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {TENURE_OPTIONS.map((t, i) => (
                <button
                  key={t.months}
                  onClick={() => setTenureIdx(i)}
                  style={{
                    position: 'relative', padding: '0.75rem 0.5rem',
                    borderRadius: '12px', border: `2px solid ${tenureIdx === i ? '#5c45fd' : '#e5e7eb'}`,
                    background: tenureIdx === i ? 'rgba(92,69,253,0.06)' : '#f9fafb',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.18s',
                    fontFamily: 'inherit',
                  }}
                >
                  {t.badge && (
                    <span style={{
                      position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                      background: '#10b981', color: '#fff', fontSize: '0.6rem',
                      fontWeight: 800, padding: '2px 7px', borderRadius: '99px', whiteSpace: 'nowrap',
                    }}>{t.badge}</span>
                  )}
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: tenureIdx === i ? '#5c45fd' : '#374151' }}>{t.label}</div>
                  {t.discount > 0 && (
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>-{t.discount * 100}%</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {/* Left — breakdown */}
            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '1.25rem' }}>Monthly Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Base rent', value: fmt(baseRent), sub: '' },
                  { label: `Tenure discount (${tenure.discount * 100}%)`, value: `-${fmt(baseRent * tenure.discount)}`, color: '#10b981', sub: '' },
                  { label: 'Discounted rent', value: fmt(discounted), bold: true, sub: '' },
                  ...(gstIncluded ? [{ label: 'GST @ 18%', value: `+${fmt(gstAmount)}`, color: '#f59e0b', sub: 'on rental service' }] : []),
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '8px', borderBottom: i < 2 ? '1px solid #e2e8f0' : 'none' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {row.label}
                      {row.sub && <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '4px' }}>({row.sub})</span>}
                    </span>
                    <strong style={{ fontSize: row.bold ? '1rem' : '0.875rem', color: row.color || '#111827' }}>{row.value}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '2px solid #5c45fd' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>You pay / month</span>
                  <strong style={{ fontSize: '1.5rem', color: '#5c45fd' }}>{fmt(monthlyTotal)}</strong>
                </div>
              </div>
            </div>

            {/* Right — summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  label: 'Refundable Security Deposit',
                  value: fmt(deposit),
                  sub: `${tenure.depositMult}× discounted rent — fully returned on exit`,
                  icon: ShieldCheck, iconColor: '#10b981', bg: '#ecfdf5',
                },
                {
                  label: `Total cost over ${tenure.months} month${tenure.months > 1 ? 's' : ''}`,
                  value: fmt(tenureTotal),
                  sub: `${fmt(monthlyTotal)} × ${tenure.months} months`,
                  icon: Clock, iconColor: '#5c45fd', bg: 'rgba(92,69,253,0.06)',
                },
                {
                  label: 'Savings vs monthly billing',
                  value: savings > 0 ? fmt(savings) : '₹0',
                  sub: savings > 0 ? 'compared to paying ₹/mo with no discount' : 'No discount at 1-month tenure',
                  icon: TrendingDown, iconColor: savings > 0 ? '#10b981' : '#94a3b8',
                  bg: savings > 0 ? '#f0fdf4' : '#f9fafb',
                },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} style={{ background: card.bg, borderRadius: '14px', padding: '1.1rem 1.25rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={card.iconColor} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>{card.label}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{card.value}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>{card.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GST note */}
          {gstIncluded && (
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#fffbeb', borderRadius: '10px', padding: '12px 14px', border: '1px solid #fde68a' }}>
              <Info size={15} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                <strong>GST (18%) is levied on the rental service charge</strong> as per Indian tax law (SAC 997212). The security deposit is GST-exempt as it is refundable. Input Tax Credit (ITC) is available for registered businesses.
              </p>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SECTION 2 — Rent vs Buy Calculator */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={18} color="#059669" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Rent vs. Buy Calculator</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '2rem', marginLeft: '46px' }}>
            Compare the true cost of renting vs. owning over your usage period, factoring in depreciation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            {/* Left — inputs */}
            <div>
              {/* Product picker */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: '0.6rem' }}>Select a product (or enter custom below)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SAMPLE_PRODUCTS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedProduct(p); setCustomBaseRent(''); setCustomBuyPrice(''); }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.6rem 1rem', borderRadius: '10px',
                        border: `2px solid ${selectedProduct.id === p.id && !customBaseRent ? '#5c45fd' : '#e5e7eb'}`,
                        background: selectedProduct.id === p.id && !customBaseRent ? 'rgba(92,69,253,0.05)' : '#f9fafb',
                        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.18s',
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{p.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{fmt(p.baseRent)}/mo · Buy {fmt(p.buyPrice)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', display: 'block', marginBottom: '5px' }}>Custom rent (₹/mo)</label>
                  <input
                    type="number" min="0" placeholder={`${rvbBase}`}
                    value={customBaseRent}
                    onChange={e => setCustomBaseRent(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#5c45fd'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', display: 'block', marginBottom: '5px' }}>Custom buy price (₹)</label>
                  <input
                    type="number" min="0" placeholder={`${rvbBuyP}`}
                    value={customBuyPrice}
                    onChange={e => setCustomBuyPrice(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#5c45fd'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              {/* Tenure */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#374151' }}>Usage period</label>
                  <strong style={{ color: '#5c45fd' }}>{rvbTenureMonths} months</strong>
                </div>
                <input
                  type="range" min={1} max={24} step={1}
                  value={rvbTenureMonths}
                  onChange={e => setRvbTenureMonths(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#5c45fd' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  <span>1 month</span><span>24 months</span>
                </div>
              </div>

              {/* Depreciation */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#374151' }}>
                    Annual depreciation rate
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '6px' }}>(standard for electronics)</span>
                  </label>
                  <strong style={{ color: '#f59e0b' }}>{depreciationRate}%/yr</strong>
                </div>
                <input
                  type="range" min={5} max={40} step={5}
                  value={depreciationRate}
                  onChange={e => setDepreciationRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#f59e0b' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  <span>5% (furniture)</span><span>40% (electronics)</span>
                </div>
              </div>
            </div>

            {/* Right — results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Rent cost card */}
              <div style={{
                borderRadius: '16px', padding: '1.5rem',
                border: `2px solid ${rentWins ? '#10b981' : '#e5e7eb'}`,
                background: rentWins ? '#f0fdf4' : '#f9fafb',
                position: 'relative',
              }}>
                {rentWins && (
                  <span style={{
                    position: 'absolute', top: '-11px', left: '1rem',
                    background: '#10b981', color: '#fff', fontSize: '0.65rem',
                    fontWeight: 800, padding: '2px 10px', borderRadius: '99px',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>Better choice</span>
                )}
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#10b981', marginBottom: '0.75rem' }}>Rent from Rentova</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {[
                    { l: `Monthly rent (${rvbTenure.discount * 100}% off)`, v: fmt(rvbDiscounted) },
                    ...(gstIncluded ? [{ l: 'GST 18%', v: `+${fmt(rvbGst)}` }] : []),
                    { l: `Security deposit (${rvbTenure.depositMult}× — refundable)`, v: fmt(rvbDeposit) },
                    { l: `Total over ${rvbTenureMonths} months`, v: fmt(totalRentCost), bold: true },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
                      <span style={{ color: '#64748b' }}>{r.l}</span>
                      <strong style={{ color: r.bold ? '#0f172a' : '#374151', fontSize: r.bold ? '1rem' : '0.85rem' }}>{r.v}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #d1fae5' }}>
                  <div style={{ fontSize: '0.75rem', color: '#059669' }}>✓ No capital locked · ✓ Deposit refunded · ✓ Free maintenance</div>
                </div>
              </div>

              {/* Buy cost card */}
              <div style={{
                borderRadius: '16px', padding: '1.5rem',
                border: `2px solid ${!rentWins ? '#5c45fd' : '#e5e7eb'}`,
                background: !rentWins ? 'rgba(92,69,253,0.04)' : '#f9fafb',
                position: 'relative',
              }}>
                {!rentWins && (
                  <span style={{
                    position: 'absolute', top: '-11px', left: '1rem',
                    background: '#5c45fd', color: '#fff', fontSize: '0.65rem',
                    fontWeight: 800, padding: '2px 10px', borderRadius: '99px',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>Better choice</span>
                )}
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5c45fd', marginBottom: '0.75rem' }}>Buy outright</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {[
                    { l: 'Purchase price (upfront)', v: fmt(rvbBuyP) },
                    { l: `Depreciation over ${rvbTenureMonths} months`, v: `-${fmt(rvbBuyP - residualValue)}` },
                    { l: `Resale value after ${rvbTenureMonths} months`, v: fmt(residualValue) },
                    { l: 'Effective cost (money lost)', v: fmt(effectiveBuyCost), bold: true },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
                      <span style={{ color: '#64748b' }}>{r.l}</span>
                      <strong style={{ color: r.bold ? '#0f172a' : '#374151', fontSize: r.bold ? '1rem' : '0.85rem' }}>{r.v}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>⚠ Capital locked upfront · Maintenance cost not included · Resale effort required</div>
                </div>
              </div>

              {/* Verdict */}
              <motion.div
                key={rentWins ? 'rent' : 'buy'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: rentWins ? '#0f172a' : '#0f172a',
                  borderRadius: '16px', padding: '1.25rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}
              >
                <BadgeCheck size={24} color={rentWins ? '#10b981' : '#818cf8'} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem', marginBottom: '2px' }}>
                    {rentWins ? 'Renting saves you more' : 'Buying is more economical'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {rentWins
                      ? `Save ${fmt(saving)} vs. owning over ${rvbTenureMonths} months`
                      : `Buying costs ${fmt(saving)} less than renting over ${rvbTenureMonths} months`}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: '#64748b' }}>Disclaimer:</strong> Calculations are illustrative estimates based on standard depreciation rates and GST at 18%. Actual depreciation depends on usage and brand. Security deposits are fully refundable subject to normal wear & tear. Rentova prices may vary by city, tenure and product category. This calculator does not constitute financial advice.
            </p>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem' }}>Ready to rent? Browse the full catalog and apply these savings instantly.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog" style={{
              background: '#0f172a', color: '#fff', textDecoration: 'none',
              padding: '0.9rem 2rem', borderRadius: '99px',
              fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px',
              transition: 'background 0.2s',
            }}>
              Browse Catalog <ArrowRight size={16} />
            </Link>
            <Link to="/kyc" style={{
              background: '#ffffff', color: '#0f172a', textDecoration: 'none',
              padding: '0.9rem 2rem', borderRadius: '99px',
              border: '1px solid #e5e7eb',
              fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <ShieldCheck size={16} color="#10b981" /> Complete KYC
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Building2, Users, Briefcase,
  ShieldCheck, CheckCircle2, Zap, Clock, RotateCcw,
  ChevronDown, Star, Phone, Mail, MapPin, Send,
  Layers, Home, Monitor, Sofa, Bed
} from 'lucide-react';

/* ── Data ────────────────────────────────────────────────────────────── */

const STATS = [
  { value: '2,400+', label: 'Offices equipped' },
  { value: '48 hrs', label: 'Avg. full-setup delivery' },
  { value: '₹0', label: 'Setup & installation charge' },
  { value: '14', label: 'Cities with business SLA' },
];

const BUNDLES = [
  {
    id: 'first-key',
    tag: '1 BHK',
    name: 'The First-Key Kit',
    price: '₹2,899',
    image: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
    items: ['Queen bed + mattress', 'Three-seater sofa', 'Refrigerator', 'Washer'],
    accent: '#5c45fd',
    num: '01',
    desc: 'Everything for a first move-in. No decisions, no comparison shopping.',
  },
  {
    id: 'homebody',
    tag: '2 BHK',
    name: 'The Homebody Edit',
    price: '₹4,799',
    image: '/downloaded_images/bedroom/full_room/full_room_001_pid6903157.jpg',
    items: ['Bedroom set', 'Living setup', 'Dining table', 'Kitchen appliances'],
    accent: '#059669',
    num: '02',
    desc: 'The complete home package for someone settling in for the long run.',
  },
  {
    id: 'work-ready',
    tag: 'Studio',
    name: 'The Work-Ready Kit',
    price: '₹1,299',
    image: '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg',
    items: ['Desk + chair', 'Storage cabinet', 'Task lighting', 'Fast swap support'],
    accent: '#dc2626',
    num: '03',
    desc: 'Compact, ergonomic, and instantly productive. Ideal for solo founders.',
  },
];

const ROOMS = [
  {
    id: 'living',
    room: 'LIVING ROOM',
    title: 'Living, but lighter',
    desc: 'Sofas, storage, and the pieces that turn an address into a place.',
    image: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
    link: '/catalog?category=Furniture',
  },
  {
    id: 'bedroom',
    room: 'BEDROOM',
    title: 'A softer landing',
    desc: 'Beds, mattresses, and storage that make the first night easy.',
    image: '/downloaded_images/bedroom/full_room/full_room_001_pid6903157.jpg',
    link: '/catalog?category=Furniture',
  },
  {
    id: 'dining',
    room: 'DINING',
    title: 'Made for company',
    desc: 'A considered dining setup, without the long-term commitment.',
    image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg',
    link: '/catalog?category=Furniture',
  },
  {
    id: 'study',
    room: 'STUDY',
    title: 'Work has a place',
    desc: 'Focused pieces for a serious workday in a small footprint.',
    image: '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg',
    link: '/catalog?category=Electronics',
  },
];

const PROCESS = [
  { step: '01', icon: Phone, title: 'Tell us your space', desc: 'Call or fill the form — share your floor plan, headcount, and timeline.' },
  { step: '02', icon: Layers, title: 'Get a custom bundle', desc: 'Our team curates a proposal with itemised pricing in under 24 hours.' },
  { step: '03', icon: Zap, title: 'We install everything', desc: 'White-glove setup: delivery, assembly, placement, and QA check included.' },
  { step: '04', icon: RotateCcw, title: 'Scale without pain', desc: 'Add, swap, or return items anytime. One dashboard, one point of contact.' },
];

const CLIENTS = [
  { name: 'Rahul A.', role: 'Operations, Series B Fintech', text: 'We furnished all 34 seats across two floors in 48 hours. Honestly the easiest vendor relationship we\'ve ever had.' },
  { name: 'Shruti M.', role: 'Co-founder, PropTech Startup', text: 'The flexible tenure was a game-changer. We scaled from 8 desks to 40 over 6 months without a single procurement headache.' },
  { name: 'Aditya P.', role: 'Facilities Head, Co-living Operator', text: 'Equipped 120 rooms across 3 properties. Dynamic deposits and zero damage clauses made the CFO very happy.' },
];

/* ── Component ───────────────────────────────────────────────────────── */
export default function Business() {
  const [activeBundle, setActiveBundle] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [form, setForm] = useState({ company: '', email: '', phone: '', units: '', type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    { q: 'What is the minimum order for business accounts?', a: 'We handle everything from a single executive desk to 500+ room deployments. No minimum unit requirement for a quote.' },
    { q: 'Do you offer volume pricing?', a: 'Yes — enterprise accounts get tiered discounts starting from 10 units, with dedicated SLA support and a named account manager.' },
    { q: 'How quickly can a large deployment happen?', a: 'Our logistics team can coordinate same-city deployments of up to 50 units within 48 hours. Cross-city bulk orders take 4–7 working days.' },
    { q: 'What happens if something breaks?', a: 'Zero damage liability under our Business Care plan. We repair or replace at our cost — no penalty invoices, ever.' },
    { q: 'Can we integrate with our procurement system?', a: 'Yes — we support GST invoicing, PO-based procurement, and custom approval workflows for larger organisations.' },
  ];

  return (
    <main style={{
      backgroundColor: '#f9fafb',
      color: '#111827',
      fontFamily: 'var(--font-body, "Manrope", Inter, sans-serif)',
      overflowX: 'hidden',
    }}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '92vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        paddingTop: '6rem',
        gap: 0,
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
      }}>
        {/* Left prose */}
        <div style={{ padding: '5rem 4rem 5rem 10vw' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(92, 69, 253, 0.08)', border: '1px solid rgba(92, 69, 253, 0.2)',
            borderRadius: '99px', padding: '5px 14px', marginBottom: '1.5rem',
            fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#5c45fd',
          }}>
            <Building2 size={13} /> The Rentova Way
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-display, "Fraunces", serif)',
            color: '#0f172a',
          }}>
            Your home isn't<br />a purchase order.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#4b5563',
            marginBottom: '2.5rem',
            maxWidth: '460px',
          }}>
            It's a living system. We designed Rentova around the moments that change it: a new job, a new city, a growing family, or simply the urge for more breathing room.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: '#0f172a', color: '#ffffff',
                border: 'none', padding: '0.9rem 1.8rem',
                borderRadius: '99px', fontWeight: 700, fontSize: '0.95rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(15,23,42,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.2)'; }}
            >
              Meet the movement <ArrowRight size={17} />
            </button>
            <Link to="/catalog" style={{
              background: 'transparent', color: '#0f172a',
              border: '1px solid #d1d5db', padding: '0.9rem 1.8rem',
              borderRadius: '99px', fontWeight: 600, fontSize: '0.95rem',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              Browse catalog
            </Link>
          </div>

          {/* Mini stats row */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <strong style={{ display: 'block', fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{s.value}</strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div style={{ height: '100%', minHeight: '92vh', position: 'relative', overflow: 'hidden' }}>
          <img
            src="/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg"
            alt="Rentova furnished home"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{
            position: 'absolute', bottom: '2rem', left: '2rem',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '99px', padding: '8px 18px',
            fontWeight: 700, fontSize: '0.85rem', color: '#0f172a',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            Built for a life in motion
          </div>
        </div>

        {/* Responsive override */}
        <style>{`
          @media (max-width: 900px) {
            .biz-hero-grid { grid-template-columns: 1fr !important; }
            .biz-hero-img { min-height: 50vh !important; }
          }
          .biz-bundle-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.1) !important; }
          .biz-room-card:hover .biz-room-img { transform: scale(1.06); }
          .biz-process-step:hover { border-color: #5c45fd !important; }
        `}</style>
      </section>

      {/* ── DONE-FOR-YOU BUNDLES ──────────────────────────────────────── */}
      <section style={{ background: '#f9fafb', padding: '6rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end', marginBottom: '3.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
                Done-For-You Rooms
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, margin: 0, lineHeight: 1.1, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                Not in the mood<br />to make 47 decisions?
              </h2>
            </div>
            <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              Pick a starting point. We've assembled the pieces people need together most, and made every bundle easy to adjust.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {BUNDLES.map((b) => (
              <article
                key={b.id}
                className="biz-bundle-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  position: 'relative',
                }}
                onClick={() => setActiveBundle(activeBundle === b.id ? null : b.id)}
              >
                {/* Image */}
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img src={b.image} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: 'rgba(255,255,255,0.95)', color: '#111827',
                    padding: '4px 10px', borderRadius: '6px',
                    fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em',
                  }}>{b.tag}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{b.name}</h3>
                    <span style={{ color: b.accent, fontWeight: 800, fontSize: '1rem' }}>{b.price}/mo</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>{b.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {b.items.map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: '#374151' }}>
                        <CheckCircle2 size={14} color="#10b981" /> {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5c45fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      See what's inside <ArrowRight size={14} />
                    </span>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>{b.num}</span>
                  </div>
                </div>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {activeBundle === b.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: '#0f172a', color: '#ffffff',
                        borderRadius: '20px', padding: '2rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        zIndex: 10,
                      }}
                    >
                      <div>
                        <span style={{ color: b.accent, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{b.tag} Bundle</span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.5rem 0 0.75rem' }}>{b.name}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>{b.desc}</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {b.items.map(item => (
                            <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                              <CheckCircle2 size={15} color={b.accent} /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                        <button
                          onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                          style={{
                            flex: 1, background: b.accent, color: '#fff',
                            border: 'none', padding: '10px', borderRadius: '10px',
                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                          }}
                        >
                          Get This Bundle
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveBundle(null); }}
                          style={{
                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                            border: '1px solid rgba(255,255,255,0.15)', padding: '10px 16px',
                            borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROOM EXPLORER GRID ───────────────────────────────────────── */}
      <section style={{ background: '#0f172a', padding: '6rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
              Explore by room
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, margin: 0, color: '#f8fafc', fontFamily: 'var(--font-display, "Fraunces", serif)', lineHeight: 1.1 }}>
              Every room. One subscription.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {ROOMS.map((room) => (
              <Link
                key={room.id}
                to={room.link}
                className="biz-room-card"
                style={{
                  position: 'relative', height: '300px', borderRadius: '20px',
                  overflow: 'hidden', display: 'block', textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={room.image}
                  alt={room.title}
                  className="biz-room-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' }}
                />
                {/* Dark overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)',
                }} />
                {/* Text */}
                <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.75rem', right: '1.75rem', color: '#ffffff' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, display: 'block', marginBottom: '6px' }}>
                    {room.room}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 6px', fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
                    {room.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: '0 0 12px', lineHeight: 1.5 }}>{room.desc}</p>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
                    Explore the room <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '6rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
              The process
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
              From contract to couch in 48 hours.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {PROCESS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.step}
                  className="biz-process-step"
                  style={{
                    background: '#f9fafb',
                    borderRadius: '20px',
                    padding: '2rem 1.5rem',
                    border: '1px solid #e5e7eb',
                    transition: 'border-color 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: '-12px', right: '-8px', fontSize: '5rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
                    {p.step}
                  </div>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(92,69,253,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <Icon size={22} color="#5c45fd" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.6rem', color: '#0f172a' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                  {i < PROCESS.length - 1 && (
                    <div style={{ position: 'absolute', right: '-12px', top: '50%', zIndex: 5 }}>
                      <ArrowRight size={18} color="#d1d5db" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLIENT TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ background: '#f9fafb', padding: '6rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
              What clients say
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, margin: 0, fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
              Teams that moved faster with Rentova.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {CLIENTS.map((c, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '20px',
                padding: '2rem', border: '1px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#374151', margin: '0 0 1.5rem', fontStyle: 'italic' }}>
                  "{c.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5c45fd, #818cf8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '1rem',
                  }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>{c.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '6rem 0' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '3rem', textAlign: 'center', fontFamily: 'var(--font-display, "Fraunces", serif)' }}>
            Common questions.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    padding: '1.25rem 0', cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', lineHeight: 1.4 }}>{f.q}</span>
                  <motion.div animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={20} color="#64748b" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7, paddingBottom: '1.25rem', margin: 0 }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE QUOTE FORM ─────────────────────────────────────── */}
      <section ref={formRef} style={{ background: '#0f172a', padding: '7rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

          {/* Left info */}
          <div style={{ color: '#f8fafc' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
              Enterprise & B2B
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, margin: '0 0 1.5rem', fontFamily: 'var(--font-display, "Fraunces", serif)', lineHeight: 1.1 }}>
              Ready to scale?
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Get in touch with our enterprise team for volume discounts, dedicated account management, and custom procurement built around your workflow.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Dedicated Account Manager',
                'Custom procurement — if we don\'t have it, we\'ll source it',
                'Volume-based tiered pricing from 10+ units',
                'GST invoicing & PO-based procurement',
                'Zero damage liability under Business Care',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} /> {item}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="tel:+918000000000" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                <Phone size={16} /> +91 80000 00000 (Business line)
              </a>
              <a href="mailto:business@rentova.in" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                <Mail size={16} /> business@rentova.in
              </a>
            </div>
          </div>

          {/* Right form */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem' }}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>Request received!</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Our enterprise team will reach out within 4 business hours with a personalised proposal and pricing.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '1.5rem', background: 'none', border: '1px solid #e5e7eb', padding: '8px 20px', borderRadius: '99px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a' }}>Request a Business Quote</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.75rem' }}>Response within 4 business hours. No commitment required.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text" required
                    placeholder="Company Name *"
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#5c45fd'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                      type="email" required
                      placeholder="Work Email *"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#5c45fd'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#5c45fd'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', background: '#ffffff', cursor: 'pointer' }}
                    >
                      <option value="">Requirement type</option>
                      <option>Office / Startup</option>
                      <option>Co-living / Real Estate</option>
                      <option>Events &amp; Staging</option>
                      <option>Corporate Housing</option>
                      <option>Other</option>
                    </select>
                    <input
                      type="number" min="1"
                      placeholder="No. of units / seats"
                      value={form.units}
                      onChange={e => setForm({ ...form, units: e.target.value })}
                      style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#5c45fd'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Tell us more — timeline, cities, specific requirements..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#5c45fd'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#0f172a', color: '#ffffff',
                      border: 'none', padding: '1rem',
                      borderRadius: '12px', fontWeight: 700,
                      fontSize: '0.95rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'background 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
                  >
                    <Send size={16} /> Request Enterprise Quote
                  </button>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                    No spam. A human will contact you — not a bot.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}

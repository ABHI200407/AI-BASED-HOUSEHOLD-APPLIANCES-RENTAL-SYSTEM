import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkles, 
  RotateCcw,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Journal() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' | 'prev'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState('sheet'); // 'sheet' | 'full'
  const containerRef = useRef(null);

  // Synthetic Realistic Newsprint Paper Flutter Sound using Web Audio API
  const playPaperRustle = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const bufferSize = Math.floor(ctx.sampleRate * 0.22); // 220ms duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        // Pink-tinged white noise with envelope decay
        const white = Math.random() * 2 - 1;
        const decay = Math.exp(-i / (ctx.sampleRate * 0.065));
        output[i] = white * decay;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Filter to simulate paper whoosh and crisp fiber flutter
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.2);
      filter.Q.value = 2.4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (e) {
      // Audio context may be restricted by autoplay policy until user gesture
    }
  };

  const totalPages = 6;

  const goToPage = (pageIndex, dir = null) => {
    if (pageIndex === currentPage || isFlipping) return;
    if (pageIndex < 0 || pageIndex >= totalPages) return;

    const direction = dir || (pageIndex > currentPage ? 'next' : 'prev');
    setFlipDirection(direction);
    setIsFlipping(true);
    playPaperRustle();

    setTimeout(() => {
      setCurrentPage(pageIndex);
    }, 280);

    setTimeout(() => {
      setIsFlipping(false);
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1, 'next');
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1, 'prev');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);

  const sections = [
    { id: 0, tag: 'SHEET 01', title: 'THE BROADSHEET EDITORIAL', sub: 'The Architecture of Non-Possession' },
    { id: 1, tag: 'SHEET 02', title: 'THE DEEP MACHINE', sub: 'Thermodynamics of Silent Luxury' },
    { id: 2, tag: 'SHEET 03', title: 'SPATIAL METRIC & HABITATION', sub: 'The 320 Sq Ft Micro-Studio' },
    { id: 3, tag: 'SHEET 04', title: 'THE CHURNLESS MANIFESTO', sub: 'Depreciation as a 20th Century Relic' },
    { id: 4, tag: 'SHEET 05', title: 'LABORATORY ARCHIVE', sub: 'Martindale Rubs & Molecular Recovery' },
    { id: 5, tag: 'SHEET 06', title: 'COLOPHON & CLASSIFIEDS', sub: 'Metropolitan Circular Fleet Register' },
  ];

  return (
    <main style={{ 
      backgroundColor: '#ede9e0', 
      backgroundImage: 'radial-gradient(#dcd6c8 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      color: '#111111', 
      fontFamily: '"Newsreader", "Times New Roman", Georgia, serif',
      paddingTop: '5rem',
      paddingBottom: '8rem',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <style>{`
        @keyframes paperSlideNext {
          0% {
            opacity: 0;
            transform: translateX(36px);
          }
          40% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes paperSlidePrev {
          0% {
            opacity: 0;
            transform: translateX(-36px);
          }
          40% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes paperSweepNext {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        @keyframes paperSweepPrev {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .newspaper-dogear-next:hover {
          background: linear-gradient(135deg, transparent 35%, #cfc5b0 35%) !important;
          box-shadow: -8px 8px 16px rgba(0,0,0,0.22) !important;
          transform: scale(1.1);
        }
        .newspaper-dogear-prev:hover {
          background: linear-gradient(225deg, transparent 35%, #cfc5b0 35%) !important;
          box-shadow: 8px 8px 16px rgba(0,0,0,0.22) !important;
          transform: scale(1.1);
        }
        .sheet-tab:hover {
          background: #333 !important;
          color: #fff !important;
        }
      `}</style>
      
      {/* Newspaper Top Bar & Interactive Navigation */}
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto 1.5rem',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontFamily: 'Inter, Helvetica, sans-serif'
      }}>
        {/* Breadcrumb / Issue Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span style={{ background: '#111', color: '#fff', padding: '4px 10px', borderRadius: '4px' }}>
            RENTOVA BROADSHEET
          </span>
          <span style={{ color: '#555' }}>
            VOL. IV &bull; ISSUE NO. 48 &bull; AUTUMN-WINTER
          </span>
        </div>

        {/* Page Switcher Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(v => !v)}
            title={soundEnabled ? 'Mute paper rustle' : 'Enable paper rustle'}
            style={{
              background: soundEnabled ? '#111' : '#fff',
              color: soundEnabled ? '#fff' : '#111',
              border: '1px solid #111',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{soundEnabled ? 'Paper Audio: ON' : 'Audio: OFF'}</span>
          </button>

          {/* Prev Sheet Button */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            style={{
              background: '#fff',
              border: '1px solid #111',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 0 ? 0.4 : 1,
              boxShadow: '2px 2px 0 #111'
            }}
          >
            <ArrowLeft size={14} /> PREV SHEET
          </button>

          {/* Current Page Pill */}
          <span style={{
            background: '#111',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '0.05em'
          }}>
            SHEET 0{currentPage + 1} / 0{totalPages}
          </span>

          {/* Next Sheet Button */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            style={{
              background: '#fff',
              border: '1px solid #111',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages - 1 ? 0.4 : 1,
              boxShadow: '2px 2px 0 #111'
            }}
          >
            NEXT SHEET <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Sheet Tabs Bar */}
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto 2rem',
        padding: '0 2rem',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        fontFamily: 'Inter, Helvetica, sans-serif'
      }}>
        {sections.map((sec) => (
          <button
            key={sec.id}
            className="sheet-tab"
            onClick={() => goToPage(sec.id)}
            style={{
              flex: '1 0 190px',
              textAlign: 'left',
              padding: '10px 14px',
              border: '1px solid #111',
              borderRadius: '4px',
              background: currentPage === sec.id ? '#111' : '#faf8f3',
              color: currentPage === sec.id ? '#fff' : '#111',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: currentPage === sec.id ? 'inset 0 2px 4px rgba(0,0,0,0.4)' : '2px 2px 0 rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.7, letterSpacing: '0.05em' }}>
              {sec.tag}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {sec.title}
            </div>
          </button>
        ))}
      </div>

      {/* ── 3D NEWSPAPER BROADSHEET STAGE ── */}
      <div 
        ref={containerRef}
        style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 1.5rem',
          perspective: '2800px',
          position: 'relative'
        }}
      >
        {/* Newspaper Page Body with Smooth Paper Physics */}
        <div 
          style={{
            background: '#faf8f3',
            color: '#111',
            borderRadius: '4px',
            border: '2px solid #111',
            boxShadow: isFlipping
              ? '0 12px 30px rgba(0, 0, 0, 0.15), 4px 4px 0 #111'
              : '0 25px 60px -15px rgba(28, 25, 23, 0.22), 8px 8px 0 #111',
            position: 'relative',
            transform: isFlipping ? 'scale(0.996)' : 'scale(1)',
            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
            minHeight: '1200px',
            padding: '3rem 3.5rem 5rem',
            overflow: 'hidden'
          }}
        >
          {/* Authentic Newsprint Center Crease & Texture Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.04) 0%, transparent 60px, transparent calc(100% - 60px), rgba(0,0,0,0.04) 100%),
              linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40px, transparent calc(100% - 40px), rgba(0,0,0,0.06) 100%)
            `,
            zIndex: 1
          }} />

          {/* Smooth Paper Turning Sweep Effect (Paper Leaf Turning across the page) */}
          {isFlipping && (
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 99,
                background: flipDirection === 'next'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 35%, rgba(255,255,255,0.85) 50%, rgba(0,0,0,0.2) 65%, transparent 100%)'
                  : 'linear-gradient(270deg, transparent 0%, rgba(0,0,0,0.08) 35%, rgba(255,255,255,0.85) 50%, rgba(0,0,0,0.2) 65%, transparent 100%)',
                animation: flipDirection === 'next' 
                  ? 'paperSweepNext 0.52s cubic-bezier(0.25, 1, 0.5, 1) forwards' 
                  : 'paperSweepPrev 0.52s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              }} 
            />
          )}

          {/* BROADSHEET MASTHEAD & WEATHER EAR (Appears on every sheet) */}
          <div style={{
            borderBottom: '4px double #111',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            fontFamily: 'Inter, Helvetica, sans-serif'
          }}>
            {/* Top Ear Ribbon */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #111',
              paddingBottom: '6px',
              marginBottom: '1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <div>
                <span>METEOROLOGY: BENGALURU 23°C CRISP &bull; ZÜRICH 11°C CLEAR &bull; NCR 26°C AUTUMN</span>
              </div>
              <div>
                <span>FREE CIRCULATION ISSUE &bull; ISSN 2891-9402 &bull; DEPOSIT REVERSAL GUARANTEED</span>
              </div>
            </div>

            {/* Main Monumental Masthead */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h1 style={{
                  fontSize: 'clamp(3.5rem, 8vw, 8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.85,
                  margin: 0,
                  fontFamily: 'var(--rv-font-display), "Fraunces", serif',
                  textTransform: 'uppercase'
                }}>
                  Rentova Journal.
                </h1>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginTop: '0.5rem', color: '#333' }}>
                  The International Gazette of Circular Habitation &amp; Spatial Logistics
                </span>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.5 }}>
                <span style={{ background: '#dc2626', color: '#fff', padding: '3px 8px', fontWeight: 900, textTransform: 'uppercase', display: 'inline-block', marginBottom: '4px' }}>
                  {sections[currentPage].tag}
                </span>
                <div style={{ textTransform: 'uppercase', color: '#111' }}>
                  {sections[currentPage].title}
                </div>
                <div style={{ color: '#666', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                  Folio &bull; Autumn 2026 Archive Edition
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              PAGE CONTENT ROUTER (SHEETS 01 TO 06)
             ═══════════════════════════════════════════════════════════ */}

          {/* ── SHEET 01: FRONT BROADSHEET & MASTER ESSAY ── */}
          {currentPage === 0 && (
            <div key={currentPage} style={{ animation: `${flipDirection === 'next' ? 'paperSlideNext' : 'paperSlidePrev'} 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards` }}>
              {/* Master Lead Story Headline */}
              <div style={{ borderBottom: '2px solid #111', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  SPECIAL INVESTIGATIVE REPORT &bull; SPATIAL PARADIGM SHIFT
                </div>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.92,
                  margin: '0 0 1rem',
                  fontFamily: 'var(--rv-font-display), "Fraunces", serif'
                }}>
                  The Architecture of Non-Possession: Why Permanent Ownership is Obsolete in the Modern Metropolis.
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontStyle: 'italic', color: '#444' }}>
                  <span>By Dr. Julian Vance &bull; Department of Urban Metabolism, Zürich &bull; Bengaluru Field Office</span>
                  <span>Photographs by Hélène Koster &bull; 6 Min Broadside Read</span>
                </div>
              </div>

              {/* 3-Column Newspaper Spread with Rule of Thirds Hero */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
                {/* Column 1: Lead Commentary (3 cols) */}
                <div style={{ gridColumn: 'span 3', borderRight: '1px solid #ddd', paddingRight: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
                  <p style={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.35, marginBottom: '1.25rem' }}>
                    <span style={{ float: 'left', fontSize: '3.8rem', lineHeight: 0.8, paddingRight: '10px', fontWeight: 900, fontFamily: 'var(--rv-font-display)' }}>T</span>
                    he classical 20th-century covenant that equated adult civic status with heavy static property has suffered catastrophic fracture in metropolitan centers.
                  </p>
                  <p style={{ marginBottom: '1rem', color: '#222' }}>
                    Between rapid occupational reallocation, escalating relocation frequency, and high spatial rent costs, fixed capital in furniture and appliances has mutated from store-of-value into pure urban friction.
                  </p>
                  <div style={{ padding: '1rem', background: '#f0ece1', borderLeft: '4px solid #111', margin: '1.5rem 0', fontStyle: 'italic' }}>
                    &ldquo;When a tenant is forced to liquidate heavy mahogany or sell an un-swappable refrigerator at 70% loss, they are not merely paying moving fees; they are submitting to spatial inertia.&rdquo;
                  </div>
                  <p style={{ fontSize: '0.95rem', color: '#444' }}>
                    Enter the cyclical habitation layer: high-durability modular appliances and seating designed for endless reassignment without structural degradation.
                  </p>
                </div>

                {/* Column 2: Large Visual Feature with Photographic Calipers (6 cols) */}
                <div style={{ gridColumn: 'span 6', position: 'relative' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #111', aspectRatio: '16/10', backgroundColor: '#e2e8f0' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80" 
                      alt="Aero Modular Sofa" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.2)' }} 
                    />
                    
                    {/* Architectural Rule of Thirds Crosshairs */}
                    <div style={{ position: 'absolute', top: '33.33%', left: 0, width: '100%', borderTop: '1px dashed rgba(255,255,255,0.5)' }} />
                    <div style={{ position: 'absolute', top: '66.66%', left: 0, width: '100%', borderTop: '1px dashed rgba(255,255,255,0.5)' }} />
                    <div style={{ position: 'absolute', left: '33.33%', top: 0, height: '100%', borderLeft: '1px dashed rgba(255,255,255,0.5)' }} />
                    <div style={{ position: 'absolute', left: '66.66%', top: 0, height: '100%', borderLeft: '1px dashed rgba(255,255,255,0.5)' }} />
                    
                    <div style={{ position: 'absolute', top: '33.33%', left: '33.33%', width: '10px', height: '10px', transform: 'translate(-50%, -50%)', border: '2px solid #fff', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', top: '66.66%', left: '66.66%', width: '10px', height: '10px', transform: 'translate(-50%, -50%)', border: '2px solid #fff', borderRadius: '50%' }} />

                    {/* Stamp */}
                    <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: '#111', color: '#fff', padding: '6px 14px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      FIGURE 1.0 &bull; MODULAR LIVING CELL
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid #111', paddingBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px', fontFamily: 'var(--rv-font-display)' }}>
                        Aero High-Density Modular Lounge
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>
                        Memory-foam core with 100,000-rub stain-resistant Olefin textile. Configurable from 2-seater to corner chaise in 180 seconds.
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, display: 'block' }}>₹120<span style={{ fontSize: '0.85rem', color: '#666' }}>/mo</span></span>
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>0.9× Deposit on 12M</span>
                    </div>
                  </div>

                  {/* Secondary Story below image */}
                  <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.95rem', lineHeight: 1.55 }}>
                    <div>
                      <h4 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '6px' }}>The Logistics Pipeline</h4>
                      <p style={{ color: '#333' }}>
                        Each unit enters the metropolitan grid fully pre-treated and authenticated. Reverse-logistics dispatch tickets execute under 24 hours when contracts transition.
                      </p>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '6px' }}>Zero-Friction Liquidity</h4>
                      <p style={{ color: '#333' }}>
                        Tenants retain 100% of their dynamic deposit upon simulation check. The system handles all wear recovery in automated depot hubs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 3: The Front Page Telegraph Wire & Index (3 cols) */}
                <div style={{ gridColumn: 'span 3', borderLeft: '1px solid #ddd', paddingLeft: '1.5rem' }}>
                  <div style={{ background: '#111', color: '#fff', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                    IN THIS BROADSHEET EDITION
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                    <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '0.75rem', cursor: 'pointer' }} onClick={() => goToPage(1)}>
                      <strong style={{ display: 'block', fontSize: '0.8rem', color: '#dc2626', textTransform: 'uppercase' }}>Sheet 02 &bull; Monograph</strong>
                      <span style={{ fontWeight: 800, fontSize: '1rem', display: 'block', margin: '2px 0' }}>Thermodynamics of Silent Luxury</span>
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>Cryo-inverter refrigeration operating under 36 dB ambient threshold.</span>
                    </div>

                    <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '0.75rem', cursor: 'pointer' }} onClick={() => goToPage(2)}>
                      <strong style={{ display: 'block', fontSize: '0.8rem', color: '#dc2626', textTransform: 'uppercase' }}>Sheet 03 &bull; Habitation</strong>
                      <span style={{ fontWeight: 800, fontSize: '1rem', display: 'block', margin: '2px 0' }}>The 320 Sq Ft Micro-Studio</span>
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>How 4 interlocking modules replace an entire three-bedroom apartment layout.</span>
                    </div>

                    <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '0.75rem', cursor: 'pointer' }} onClick={() => goToPage(3)}>
                      <strong style={{ display: 'block', fontSize: '0.8rem', color: '#dc2626', textTransform: 'uppercase' }}>Sheet 04 &bull; Economics</strong>
                      <span style={{ fontWeight: 800, fontSize: '1rem', display: 'block', margin: '2px 0' }}>The Churnless Manifesto</span>
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>Comparing 4-year cumulative cost of retail ownership against circular lease models.</span>
                    </div>

                    <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '0.75rem', cursor: 'pointer' }} onClick={() => goToPage(4)}>
                      <strong style={{ display: 'block', fontSize: '0.8rem', color: '#dc2626', textTransform: 'uppercase' }}>Sheet 05 &bull; Laboratory</strong>
                      <span style={{ fontWeight: 800, fontSize: '1rem', display: 'block', margin: '2px 0' }}>Martindale Rub Count 100K+</span>
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>Molecular durability tests and component field-replacement protocols.</span>
                    </div>

                    <div style={{ paddingBottom: '0.75rem', cursor: 'pointer' }} onClick={() => goToPage(5)}>
                      <strong style={{ display: 'block', fontSize: '0.8rem', color: '#dc2626', textTransform: 'uppercase' }}>Sheet 06 &bull; Classifieds</strong>
                      <span style={{ fontWeight: 800, fontSize: '1rem', display: 'block', margin: '2px 0' }}>The Colophon &amp; Direct Register</span>
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>Metropolitan depot hubs, certified pre-leased listings, and catalog links.</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f2ea', border: '1px solid #111', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                      Ready to flip the paper?
                    </span>
                    <button 
                      onClick={nextPage}
                      style={{
                        background: '#111',
                        color: '#fff',
                        border: 'none',
                        width: '100%',
                        padding: '10px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      Turn to Sheet 02 <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SHEET 02: HARDWARE & APPLIANCE MONOGRAPH ── */}
          {currentPage === 1 && (
            <div key={currentPage} style={{ animation: `${flipDirection === 'next' ? 'paperSlideNext' : 'paperSlidePrev'} 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards` }}>
              <div style={{ borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.1em' }}>
                  SECTION B &bull; TECHNICAL MONOGRAPH &amp; APPLIANCE ARCHITECTURE
                </span>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  margin: '0.5rem 0 0',
                  fontFamily: 'var(--rv-font-display), "Fraunces", serif'
                }}>
                  Thermodynamics of Silent Luxury: The Engineering Behind Cryo-Inverter Compressors.
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
                {/* Left Cutaway & Spec Sheet (7 cols) */}
                <div style={{ gridColumn: 'span 7' }}>
                  <div style={{ position: 'relative', border: '1px solid #111', marginBottom: '1.5rem', backgroundColor: '#f1f5f9' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80" 
                      alt="Refrigerator Hardware" 
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.15)' }} 
                    />
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
                      TECHNICAL DIAGRAM &bull; R-600A ISOBUTANE CIRCUIT
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--rv-font-display)', marginBottom: '0.75rem' }}>
                    Decibel Attenuation at 38°C Ambient Stress
                  </h3>
                  <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#333', marginBottom: '1.5rem' }}>
                    Traditional retail consumer appliances are built down to a cost target; modular circular appliances are engineered up to a continuous operating duty. By deploying brushless permanent-magnet motors with sinusoidal pulse-width modulation, vibrational harmonics are dampened directly at the mounting bracket.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '1.25rem 0', fontFamily: 'Inter, Helvetica, sans-serif' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Acoustic Rating</span>
                      <strong style={{ fontSize: '1.6rem', fontWeight: 900 }}>36 dB</strong>
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', display: 'block' }}>Whisper Quiet</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Power Draw</span>
                      <strong style={{ fontSize: '1.6rem', fontWeight: 900 }}>0.82 kWh</strong>
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', display: 'block' }}>5-Star Bureau Rated</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Dynamic Deposit</span>
                      <strong style={{ fontSize: '1.6rem', fontWeight: 900 }}>0.9× Rent</strong>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', display: 'block' }}>100% Refundable</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: In-Depth Study & Secondary Article (5 cols) */}
                <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ borderBottom: '1px solid #111', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7' }}>
                        TECHNICAL REPORT &bull; LAUNDRY DIVISION
                      </span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--rv-font-display)', margin: '6px 0' }}>
                        1400 RPM Direct-Drive Drum Kinetics
                      </h3>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.55, color: '#444' }}>
                        Eliminating belt-and-pulley assemblies eliminates the primary source of mechanical failure in modern washing machines. With motor stators mounted directly to the rear axis of the drum, vibration is sensed and compensated via algorithmic micro-adjustments 1,000 times per second.
                      </p>
                    </div>

                    <div style={{ background: '#f5f2ea', padding: '1.25rem', border: '1px solid #111', marginBottom: '1.5rem' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
                        FIELD SERVICE DISPATCH COMMITMENT
                      </strong>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0, color: '#333' }}>
                        Because all appliances are owned and maintained by Rentova, any compressor or drum anomaly triggers automatic mobile repair dispatch under Rentova Care with ₹0 labor or parts deductible.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link
                      to="/catalog"
                      style={{
                        flex: 1,
                        background: '#111',
                        color: '#fff',
                        textDecoration: 'none',
                        textAlign: 'center',
                        padding: '12px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Lease Cryo Appliance &rarr;
                    </Link>
                    <button
                      onClick={nextPage}
                      style={{
                        background: 'transparent',
                        border: '1px solid #111',
                        padding: '12px 18px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Turn Sheet &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SHEET 03: SPATIAL METRIC & HABITATION ── */}
          {currentPage === 2 && (
            <div key={currentPage} style={{ animation: `${flipDirection === 'next' ? 'paperSlideNext' : 'paperSlidePrev'} 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards` }}>
              <div style={{ borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.1em' }}>
                  SECTION C &bull; SPATIAL METRIC &amp; BIOPHILIC DESIGN
                </span>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  margin: '0.5rem 0 0',
                  fontFamily: 'var(--rv-font-display), "Fraunces", serif'
                }}>
                  The 320 Sq Ft Micro-Studio: How Four Interlocking Modules Replace an Entire Villa.
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
                {/* Visual Architecture Spread (8 cols) */}
                <div style={{ gridColumn: 'span 8' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', border: '1px solid #111' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80" 
                        alt="Minimalist Desk" 
                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} 
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '6px 10px', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
                        MODULE A &bull; ERGONOMIC MOTORIZED DESK [1200×600mm]
                      </div>
                    </div>
                    <div style={{ position: 'relative', border: '1px solid #111' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" 
                        alt="Minimalist Chair" 
                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} 
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '6px 10px', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
                        MODULE B &bull; HIGH-DENSITY FOAM ACCENT CHAIR
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--rv-font-display)', marginBottom: '0.75rem' }}>
                    Zero Static Footprint Architecture
                  </h3>
                  <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#333' }}>
                    By structuring furniture as modular interlocking blocks rather than immovable monoliths, urban apartments maintain an expansive breathing plane. A motorized sit-to-stand surface shifts from deep technical focus to a dining configuration in three seconds.
                  </p>
                </div>

                {/* Right Spec & Spatial Dimensions (4 cols) */}
                <div style={{ gridColumn: 'span 4', borderLeft: '1px solid #ddd', paddingLeft: '1.5rem' }}>
                  <div style={{ borderBottom: '2px solid #111', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    SPATIAL EFFICIENCY AUDIT
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '10px', background: '#f5f2ea', border: '1px solid #111' }}>
                      <strong>Spatial Footprint Saved:</strong>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>42% Floor Area</div>
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>Measured against traditional static suites</span>
                    </div>

                    <div style={{ padding: '10px', background: '#f5f2ea', border: '1px solid #111' }}>
                      <strong>Setup &amp; Leveling Time:</strong>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>35 Minutes</div>
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>Carried out by white-glove field technicians</span>
                    </div>

                    <div style={{ padding: '10px', background: '#f5f2ea', border: '1px solid #111' }}>
                      <strong>Dynamic Deposit on 12M:</strong>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>0.9× Monthly</div>
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>100% Refundable at lease closure</span>
                    </div>
                  </div>

                  <Link
                    to="/room-configurator"
                    style={{
                      display: 'block',
                      background: '#111',
                      color: '#fff',
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '12px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      fontFamily: 'Inter, sans-serif',
                      marginBottom: '0.75rem'
                    }}
                  >
                    Open 3D Room Configurator &rarr;
                  </Link>
                  <button
                    onClick={nextPage}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: '1px solid #111',
                      padding: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Turn to Economic Manifesto &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SHEET 04: THE CHURNLESS MANIFESTO & ECONOMIC ESSAY ── */}
          {currentPage === 3 && (
            <div key={currentPage} style={{ animation: `${flipDirection === 'next' ? 'paperSlideNext' : 'paperSlidePrev'} 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards` }}>
              <div style={{ borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.1em' }}>
                  SECTION D &bull; ECONOMIC ESSAY &amp; DEPOSIT MATHEMATICS
                </span>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  margin: '0.5rem 0 0',
                  fontFamily: 'var(--rv-font-display), "Fraunces", serif'
                }}>
                  Depreciation is a Tax on the Uninformed: The Financial Mathematics of Modular Living.
                </h2>
              </div>

              {/* Massive Centerpiece Quote */}
              <div style={{
                background: '#111',
                color: '#fff',
                padding: '2.5rem 3rem',
                margin: '0 0 2.5rem',
                textAlign: 'center',
                fontFamily: 'var(--rv-font-display), "Fraunces", serif'
              }}>
                <blockquote style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontStyle: 'italic', lineHeight: 1.3, margin: '0 0 1rem' }}>
                  &ldquo;A chair is not an asset. A refrigerator is not an inheritance. They are instruments of biological utility. Locking capital into depreciating matter is the ultimate 20th-century trap.&rdquo;
                </blockquote>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, color: '#aaa', fontFamily: 'Inter, sans-serif' }}>
                  RENTOVA RESEARCH MONOGRAPH &bull; CIRCULATION WORKING PAPER NO. 14
                </span>
              </div>

              {/* Economic Comparison Ledger Table */}
              <div style={{ border: '2px solid #111', marginBottom: '2.5rem', fontFamily: 'Inter, Helvetica, sans-serif' }}>
                <div style={{ background: '#f5f2ea', padding: '12px 16px', borderBottom: '2px solid #111', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Three-Year Habitation Ledger (1BHK Outfitting Benchmark)</span>
                  <span>Currency: INR (₹)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#fff', fontSize: '0.9rem' }}>
                  <div style={{ padding: '12px 16px', fontWeight: 800, borderBottom: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Metric &amp; Fiscal Exposure</div>
                  <div style={{ padding: '12px 16px', fontWeight: 800, borderBottom: '1px solid #ddd', borderRight: '1px solid #ddd', color: '#dc2626' }}>Buying Retail</div>
                  <div style={{ padding: '12px 16px', fontWeight: 800, borderBottom: '1px solid #ddd', borderRight: '1px solid #ddd', color: '#d97706' }}>Legacy Rentals</div>
                  <div style={{ padding: '12px 16px', fontWeight: 800, borderBottom: '1px solid #ddd', color: '#16a34a' }}>Rentova Circular</div>

                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>Initial Capital Sunk</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>₹1,80,000 (100% Sunk)</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>₹18,000 (Locked Deposit)</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', color: '#16a34a', fontWeight: 700 }}>₹3,500 (Dynamic Deposit)</div>

                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>Depreciation / Value Lost</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>- ₹1,10,000 (60% Loss)</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>- ₹6,000 (Deposit Deductions)</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', color: '#16a34a', fontWeight: 700 }}>₹0 (Zero Depreciation)</div>

                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>Maintenance &amp; Service Repairs</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>Out-of-Pocket (₹15,000+)</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', borderRight: '1px solid #ddd' }}>Limited / Co-Pay</div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', color: '#16a34a', fontWeight: 700 }}>100% Free Rentova Care</div>

                  <div style={{ padding: '12px 16px', borderRight: '1px solid #ddd', background: '#fcfcfc', fontWeight: 800 }}>Deposit Refundability</div>
                  <div style={{ padding: '12px 16px', borderRight: '1px solid #ddd', background: '#fcfcfc' }}>N/A (Liquidated at pawn)</div>
                  <div style={{ padding: '12px 16px', borderRight: '1px solid #ddd', background: '#fcfcfc' }}>30 to 45 Day Delay</div>
                  <div style={{ padding: '12px 16px', background: '#f0fdf4', color: '#16a34a', fontWeight: 800 }}>Instant IMPS / UPI Reversal</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                  Audited by Rentova Financial Architecture Guild &bull; Calculations assume 3-year tenure with standard relocations.
                </span>
                <button
                  onClick={nextPage}
                  style={{
                    background: '#111',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Turn to Laboratory Archive &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ── SHEET 05: LABORATORY ARCHIVE & MATERIAL REGISTER ── */}
          {currentPage === 4 && (
            <div key={currentPage} style={{ animation: `${flipDirection === 'next' ? 'paperSlideNext' : 'paperSlidePrev'} 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards` }}>
              <div style={{ borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.1em' }}>
                  SECTION E &bull; LABORATORY ARCHIVE &amp; MATERIAL REGISTER
                </span>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  margin: '0.5rem 0 0',
                  fontFamily: 'var(--rv-font-display), "Fraunces", serif'
                }}>
                  The Molecular Science of Fabric Recovery: 100,000 Martindale Rub Cycles.
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
                {/* Left 6 Columns: Material Testing */}
                <div style={{ gridColumn: 'span 6' }}>
                  <div style={{ border: '1px solid #111', padding: '1.5rem', background: '#f5f2ea', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--rv-font-display)', marginBottom: '0.5rem' }}>
                      Olefin Weave vs. Traditional Bouclé
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#333' }}>
                      While porous natural cottons permanently trap tannins and oils, Rentova’s high-density Olefin fibers are solution-dyed at the polymer stage. Pigment is locked into the core of the filament, rendering it impervious to bleach, coffee spills, and high-abrasion pet friction.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontFamily: 'Inter, sans-serif' }}>
                    <div style={{ border: '1px solid #111', padding: '1rem', background: '#fff' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>TEST STANDARDS</span>
                      <strong style={{ fontSize: '1.4rem', display: 'block', margin: '4px 0' }}>ISO 12947-2</strong>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Zero yarn breakage after 100,000 oscillating rubs.</p>
                    </div>

                    <div style={{ border: '1px solid #111', padding: '1rem', background: '#fff' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>STAIN RELEASE</span>
                      <strong style={{ fontSize: '1.4rem', display: 'block', margin: '4px 0' }}>Grade 5.0</strong>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>99.8% stain release with ultrasonic steam rinse.</p>
                    </div>
                  </div>
                </div>

                {/* Right 6 Columns: Field Service & Maintenance */}
                <div style={{ gridColumn: 'span 6' }}>
                  <div style={{ borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--rv-font-display)', marginBottom: '0.5rem' }}>
                      Modular Disassembly in &lt;15 Minutes
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#333' }}>
                      Every frame in our fleet is assembled using standardized M6 fasteners. Rather than discarding an entire sofa or refrigerator due to a minor cosmetic scratch, mobile technicians swap individual arm cushions, compressor relays, or display panels right in the apartment.
                    </p>
                  </div>

                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                      <CheckCircle size={16} /> ZERO DAMAGE PENALTY AUDIT
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#047857', margin: 0 }}>
                      Normal wear-and-tear is 100% absorbed by our maintenance reserve fund. Tenants are never nickel-and-dimed for living in their home.
                    </p>
                  </div>

                  <button
                    onClick={nextPage}
                    style={{
                      width: '100%',
                      background: '#111',
                      color: '#fff',
                      border: 'none',
                      padding: '12px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Turn to Back Page &amp; Classifieds &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SHEET 06: COLOPHON, FLEET REGISTER & CLASSIFIEDS ── */}
          {currentPage === 5 && (
            <div key={currentPage} style={{ animation: `${flipDirection === 'next' ? 'paperSlideNext' : 'paperSlidePrev'} 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards` }}>
              <div style={{ borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.1em' }}>
                  SECTION F &bull; THE COLOPHON &amp; METROPOLITAN CLASSIFIEDS
                </span>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  margin: '0.5rem 0 0',
                  fontFamily: 'var(--rv-font-display), "Fraunces", serif'
                }}>
                  The Exchange Directory &amp; Certified Pre-Leased Fleet Register.
                </h2>
              </div>

              {/* Classifieds Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ border: '2px solid #111', padding: '1.25rem', background: '#fff' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#111', color: '#fff', padding: '2px 6px', textTransform: 'uppercase' }}>
                    CERTIFIED DROP #01
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '8px 0 4px' }}>Ergo motorized Standing Desk</h4>
                  <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                    Solid ash top with dual-stage silent motor. 0-scratch verified. Ready for immediate 24h setup.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>₹80/mo</strong>
                    <Link to="/catalog" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textDecoration: 'none' }}>Order Now &rarr;</Link>
                  </div>
                </div>

                <div style={{ border: '2px solid #111', padding: '1.25rem', background: '#fff' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#111', color: '#fff', padding: '2px 6px', textTransform: 'uppercase' }}>
                    CERTIFIED DROP #02
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '8px 0 4px' }}>Quantum OLED 65" 4K Smart Unit</h4>
                  <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                    Bezel-less cinematic panel with factory calibration. Full wall mount &amp; tuning included free.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>₹150/mo</strong>
                    <Link to="/catalog" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textDecoration: 'none' }}>Order Now &rarr;</Link>
                  </div>
                </div>

                <div style={{ border: '2px solid #111', padding: '1.25rem', background: '#fff' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#111', color: '#fff', padding: '2px 6px', textTransform: 'uppercase' }}>
                    CERTIFIED DROP #03
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '8px 0 4px' }}>Frost-Free Dual Inverter Cryo Unit</h4>
                  <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                    340L capacity with multi-air flow tower. 5-star power profile. Full sanitize protocol cleared.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>₹140/mo</strong>
                    <Link to="/catalog" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textDecoration: 'none' }}>Order Now &rarr;</Link>
                  </div>
                </div>
              </div>

              {/* The Colophon & Publisher's Seal */}
              <div style={{ borderTop: '4px double #111', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
                <div style={{ gridColumn: 'span 4', fontSize: '0.85rem', lineHeight: 1.6, color: '#555' }}>
                  <strong style={{ color: '#111', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
                    THE COLOPHON
                  </strong>
                  Typeset digitally in Fraunces, Newsreader, and Inter. Rendered on 100% post-consumer digital newsprint stock. Published biannually by Rentova Spatial Laboratories. All rights reserved.
                </div>

                <div style={{ gridColumn: 'span 4', fontSize: '0.85rem', lineHeight: 1.6, color: '#555' }}>
                  <strong style={{ color: '#111', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
                    DEPOT LOGISTICS CENTERS
                  </strong>
                  Active fulfillment hubs operating in Bengaluru (Koramangala &amp; Whitefield), Mumbai (Bandra-Kurla Complex), Delhi NCR (CyberHub), and Hyderabad (Hitec City).
                </div>

                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link
                    to="/catalog"
                    style={{
                      background: '#111',
                      color: '#fff',
                      textAlign: 'center',
                      padding: '12px',
                      textDecoration: 'none',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Enter Complete Catalog &rarr;
                  </Link>

                  <button
                    onClick={() => goToPage(0)}
                    style={{
                      background: '#fff',
                      color: '#111',
                      border: '1px solid #111',
                      padding: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <RotateCcw size={14} /> Return to Front Page (Sheet 01)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              NEWSPAPER CORNER DOG-EARS (Interactive Click-To-Turn)
             ═══════════════════════════════════════════════════════════ */}
          {/* Top Right Corner Dog-Ear */}
          {currentPage < totalPages - 1 && (
            <div 
              className="newspaper-dogear-next"
              onClick={nextPage}
              title="Click to turn to next sheet"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, transparent 50%, #e2dac9 50%)',
                cursor: 'pointer',
                borderBottomLeftRadius: '6px',
                boxShadow: '-3px 3px 6px rgba(0,0,0,0.12)',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                fontSize: '0.65rem',
                fontWeight: 900,
                color: '#111',
                transform: 'rotate(-45deg)'
              }}>
                FLIP
              </div>
            </div>
          )}

          {/* Top Left Corner Dog-Ear */}
          {currentPage > 0 && (
            <div 
              className="newspaper-dogear-prev"
              onClick={prevPage}
              title="Click to turn to previous sheet"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60px',
                height: '60px',
                background: 'linear-gradient(225deg, transparent 50%, #e2dac9 50%)',
                cursor: 'pointer',
                borderBottomRightRadius: '6px',
                boxShadow: '3px 3px 6px rgba(0,0,0,0.12)',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                fontSize: '0.65rem',
                fontWeight: 900,
                color: '#111',
                transform: 'rotate(45deg)'
              }}>
                PREV
              </div>
            </div>
          )}

          {/* Bottom Running Sheet Folio */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '3.5rem',
            right: '3.5rem',
            borderTop: '1px solid #111',
            paddingTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'Inter, Helvetica, sans-serif'
          }}>
            <div>
              <span>RENTOVA JOURNAL &bull; BROADSHEET ARCHIVE</span>
            </div>
            <div>
              <span>PAGE 0{currentPage + 1} OF 0{totalPages}</span>
            </div>
            <div>
              <span style={{ color: '#666' }}>[USE &larr; / &rarr; ARROWS TO TURN PAGES]</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

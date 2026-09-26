import React from 'react';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Releases() {
  return (
    <main style={{ 
      backgroundColor: '#ffffff', 
      color: '#000000', 
      fontFamily: 'Inter, Helvetica, sans-serif',
      paddingTop: '6.5rem',
      paddingBottom: '8rem',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
        
        {/* Modular Grid Container */}
        <div style={{ 
          maxWidth: '1600px', 
          margin: '0 auto', 
          padding: '0 4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          columnGap: '2rem',
          rowGap: '6rem'
        }}>
          
          {/* Header / Anchor Effect */}
          <header style={{ 
            gridColumn: '1 / -1', 
            borderBottom: '6px solid #000', 
            paddingBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(4rem, 10vw, 12rem)', 
              fontWeight: 800, 
              letterSpacing: '-0.05em', 
              lineHeight: 0.8,
              margin: 0,
              textTransform: 'uppercase'
            }}>
              Signature<br/>Collection.
            </h1>
            <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.5rem', paddingBottom: '1rem', lineHeight: 1.4 }}>
              Drop 04 <br/> 
              <span style={{ color: '#dc2626' }}>Extremely Limited Availability</span>
            </div>
          </header>

          {/* Focal Point Product & Overshooting & Rule of Thirds */}
          <article style={{ gridColumn: '2 / 11', position: 'relative', marginTop: '2rem' }}>
            
            <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9', backgroundColor: '#f1f5f9' }}>
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80" alt="Aero Modular Sofa" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.2)' }} />
              
              {/* Rule of Thirds Guides (Visible for Swiss Aesthetic) */}
              <div style={{ position: 'absolute', top: '33.33%', left: 0, width: '100%', borderTop: '1px solid rgba(255,255,255,0.4)' }} />
              <div style={{ position: 'absolute', top: '66.66%', left: 0, width: '100%', borderTop: '1px solid rgba(255,255,255,0.4)' }} />
              <div style={{ position: 'absolute', left: '33.33%', top: 0, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.4)' }} />
              <div style={{ position: 'absolute', left: '66.66%', top: 0, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.4)' }} />
              
              {/* Crosshairs */}
              <div style={{ position: 'absolute', top: '33.33%', left: '33.33%', width: '12px', height: '12px', transform: 'translate(-50%, -50%)', border: '2px solid #fff', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: '66.66%', left: '66.66%', width: '12px', height: '12px', transform: 'translate(-50%, -50%)', border: '2px solid #fff', borderRadius: '50%' }} />
              
              {/* Scarcity Signal Overlay */}
              <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: '#000', color: '#fff', padding: '1rem 2rem', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ONLY 2 LEFT
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
              <h2 style={{ 
                fontSize: 'clamp(3rem, 6vw, 7rem)', 
                fontWeight: 800, 
                lineHeight: 0.9, 
                letterSpacing: '-0.04em', 
                marginTop: '0',
                marginLeft: '-4rem', // Overshooting the grid
                backgroundColor: '#fff',
                display: 'inline-block',
                padding: '2rem 3rem 1rem 0',
                transform: 'translateY(-30%)'
              }}>
                Aero Modular<br/>Sofa System.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '-2rem' }}>
              <div>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--rv-color-primary)', display: 'block', marginBottom: '1rem' }}>$85<span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 500 }}>/mo</span></span>
                <p style={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.01em', color: '#475569' }}>
                  Italian-designed modular seating with memory foam core and stain-resistant woven fabric. The pinnacle of living room comfort.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '1.5rem' }}>
                <button style={{ background: '#000', color: '#fff', border: 'none', padding: '1rem 3rem', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                  Rent Now <ArrowRight size={24} />
                </button>
                <Link to="/appliance/1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 800, color: '#000', textDecoration: 'none', border: '3px solid #000', padding: '1rem 3rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '100%' }}>
                  View in 3D <ArrowUpRight size={24} strokeWidth={3} />
                </Link>
              </div>
            </div>
          </article>

          {/* Rhythm & Section Anchor */}
          <div style={{ gridColumn: '1 / -1', borderTop: '4px solid #000', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4rem' }}>
            <span>Archive Drops</span>
            <span>02 &mdash; 03</span>
          </div>

          {/* Odd Numbering & Column Grids */}
          <article style={{ gridColumn: '1 / 6', borderRight: '2px solid #e2e8f0', paddingRight: '3rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 0.8, display: 'block', marginBottom: '2rem', letterSpacing: '-0.05em' }}>02</span>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80" alt="8K TV" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)', marginBottom: '2rem' }} />
              {/* Negative Space / Scarcity Signal block */}
              <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: '#dc2626', color: '#fff', padding: '1rem', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', transform: 'rotate(5deg)' }}>
                WAITLIST OPEN
              </div>
            </div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Quantum 8K<br/>Display.</h3>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginBottom: '1.5rem', display: 'block' }}>$120<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>/mo</span></span>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.5, color: '#475569', marginBottom: '3rem', flexGrow: 1 }}>Cinematic bezel-less 75" display. Features spatial audio and self-lit pixels for perfect blacks.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button style={{ background: '#000', color: '#fff', border: 'none', padding: '1rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>Waitlist</button>
              <Link to="/appliance/2" style={{ border: '2px solid #000', color: '#000', padding: '1rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center' }}>3D View</Link>
            </div>
          </article>

          <article style={{ gridColumn: '6 / 11', paddingLeft: '3rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 0.8, display: 'block', marginBottom: '2rem', letterSpacing: '-0.05em' }}>03</span>
            <img src="/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg" alt="Ergo Desk" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)', marginBottom: '2rem' }} />
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Ergonomic<br/>Focus Desk.</h3>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginBottom: '1.5rem', display: 'block' }}>$45<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>/mo</span></span>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.5, color: '#475569', marginBottom: '3rem', flexGrow: 1 }}>Solid oak top with motorized standing mechanics. Designed to eliminate distractions and promote deep work.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button style={{ background: '#000', color: '#fff', border: 'none', padding: '1rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>Rent Now</button>
              <Link to="/catalog" style={{ border: '2px solid #000', color: '#000', padding: '1rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center' }}>Details</Link>
            </div>
          </article>
          
          <div style={{ gridColumn: '11 / 13' }}>
             {/* Empty columns for negative space */}
          </div>

        </div>
      </main>
  );
}

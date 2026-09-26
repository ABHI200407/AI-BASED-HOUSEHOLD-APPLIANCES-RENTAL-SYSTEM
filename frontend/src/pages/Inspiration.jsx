import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Inspiration() {
  return (
    <main style={{ 
      backgroundColor: '#ffffff', 
      color: '#000000', 
      fontFamily: 'Inter, Helvetica, sans-serif',
      paddingTop: '8rem',
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
            fontSize: 'clamp(5rem, 12vw, 15rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.05em', 
            lineHeight: 0.8,
            margin: 0,
            textTransform: 'uppercase'
          }}>
            The<br/>Journal.
          </h1>
          <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.5rem', paddingBottom: '1.5rem', lineHeight: 1.4 }}>
            Vol. 04 <br/> 
            <span style={{ color: '#dc2626' }}>Limited Edition (Only 200 Prints)</span>
          </div>
        </header>

        {/* Focal Point Article & Overshooting & Rule of Thirds */}
        <article style={{ gridColumn: '2 / 11', position: 'relative', marginTop: '2rem' }}>
          
          <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9', backgroundColor: '#f1f5f9' }}>
            <img src="/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg" alt="Living Room" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.2)' }} />
            
            {/* Rule of Thirds Guides (Visible for Swiss Aesthetic) */}
            <div style={{ position: 'absolute', top: '33.33%', left: 0, width: '100%', borderTop: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ position: 'absolute', top: '66.66%', left: 0, width: '100%', borderTop: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ position: 'absolute', left: '33.33%', top: 0, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ position: 'absolute', left: '66.66%', top: 0, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.4)' }} />
            
            {/* Crosshairs */}
            <div style={{ position: 'absolute', top: '33.33%', left: '33.33%', width: '12px', height: '12px', transform: 'translate(-50%, -50%)', border: '2px solid #fff', borderRadius: '50%' }} />
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
              Minimalism<br/>Is Not Empty.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '-2rem' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
              A masterclass in restraint. How to design a living space that breathes, using only essential pieces carefully curated for maximum impact.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 800, color: '#000', textDecoration: 'none', borderBottom: '4px solid #000', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Read Manifesto <ArrowUpRight size={28} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </article>

        {/* Rhythm & Section Anchor */}
        <div style={{ gridColumn: '1 / -1', borderTop: '4px solid #000', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4rem' }}>
          <span>Editorial Index</span>
          <span>02 &mdash; 04</span>
        </div>

        {/* Odd Numbering & Column Grids */}
        <article style={{ gridColumn: '1 / 5', borderRight: '2px solid #e2e8f0', paddingRight: '3rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 0.8, display: 'block', marginBottom: '2rem', letterSpacing: '-0.05em' }}>01</span>
          <img src="/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg" alt="Bed" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)', marginBottom: '2rem' }} />
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>The Art<br/>of Rest.</h3>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.5, color: '#475569', marginBottom: '3rem', flexGrow: 1 }}>Selecting the perfect mattress and frame for deep, uninterrupted sleep.</p>
          <div>
            <span style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#000', color: '#fff', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>High Demand</span>
          </div>
        </article>

        <article style={{ gridColumn: '5 / 9', borderRight: '2px solid #e2e8f0', padding: '0 3rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 0.8, display: 'block', marginBottom: '2rem', letterSpacing: '-0.05em' }}>02</span>
          <img src="/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg" alt="Dining" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)', marginBottom: '2rem' }} />
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Table<br/>Dynamics.</h3>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.5, color: '#475569', marginBottom: '3rem', flexGrow: 1 }}>Why the circular dining table fosters better conversation and flow in small spaces.</p>
        </article>

        <article style={{ gridColumn: '9 / 13', paddingLeft: '3rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 0.8, display: 'block', marginBottom: '2rem', letterSpacing: '-0.05em' }}>03</span>
          <img src="/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg" alt="Office" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)', marginBottom: '2rem' }} />
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Focus<br/>Architecture.</h3>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.5, color: '#475569', marginBottom: '3rem', flexGrow: 1 }}>Structuring your home office to eliminate distractions and promote deep work.</p>
          <div>
            <span style={{ display: 'inline-block', padding: '0.75rem 1.5rem', border: '3px solid #000', color: '#000', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exclusive Read</span>
          </div>
        </article>

      </div>
    </main>
  );
}

import React from 'react';
import { PackageCheck, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Packages() {
  const [searchParams] = useSearchParams();
  const packId = searchParams.get('pack');

  return (
    <main className="rv-shell" style={{ paddingTop: '8rem', paddingBottom: '8rem', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--rv-color-surface)', padding: '4rem', borderRadius: 'var(--rv-radius-lg)', maxWidth: '600px', width: '100%', border: '1px solid var(--rv-color-border)', boxShadow: 'var(--rv-shadow-sm)' }}>
        <PackageCheck size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--rv-color-primary)', opacity: 0.9 }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', color: 'var(--rv-color-primary)' }}>Rental Packages</h1>
        
        {packId ? (
          <p style={{ fontSize: '1.25rem', color: 'var(--rv-color-secondary)', marginBottom: '3rem', lineHeight: 1.6 }}>
            You've selected the <strong>{packId}</strong> package. We are currently finalizing the detailed view for our curated packages. Stay tuned!
          </p>
        ) : (
          <p style={{ fontSize: '1.25rem', color: 'var(--rv-color-secondary)', marginBottom: '3rem', lineHeight: 1.6 }}>
            We're building a dedicated experience to explore our fully-furnished room packages. Check back soon.
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="rv-button rv-button--light">Return to Home</Link>
          <Link to="/catalog" className="rv-button rv-button--signal">Browse Catalog <ArrowRight size={18} /></Link>
        </div>
      </div>
    </main>
  );
}

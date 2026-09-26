import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Briefcase, Sofa, ShieldCheck } from 'lucide-react';

export default function Business() {
  return (
    <main className="rv-shell" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
        <span className="rv-section-label" style={{ justifyContent: 'center' }}><Building2 size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }}/> Rentova for Business</span>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', marginTop: '1rem', fontFamily: 'var(--rv-font-display)' }}>
          Spaces at scale.<br />Still personal.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--rv-color-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          From co-living spaces to startup offices, we make full-space setup easier to plan, manage, and adapt. Furnish 100 apartments in 5 days, or outfit your new headquarters without tying up capital.
        </p>
        <Link to="/catalog" className="rv-button rv-button--signal" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          Explore the Catalog <ArrowRight size={20} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
        <div style={{ background: '#fff', padding: '3rem 2rem', borderRadius: 'var(--rv-radius-lg)', border: '1px solid var(--rv-color-border)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Co-Living & Real Estate</h3>
          <p style={{ color: 'var(--rv-color-secondary)' }}>Increase your yield by renting out fully furnished units without the upfront capex. We handle delivery, maintenance, and swap-outs.</p>
        </div>
        <div style={{ background: '#fff', padding: '3rem 2rem', borderRadius: 'var(--rv-radius-lg)', border: '1px solid var(--rv-color-border)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Briefcase size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Offices & Startups</h3>
          <p style={{ color: 'var(--rv-color-secondary)' }}>Scale your office as your team grows. Rent ergonomic chairs, desks, and breakout furniture on flexible monthly plans.</p>
        </div>
        <div style={{ background: '#fff', padding: '3rem 2rem', borderRadius: 'var(--rv-radius-lg)', border: '1px solid var(--rv-color-border)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Sofa size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Events & Staging</h3>
          <p style={{ color: 'var(--rv-color-secondary)' }}>Premium furniture rentals for property staging, film sets, or corporate events. Delivered and set up perfectly on time.</p>
        </div>
      </div>
      
      <div style={{ background: 'var(--rv-color-text)', color: '#fff', padding: '4rem', borderRadius: 'var(--rv-radius-xl)', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to scale?</h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '2rem' }}>Get in touch with our enterprise team for volume discounts, dedicated account management, and custom procurement.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.9 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck size={20} color="#10b981" /> Dedicated Account Manager</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck size={20} color="#10b981" /> Custom procurement (if we don't have it, we'll buy it)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck size={20} color="#10b981" /> Volume-based tiered pricing</li>
          </ul>
        </div>
        <div style={{ flex: '1 1 300px', background: '#fff', padding: '3rem', borderRadius: 'var(--rv-radius-lg)', color: 'var(--rv-color-text)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Contact Sales</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Company Name" className="rv-input" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--rv-color-border)' }} />
            <input type="email" placeholder="Work Email" className="rv-input" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--rv-color-border)' }} />
            <select className="rv-input" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--rv-color-border)', appearance: 'none', background: '#f8fafc' }}>
              <option>I need to furnish an office</option>
              <option>I need to furnish apartments</option>
              <option>Property Staging</option>
              <option>Other</option>
            </select>
            <button className="rv-button rv-button--signal" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Request Quote</button>
          </div>
        </div>
      </div>
    </main>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Wrench, PackagePlus, AlertCircle, ArrowLeftRight } from 'lucide-react';

export default function ServiceRequests() {
  const [activeType, setActiveType] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  // Mocking active rentals for the user
  const mockRentals = [
    { id: 1, name: 'Samsung 500L Fridge', category: 'Appliances', status: 'Active' },
    { id: 2, name: 'Ergonomic Office Chair', category: 'Furniture', status: 'Active' },
  ];

  const handleRequest = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  return (
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <Link to="/my-bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--rv-color-secondary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginBottom: '2rem' }}>
        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to my bookings
      </Link>

      <div className="rv-section-heading" style={{ marginBottom: '3rem' }}>
        <div>
          <span className="rv-section-label"><Wrench size={14} style={{display:'inline', verticalAlign:'middle'}}/> Tenant Support</span>
          <h2>Service & Maintenance</h2>
          <p style={{ color: 'var(--rv-color-secondary)', fontSize: '1.125rem', marginTop: '0.5rem', maxWidth: '600px' }}>
            Enjoy peace of mind with our free maintenance and easy relocation services. Select a service type below to raise a ticket.
          </p>
        </div>
      </div>

      <div className="rv-split-layout">
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            
            <button 
              onClick={() => setActiveType('repair')}
              style={{ padding: '2rem 1.5rem', background: activeType === 'repair' ? 'var(--rv-color-background)' : '#fff', border: `2px solid ${activeType === 'repair' ? 'var(--rv-color-primary)' : 'var(--rv-color-border)'}`, borderRadius: 'var(--rv-radius-md)', textAlign: 'center', cursor: 'pointer', transition: 'var(--rv-transition)' }}
            >
              <Wrench size={32} color={activeType === 'repair' ? "var(--rv-color-primary)" : "var(--rv-color-secondary)"} style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Repair</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Free maintenance for all wear & tear.</p>
            </button>

            <button 
              onClick={() => setActiveType('relocate')}
              style={{ padding: '2rem 1.5rem', background: activeType === 'relocate' ? 'var(--rv-color-background)' : '#fff', border: `2px solid ${activeType === 'relocate' ? 'var(--rv-color-primary)' : 'var(--rv-color-border)'}`, borderRadius: 'var(--rv-radius-md)', textAlign: 'center', cursor: 'pointer', transition: 'var(--rv-transition)' }}
            >
              <ArrowLeftRight size={32} color={activeType === 'relocate' ? "var(--rv-color-primary)" : "var(--rv-color-secondary)"} style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Relocation</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Moving houses? We'll move it for free.</p>
            </button>

            <button 
              onClick={() => setActiveType('swap')}
              style={{ padding: '2rem 1.5rem', background: activeType === 'swap' ? 'var(--rv-color-background)' : '#fff', border: `2px solid ${activeType === 'swap' ? 'var(--rv-color-primary)' : 'var(--rv-color-border)'}`, borderRadius: 'var(--rv-radius-md)', textAlign: 'center', cursor: 'pointer', transition: 'var(--rv-transition)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '0.25rem', background: 'var(--rv-color-primary)', color: '#fff', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>Subscriber Perk</div>
              <PackagePlus size={32} color={activeType === 'swap' ? "var(--rv-color-primary)" : "var(--rv-color-secondary)"} style={{ margin: '1rem auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Swap Item</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Free style swap for active subscribers.</p>
            </button>

            <button 
              onClick={() => setActiveType('cleaning')}
              style={{ padding: '2rem 1.5rem', background: activeType === 'cleaning' ? 'var(--rv-color-background)' : '#fff', border: `2px solid ${activeType === 'cleaning' ? 'var(--rv-color-primary)' : 'var(--rv-color-border)'}`, borderRadius: 'var(--rv-radius-md)', textAlign: 'center', cursor: 'pointer', transition: 'var(--rv-transition)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '0.25rem', background: 'var(--rv-color-primary)', color: '#fff', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>Subscriber Perk</div>
              <AlertCircle size={32} color={activeType === 'cleaning' ? "var(--rv-color-primary)" : "var(--rv-color-secondary)"} style={{ margin: '1rem auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Deep Cleaning</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Annual deep cleaning included.</p>
            </button>

          </div>

          {activeType && (
            <form onSubmit={handleRequest} style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--rv-radius-md)', border: '1px solid var(--rv-color-border)', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                Raise a {activeType} request
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="rv-section-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Appliance</label>
                <select className="rv-input" style={{ width: '100%', padding: '1rem', border: '1px solid var(--rv-color-border)', borderRadius: '8px' }} required>
                  <option value="">-- Choose an active rental --</option>
                  {mockRentals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="rv-section-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Describe the issue or request</label>
                <textarea rows="4" className="rv-input" placeholder={`e.g., "The cooling has dropped recently" or "I am moving to a new address next week..."`} style={{ width: '100%', padding: '1rem', border: '1px solid var(--rv-color-border)', borderRadius: '8px', resize: 'vertical' }} required></textarea>
              </div>

              <button type="submit" className="rv-button rv-button--signal" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                {requestSent ? 'Ticket Submitted Successfully' : 'Submit Request'}
              </button>
            </form>
          )}

        </section>

        <aside className="rv-sticky-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recent Tickets</h2>
          <div style={{ padding: '1.5rem', border: '1px solid var(--rv-color-border)', borderRadius: '8px', background: 'var(--rv-color-background)' }}>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: '#f59e0b20', color: '#d97706', fontSize: '0.75rem', fontWeight: 700, borderRadius: '4px', marginBottom: '0.5rem' }}>In Progress</span>
            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Washing Machine Repair</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Technician assigned for tomorrow 2PM.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock3, Truck, UserRound, Wrench, XCircle, Package, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/media';
import DeliveryStoryView from '../components/DeliveryStoryView';

const STATUS_CONFIG = {
  scheduled:   { label: 'Scheduled',   icon: Calendar,      color: '#3b82f6', bg: '#3b82f615' },
  in_progress: { label: 'In Progress', icon: Clock3,        color: '#f59e0b', bg: '#f59e0b15' },
  completed:   { label: 'Completed',   icon: CheckCircle2,  color: '#10b981', bg: '#10b98115' },
  cancelled:   { label: 'Cancelled',   icon: XCircle,       color: '#ef4444', bg: '#ef444415' },
};

// Delivery Tracking Component
function DeliveryTracker({ status }) {
  // Map our backend statuses to a linear progress flow
  const steps = [
    { key: 'scheduled', label: 'Order Placed', icon: Package },
    { key: 'in_progress', label: 'In Transit', icon: Truck },
    { key: 'completed', label: 'Delivered', icon: CheckCircle2 }
  ];

  let currentStepIndex = 0;
  if (status === 'in_progress') currentStepIndex = 1;
  if (status === 'completed') currentStepIndex = 2;

  if (status === 'cancelled') {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <XCircle size={24} />
        <div>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Installation Cancelled</h4>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>This order has been cancelled and will not be delivered.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--rv-color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        {/* Background Line */}
        <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', background: 'var(--rv-color-border)', zIndex: 1 }} />
        
        {/* Active Line (Progress) */}
        <div style={{ position: 'absolute', top: '24px', left: '10%', right: `calc(100% - ${(currentStepIndex / (steps.length - 1)) * 80 + 10}%)`, height: '2px', background: 'var(--rv-color-primary)', zIndex: 1, transition: 'right 0.5s ease-in-out' }} />
        
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const Icon = step.icon;
          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', zIndex: 2, width: '33%' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', 
                background: isActive ? 'var(--rv-color-primary)' : '#fff', 
                border: `2px solid ${isActive ? 'var(--rv-color-primary)' : 'var(--rv-color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isActive ? '#fff' : 'var(--rv-color-secondary)',
                transition: 'all 0.3s'
              }}>
                <Icon size={20} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--rv-color-primary)' : 'var(--rv-color-secondary)' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Installations() {
  const { user } = useContext(AuthContext);
  const [installations, setInstallations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchInstallations(); }, []);

  const fetchInstallations = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('installations/');
      setInstallations(res.data);
    } catch (err) {
      console.error(err);
      // Mock data for UI testing if API fails
      setInstallations([
        { id: 101, appliance_name: 'Aero Modular Sofa', status: 'in_progress', tenant_name: 'John Doe', technician_name: 'Ravi Kumar', scheduled_date: new Date().toISOString() },
        { id: 102, appliance_name: 'Quantum 8K OLED Display', status: 'scheduled', tenant_name: 'John Doe', scheduled_date: new Date(Date.now() + 86400000).toISOString() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`installations/${id}/`, { status });
      fetchInstallations();
    } catch (err) {
      console.error(err);
      // Optimistic update for UI testing
      setInstallations(prev => prev.map(inst => inst.id === id ? { ...inst, status } : inst));
    }
  };

  const tabs = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  const filtered = useMemo(() => {
    if (filter === 'All') return installations;
    return installations.filter(
      (item) => item.status.toLowerCase().replace('_', ' ') === filter.toLowerCase()
    );
  }, [filter, installations]);

  const counts = useMemo(() => {
    const c = { scheduled: 0, in_progress: 0, completed: 0, cancelled: 0 };
    installations.forEach(i => { if (c[i.status] !== undefined) c[i.status]++; });
    return c;
  }, [installations]);

  return (
    <>
      <DeliveryStoryView />
      <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="rv-section-heading" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="rv-section-label">
            <Truck size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Installations
          </span>
          <h2>Track delivery &amp; setup.</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} style={{ padding: '1.25rem', background: '#fff', border: '1px solid var(--rv-color-border)', borderRadius: 'var(--rv-radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={cfg.color} />
              </div>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{counts[key] || 0}</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--rv-color-secondary)', margin: 0 }}>{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rv-filters-bar" style={{ marginBottom: '2rem' }}>
        {tabs.map((tab) => (
          <div key={tab} className={`rv-filter-pill ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
            {tab}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} style={{ height: '300px', background: 'var(--rv-color-border)', borderRadius: 'var(--rv-radius-lg)', opacity: 0.5 }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {filtered.map((item) => {
            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.scheduled;
            const Icon = cfg.icon;
            return (
              <article key={item.id} style={{ background: '#fff', border: '1px solid var(--rv-color-border)', borderRadius: 'var(--rv-radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', boxShadow: 'var(--rv-shadow-sm)' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Order #{item.id}</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem', margin: 0 }}>{item.appliance_name || 'Appliance'}</h3>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: cfg.bg, color: cfg.color, borderRadius: '99px', fontSize: '0.875rem', fontWeight: 700 }}>
                    <Icon size={16} /> {cfg.label}
                  </span>
                </div>

                {/* Tracking UI */}
                <DeliveryTracker status={item.status} />

                {/* Details Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: 'var(--rv-color-background)', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rv-color-secondary)' }}><UserRound size={16} /></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--rv-color-secondary)' }}>Recipient</p>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--rv-color-primary)' }}>{item.tenant_name || 'N/A'}</strong>
                    </div>
                  </div>
                  
                  {item.technician_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rv-color-secondary)' }}><Wrench size={16} /></div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--rv-color-secondary)' }}>Logistics Partner</p>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--rv-color-primary)' }}>{item.technician_name}</strong>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rv-color-secondary)' }}><Calendar size={16} /></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--rv-color-secondary)' }}>Est. Delivery</p>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--rv-color-primary)' }}>{formatDate(item.scheduled_date)}</strong>
                    </div>
                  </div>
                </div>

                {/* Admin/Owner Controls */}
                {(!user || user?.role === 'owner' || user?.role === 'admin') &&
                  item.status !== 'completed' && item.status !== 'cancelled' && (
                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--rv-color-border)' }}>
                      {item.status === 'scheduled' && (
                        <button onClick={() => updateStatus(item.id, 'in_progress')} className="rv-button rv-button--signal" style={{ flex: 1 }}>
                          Dispatch Order <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                        </button>
                      )}
                      {item.status === 'in_progress' && (
                        <button onClick={() => updateStatus(item.id, 'completed')} className="rv-button rv-button--signal" style={{ flex: 1, background: '#10b981' }}>
                          Mark Delivered <CheckCircle2 size={16} style={{ marginLeft: '0.5rem' }} />
                        </button>
                      )}
                      <button onClick={() => updateStatus(item.id, 'cancelled')} className="rv-button rv-button--light" style={{ color: '#ef4444' }}>
                        Cancel Order
                      </button>
                    </div>
                  )}
              </article>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--rv-color-secondary)' }}>
          <Truck size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h3>No installations found</h3>
          <p>Try a different filter above.</p>
        </div>
      )}
    </main>
    </>
  );
}

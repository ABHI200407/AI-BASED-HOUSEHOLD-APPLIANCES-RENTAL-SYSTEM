import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock3, Truck, UserRound, Wrench, XCircle } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/media';

const STATUS_CONFIG = {
  scheduled:   { label: 'Scheduled',   icon: Calendar,      color: '#3b82f6', bg: '#3b82f615' },
  in_progress: { label: 'In Progress', icon: Clock3,        color: '#f59e0b', bg: '#f59e0b15' },
  completed:   { label: 'Completed',   icon: CheckCircle2,  color: '#10b981', bg: '#10b98115' },
  cancelled:   { label: 'Cancelled',   icon: XCircle,       color: '#ef4444', bg: '#ef444415' },
};

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
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="rv-section-heading" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="rv-section-label">
            <Truck size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Installations
          </span>
          <h2>Track delivery &amp; setup.</h2>
        </div>
        <Link to="/my-bookings" className="rv-button rv-button--light">My Bookings</Link>
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
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{counts[key]}</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: '220px', background: 'var(--rv-color-border)', borderRadius: 'var(--rv-radius-md)', opacity: 0.5 }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((item) => {
            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.scheduled;
            const Icon = cfg.icon;
            return (
              <article key={item.id} style={{ background: '#fff', border: '1px solid var(--rv-color-border)', borderRadius: 'var(--rv-radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rv-color-secondary)', fontWeight: 600 }}>Installation #{item.id}</span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '0.25rem' }}>{item.appliance_name || 'Appliance'}</h3>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', background: cfg.bg, color: cfg.color, borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <Icon size={13} /> {cfg.label}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
                    <UserRound size={15} /> Tenant: <strong style={{ color: 'var(--rv-color-primary)' }}>{item.tenant_name || 'N/A'}</strong>
                  </div>
                  {item.technician_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
                      <Wrench size={15} /> Technician: <strong>{item.technician_name}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
                    <Calendar size={15} /> Scheduled: <strong>{formatDate(item.scheduled_date)}</strong>
                  </div>
                  {item.completed_at && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                      <CheckCircle2 size={15} /> Completed: <strong>{formatDate(item.completed_at)}</strong>
                    </div>
                  )}
                  {item.notes && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)', background: 'var(--rv-color-background)', padding: '0.75rem', borderRadius: '8px', margin: 0, fontStyle: 'italic' }}>
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {(user?.role === 'owner' || user?.role === 'admin') &&
                  item.status !== 'completed' && item.status !== 'cancelled' && (
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--rv-color-border)' }}>
                      {item.status === 'scheduled' && (
                        <button onClick={() => updateStatus(item.id, 'in_progress')} className="rv-button rv-button--signal" style={{ flex: 1 }}>
                          Start Setup
                        </button>
                      )}
                      {item.status === 'in_progress' && (
                        <button onClick={() => updateStatus(item.id, 'completed')} className="rv-button rv-button--signal" style={{ flex: 1 }}>
                          Mark Complete
                        </button>
                      )}
                      <button onClick={() => updateStatus(item.id, 'cancelled')} className="rv-button rv-button--light" style={{ color: '#ef4444' }}>
                        Cancel
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
  );
}

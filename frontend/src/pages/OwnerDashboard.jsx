import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Layers3, PackageSearch, Plus, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { resolveMediaUrl } from '../utils/media';

export default function OwnerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [myAppliances, setMyAppliances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) fetchMyAppliances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyAppliances = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('appliances/', { params: { owner_id: user.id } });
      setMyAppliances(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const total = myAppliances.length;
    const available = myAppliances.filter((item) => item.available).length;
    const rented = total - available;
    return [
      { value: total, label: 'Listings' },
      { value: available, label: 'Available now' },
      { value: rented, label: 'Currently rented' },
      { value: '24h', label: 'Service response' },
    ];
  }, [myAppliances]);

  return (
    <main className="dashboard-layout">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">
            <Layers3 size={14} />
            Owner dashboard
          </div>
          <h1>Inventory command center.</h1>
        </div>

        <div className="header-actions">
          <span className="welcome-text">Hi, {user?.full_name}</span>
          <Link to="/owner/bookings" className="btn btn-secondary">
            Bookings
          </Link>
          <Link to="/owner/add-appliance" className="btn btn-primary">
            <Plus size={16} />
            Add listing
          </Link>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-metrics">
        {metrics.map((metric) => (
          <article key={metric.label} className="dashboard-card">
            <strong className="metric-value">{metric.value}</strong>
            <div className="metric-label">{metric.label}</div>
          </article>
        ))}
      </div>

      <section className="surface-card" style={{ padding: '22px', marginBottom: '24px' }}>
        <div className="eyebrow">
          <Sparkles size={14} />
          Quick actions
        </div>
        <div className="stack" style={{ marginTop: '12px' }}>
          <p className="qna-note">
            Add items, track bookings, and keep your rental catalog ready for the next move.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/owner/add-appliance" className="btn btn-primary">
              <Plus size={16} />
              Add appliance
            </Link>
            <Link to="/owner/bookings" className="btn btn-secondary">
              <Calendar size={16} />
              Manage bookings
            </Link>
          </div>
        </div>
      </section>

      <div className="section-head" style={{ marginTop: '0' }}>
        <div>
          <div className="eyebrow">
            <PackageSearch size={14} />
            My listed appliances
          </div>
          <p className="section-copy">A compact view of your active listings and their status.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <span>Loading your inventory...</span>
        </div>
      ) : myAppliances.length > 0 ? (
        <div className="grid-4">
          {myAppliances.map((item) => {
            const image = resolveMediaUrl(item.images?.[0], '/images/hero-banner.jpg');
            return (
              <article key={item.id} className="premium-card">
                <div className="premium-card-img-wrapper">
                  <img src={image} alt={item.name} className="premium-card-img" />
                </div>
                <div className="premium-card-content">
                  <div className="premium-card-brand">{item.category}</div>
                  <h3 className="premium-card-title">{item.name}</h3>
                  <p className="premium-card-copy">{item.location || 'City coverage ready'}</p>
                  <div className="premium-card-actions">
                    <p className="premium-card-price">
                      ₹{item.price_per_day} <span>/day</span>
                    </p>
                    <span className={`badge ${item.available ? 'badge-success' : 'badge-warning'}`}>
                      {item.available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <PackageSearch size={68} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: '10px' }}>
            No listings yet
          </h3>
          <p>Add your first appliance or furniture item to start receiving bookings.</p>
        </div>
      )}
    </main>
  );
}

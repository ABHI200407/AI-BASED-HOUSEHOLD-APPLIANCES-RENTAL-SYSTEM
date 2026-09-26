import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, PackageSearch, ShieldCheck, XCircle } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatDate, formatINR } from '../utils/media';

export default function TenantBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('bookings/');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.patch(`bookings/${id}/`, { status: 'cancelled' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const statusLabel = (status) => status.replace('_', ' ');

  return (
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="rv-section-heading" style={{ marginBottom: '3rem' }}>
        <div>
          <span className="rv-section-label"><Calendar size={14} style={{display:'inline', verticalAlign:'middle'}}/> My bookings</span>
          <h2>Track every rental in one place.</h2>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: 'var(--rv-radius-xl)', border: '1px solid var(--rv-color-border)' }}>
          <PackageSearch size={72} style={{ margin: '0 auto 1rem', color: 'var(--rv-color-secondary)', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--rv-font-display)' }}>No bookings yet</h2>
          <p style={{ color: 'var(--rv-color-secondary)', marginBottom: '2rem' }}>Shortlist something from the catalog and your rental history will appear here.</p>
          <Link to="/catalog" className="rv-button rv-button--signal">
            Start browsing
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))', gap: '2rem' }}>
          {bookings.map((booking) => (
            <article key={booking.id} className="rv-booking-card">
              <div className="rv-booking-card__header">
                <div>
                  <span className={`rv-booking-card__status rv-booking-card__status--${booking.status}`}>
                    {statusLabel(booking.status)}
                  </span>
                  <Link to={`/appliance/${booking.appliance_id}`} style={{ display: 'block', fontFamily: 'var(--rv-font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--rv-color-primary)', textDecoration: 'none', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                    {booking.appliance_name}
                  </Link>
                  <span style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
                    Booking reference #{booking.id}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ padding: '0.5rem 1rem', background: 'var(--rv-color-primary)', color: '#fff', borderRadius: '99px', fontWeight: 700 }}>
                    {formatINR(booking.total_amount)}
                  </div>
                  {booking.status !== 'cancelled' && booking.status !== 'requested' && (
                    <Link to="/installations" className="rv-button rv-button--signal" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', marginTop: '0.5rem' }}>
                      Track Delivery
                    </Link>
                  )}
                  {booking.status !== 'cancelled' && (
                    <Link to="/service-requests" className="rv-button rv-button--light" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', marginTop: '0.5rem' }}>
                      Request Service
                    </Link>
                  )}
                </div>
              </div>

              <div className="rv-booking-card__grid">
                <div className="rv-booking-card__spec">
                  <label><Calendar size={14} /> Start Date</label>
                  <span>{formatDate(booking.start_date)}</span>
                </div>
                <div className="rv-booking-card__spec">
                  <label><Calendar size={14} /> End Date</label>
                  <span>{formatDate(booking.end_date)}</span>
                </div>
                <div className="rv-booking-card__spec">
                  <label><ShieldCheck size={14} /> Rental Plan</label>
                  <span>{booking.tenure ? `${booking.tenure} Months` : 'Flexible tenure'}</span>
                </div>
                <div className="rv-booking-card__spec">
                  <label><Calendar size={14} /> Booking Date</label>
                  <span>{formatDate(booking.created_at || new Date().toISOString())}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)', fontWeight: 600 }}>
                  Current status: {statusLabel(booking.status)}
                </span>
                
                {booking.status === 'requested' && (
                  <button onClick={() => cancelBooking(booking.id)} className="rv-button rv-button--light" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <XCircle size={16} /> Cancel booking
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

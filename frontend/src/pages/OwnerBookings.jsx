import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, PackageSearch, ShieldCheck, XCircle } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatDate, formatINR } from '../utils/media';

export default function OwnerBookings() {
  const { user, logout } = useContext(AuthContext);
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

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`bookings/${id}/`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update booking status');
    }
  };

  const statusLabel = (status) => status.replace('_', ' ');

  return (
    <main className="dashboard-layout">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">
            <Calendar size={14} />
            Booking queue
          </div>
          <h1>Manage booking requests.</h1>
        </div>

        <div className="header-actions">
          <span className="welcome-text">Hi, {user?.full_name}</span>
          <Link to="/owner" className="btn btn-secondary">
            My listings
          </Link>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state card" style={{ padding: '56px 24px' }}>
          <PackageSearch size={68} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: '10px' }}>
            No booking requests
          </h3>
          <p>When customers book your listings, the approvals will show up here.</p>
        </div>
      ) : (
        <div className="grid-2">
          {bookings.map((booking) => (
            <article key={booking.id} className="card" style={{ padding: '22px' }}>
              <div className="stack" style={{ gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' }}>
                  <div className="stack" style={{ gap: '8px' }}>
                    <span className={`install-status status-${booking.status}`}>{statusLabel(booking.status)}</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                      {booking.tenant_name}
                    </div>
                    <Link to={`/appliance/${booking.appliance_id}`} className="qna-note">
                      {booking.appliance_name}
                    </Link>
                  </div>
                  <span className="badge badge-success">{formatINR(booking.total_amount)}</span>
                </div>

                <div className="spec-grid">
                  <div className="spec-card">
                    <div className="eyebrow">
                      <Calendar size={14} />
                      Dates
                    </div>
                    <p className="qna-note">
                      {formatDate(booking.start_date)} to {formatDate(booking.end_date)}
                    </p>
                  </div>
                  <div className="spec-card">
                    <div className="eyebrow">
                      <ShieldCheck size={14} />
                      Status
                    </div>
                    <p className="qna-note">{statusLabel(booking.status)}</p>
                  </div>
                </div>

                <div className="install-actions">
                  {booking.status === 'requested' && (
                    <>
                      <button onClick={() => updateStatus(booking.id, 'approved')} className="btn btn-primary">
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                      <button onClick={() => updateStatus(booking.id, 'rejected')} className="btn btn-danger">
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <>
                      <button onClick={() => updateStatus(booking.id, 'active')} className="btn btn-primary">
                        <CheckCircle2 size={16} />
                        Mark active
                      </button>
                      <button onClick={() => updateStatus(booking.id, 'cancelled')} className="btn btn-danger">
                        <XCircle size={16} />
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'active' && (
                    <button onClick={() => updateStatus(booking.id, 'returned')} className="btn btn-secondary">
                      <CheckCircle2 size={16} />
                      Mark returned
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

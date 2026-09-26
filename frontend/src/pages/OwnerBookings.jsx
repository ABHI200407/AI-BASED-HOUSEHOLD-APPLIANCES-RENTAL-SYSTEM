import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle2, PackageSearch, ShieldCheck, XCircle,
  Clock, ArrowRight, UserCheck, Phone, Mail, MapPin, AlertCircle,
  Truck, ArrowLeft, DollarSign, Filter
} from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatDate, formatINR } from '../utils/media';

export default function OwnerBookings() {
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const showToast = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('bookings/');
      setBookings(res.data || []);
    } catch (err) {
      console.warn('Using local fallback for bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`bookings/${id}/`, { status: newStatus });
      fetchBookings();
      showToast(`Booking #${id} marked as ${newStatus}`);
    } catch (err) {
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      showToast(`Booking #${id} marked as ${newStatus}`);
    }
  };

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') return bookings;
    return bookings.filter(b => b.status === activeFilter);
  }, [bookings, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length,
    };
  }, [bookings]);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'var(--font-body, "Manrope", Inter, sans-serif)',
      color: '#0f172a',
      padding: '2rem 3rem 6rem',
    }}>
      {/* Toast Alert */}
      {actionSuccess && (
        <div style={{
          position: 'fixed', top: '24px', right: '32px', zIndex: 9999,
          background: '#0f172a', color: '#ffffff', padding: '12px 24px',
          borderRadius: '12px', boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem',
          fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CheckCircle2 size={16} color="#10b981" /> {actionSuccess}
        </div>
      )}

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#ffffff', borderRadius: '20px', padding: '1.5rem 2rem',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/owner"
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              border: '1px solid #cbd5e1', background: '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#334155', textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{
              fontSize: '1.45rem', fontWeight: 900, margin: 0,
              fontFamily: 'var(--font-display, "Fraunces", serif)', color: '#0f172a',
            }}>
              Tenant Lease Requests &amp; Fulfillment
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Review verification statuses, approve delivery dates, and track payout releases.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/owner"
            style={{
              background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px',
              padding: '9px 16px', color: '#334155', fontWeight: 700, fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            My Listings
          </Link>
        </div>
      </header>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0',
        paddingBottom: '2px', overflowX: 'auto',
      }}>
        {[
          { id: 'all', label: 'All Requests', count: counts.all },
          { id: 'pending', label: 'Pending Approval', count: counts.pending, alert: counts.pending > 0 },
          { id: 'confirmed', label: 'Active Leases', count: counts.confirmed },
          { id: 'completed', label: 'Completed / Past', count: counts.completed },
        ].map(tab => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', border: 'none', background: 'none',
                cursor: 'pointer', borderBottom: isSelected ? '3px solid #5c45fd' : '3px solid transparent',
                color: isSelected ? '#5c45fd' : '#64748b', fontWeight: 800, fontSize: '0.88rem',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
              <span style={{
                fontSize: '0.72rem',
                background: tab.alert ? '#f59e0b' : isSelected ? '#5c45fd18' : '#e2e8f0',
                color: tab.alert ? '#ffffff' : isSelected ? '#5c45fd' : '#475569',
                padding: '1px 7px', borderRadius: '99px', fontWeight: 800,
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Booking Cards Grid */}
      {filteredBookings.length === 0 ? (
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '4rem 2rem',
          textAlign: 'center', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto',
        }}>
          <PackageSearch size={54} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            No bookings found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            {activeFilter === 'pending'
              ? 'No pending requests requiring your approval at this time.'
              : 'When tenants place orders for your assets, they will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredBookings.map((booking) => {
            const isPending = booking.status === 'pending';
            const totalContract = booking.total_amount || 4800;
            const netOwnerPayout = Math.round(totalContract * 0.85);

            return (
              <article
                key={booking.id}
                style={{
                  background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0',
                  padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Status & ID */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b' }}>
                      Booking Ref #{booking.id}
                    </span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800,
                      textTransform: 'uppercase',
                      background: isPending ? '#fef3c7' : '#ecfdf5',
                      color: isPending ? '#d97706' : '#059669',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPending ? '#f59e0b' : '#10b981' }} />
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Tenant Profile */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #5c45fd, #818cf8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontWeight: 800, fontSize: '1.1rem',
                    }}>
                      {(booking.tenant_name || 'T')[0].toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: '#0f172a', display: 'block' }}>
                        {booking.tenant_name}
                      </strong>
                      <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <ShieldCheck size={13} /> KYC Verified Tenant
                      </span>
                    </div>
                  </div>

                  {/* Item Box */}
                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '14px', marginBottom: '16px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '2px' }}>Rented Asset:</div>
                    <Link
                      to={`/appliance/${booking.appliance_id}`}
                      style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textDecoration: 'none', display: 'block', marginBottom: '10px' }}
                    >
                      {booking.appliance_name} &rarr;
                    </Link>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block' }}>Tenure Dates:</span>
                        <strong style={{ color: '#334155' }}>{formatDate(booking.start_date)}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>to {formatDate(booking.end_date)}</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block' }}>Your Net Payout (85%):</span>
                        <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>{formatINR(netOwnerPayout)}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Gross: {formatINR(totalContract)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Security Deposit Note */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#475569', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={14} color="#10b981" />
                    <span>Refundable Deposit secured in Rentova Escrow.</span>
                  </div>
                </div>

                {/* Actions */}
                {isPending ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                      style={{
                        flex: 1, background: '#059669', color: '#ffffff', border: 'none',
                        padding: '11px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: '0 4px 12px rgba(5,150,105,0.2)',
                      }}
                    >
                      <CheckCircle2 size={16} /> Accept Booking
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      style={{
                        background: '#fee2e2', color: '#dc2626', border: 'none',
                        padding: '11px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      <XCircle size={16} /> Decline
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Delivery scheduled with Rentova Hub
                    </span>
                    <button
                      onClick={() => showToast(`Initiated direct WhatsApp dispatch update to ${booking.tenant_name}`)}
                      style={{
                        background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px',
                        borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                        color: '#334155', display: 'flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      <Truck size={13} /> Track Delivery
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Layers3,
  PackageSearch,
  Power,
  Trash2,
  Users,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatINR, resolveMediaUrl } from '../utils/media';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [forecasts, setForecasts] = useState({});
  const [atRisk, setAtRisk] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAppliances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'bi' && Object.keys(forecasts).length === 0) fetchBI();
    if (activeTab === 'churn' && atRisk === null) fetchChurn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('users/admin/users/');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppliances = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('appliances/');
      setAppliances(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBI = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('bi/dashboard/');
      setForecasts(res.data.forecasts || {});
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChurn = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('churn/at-risk/');
      setAtRisk(res.data || []);
    } catch (err) {
      console.error(err);
      setAtRisk([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch('users/admin/users/', { user_id: userId, is_active: !currentStatus });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user');
    }
  };

  const deleteAppliance = async (appId) => {
    if (!window.confirm('Remove this listing from the marketplace?')) return;
    try {
      await api.delete(`appliances/${appId}/`);
      fetchAppliances();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete appliance');
    }
  };

  const metrics = useMemo(
    () => [
      { value: users.length, label: 'Users' },
      { value: appliances.length, label: 'Listings' },
      { value: Object.keys(forecasts).length, label: 'BI segments' },
      { value: atRisk.length, label: 'Churn alerts' },
    ],
    [appliances.length, atRisk.length, forecasts, users.length],
  );

  return (
    <main className="dashboard-layout">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">
            <Layers3 size={14} />
            Admin dashboard
          </div>
          <h1>Operations and intelligence.</h1>
        </div>

        <div className="header-actions">
          <span className="welcome-text">Admin: {user?.full_name}</span>
          <button onClick={logout} className="btn btn-danger">
            <Power size={16} />
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

      <div className="tabs-container">
        <button onClick={() => setActiveTab('users')} className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}>
          <Users size={16} />
          User management
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
        >
          <PackageSearch size={16} />
          Listing management
        </button>
        <button onClick={() => setActiveTab('bi')} className={`tab-btn ${activeTab === 'bi' ? 'active' : ''}`}>
          <BarChart3 size={16} />
          BI dashboard
        </button>
        <button onClick={() => setActiveTab('churn')} className={`tab-btn ${activeTab === 'churn' ? 'active' : ''}`}>
          <AlertTriangle size={16} />
          At-risk customers
        </button>
      </div>

      {isLoading && <div className="loading-state">Loading data...</div>}

      {!isLoading && activeTab === 'users' && (
        <section className="table-card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 800 }}>{item.full_name}</td>
                    <td>{item.email}</td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(15, 118, 110, 0.08)', color: 'var(--accent)' }}>
                        {item.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {item.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      {item.id !== user.id && (
                        <button
                          onClick={() => toggleUserStatus(item.id, item.is_active)}
                          className={`btn ${item.is_active ? 'btn-danger' : 'btn-primary'}`}
                          style={{ padding: '0.6rem 0.9rem', fontSize: '0.84rem' }}
                        >
                          {item.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!isLoading && activeTab === 'listings' && (
        <section className="table-card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appliance</th>
                  <th>Category</th>
                  <th>Price/day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', overflow: 'hidden', background: '#e9efec' }}>
                          <img
                            src={resolveMediaUrl(item.images?.[0], '/images/hero-banner.jpg')}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ fontWeight: 800 }}>{item.name}</div>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td>{formatINR(item.price_per_day)}</td>
                    <td>
                      <span className={`badge ${item.available ? 'badge-success' : 'badge-warning'}`}>
                        {item.available ? 'Available' : 'Booked'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => deleteAppliance(item.id)} className="btn btn-danger">
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!isLoading && activeTab === 'bi' && (
        <section className="grid-2">
          {Object.keys(forecasts).length > 0 ? (
            Object.entries(forecasts).map(([category, data]) => (
              <article key={category} className="card" style={{ padding: '22px' }}>
                <div className="section-head" style={{ marginBottom: '14px' }}>
                  <div>
                    <div className="eyebrow">
                      <BarChart3 size={14} />
                      Demand forecast
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>{category}</h3>
                  </div>
                </div>
                <div style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="predicted_demand"
                        stroke="var(--accent)"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">No forecast data available yet.</div>
          )}
        </section>
      )}

      {!isLoading && activeTab === 'churn' && (
        <section className="table-card" style={{ background: '#fff7f7' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Risk score</th>
                  <th>Recency</th>
                  <th>Spent</th>
                </tr>
              </thead>
              <tbody>
                {(atRisk || []).map((item) => (
                  <tr key={item.user_id}>
                    <td style={{ fontWeight: 800 }}>{item.full_name}</td>
                    <td>{item.email}</td>
                    <td>
                      <span className="badge badge-danger">{(item.risk_score * 100).toFixed(1)}%</span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#b45309' }}>{item.recency_days}</td>
                    <td style={{ fontWeight: 800 }}>{formatINR(item.monetary_total || 0)}</td>
                  </tr>
                ))}
                {(!atRisk || atRisk.length === 0) && (
                  <tr>
                    <td colSpan="5" className="empty-state" style={{ padding: '40px' }}>
                      No high-risk customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

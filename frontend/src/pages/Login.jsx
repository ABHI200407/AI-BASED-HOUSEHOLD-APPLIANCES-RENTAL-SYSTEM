import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Briefcase,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const performLogin = async (userEmail, userPassword) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('users/login/', {
        email: userEmail.trim(),
        password: userPassword
      });

      const data = response.data;

      // Update AuthContext state and persist JWT tokens in localStorage
      login(
        {
          id: data.id,
          email: data.email,
          role: data.role,
          full_name: data.full_name
        },
        {
          access: data.access,
          refresh: data.refresh
        }
      );

      // Role-based redirect
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleQuickLogin = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    performLogin(roleEmail, rolePassword);
  };

  const handleSkip = () => {
    login(
      { id: 'guest', email: 'guest@example.com', role: 'tenant', full_name: 'Guest Tenant' },
      { access: 'dummy', refresh: 'dummy' }
    );
    navigate('/catalog');
  };

  return (
    <div className="auth-layout">
      {/* Left Brand Panel — Matching RentAI Editorial Tone */}
      <div className="auth-brand-panel">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="brand-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <span className="hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} color="#818cf8" /> Real-World Ecosystem Simulation
            </span>
          </div>

          <h1 className="brand-title">RentAI.</h1>
          <p className="brand-tagline">
            Smart household appliances on flexible rental terms, backed by behavioral machine learning and real-time state simulation.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#ffffff' }}>
                  AI Recommendation Engine
                </strong>
                <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: 'rgba(248, 250, 252, 0.72)', lineHeight: 1.5 }}>
                  Collaborative filtering and latent matrix factorization grounded in empirical interaction datasets.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Shield size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#ffffff' }}>
                  Data Provenance Tracking
                </strong>
                <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: 'rgba(248, 250, 252, 0.72)', lineHeight: 1.5 }}>
                  Transparent separation across Source datasets, Application models, and Simulation event logs.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#ffffff' }}>
                  Ecosystem State Machine
                </strong>
                <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: 'rgba(248, 250, 252, 0.72)', lineHeight: 1.5 }}>
                  Deterministic virtual clock driving lease maturity, technician dispatch, maintenance, and refunds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel — Using Native RentAI Card Tokens */}
      <div className="auth-form-panel">
        <div className="auth-card card">
          <div style={{ marginBottom: '1.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>
              Sign In
            </span>
            <h3 style={{ margin: '4px 0 6px 0', fontSize: '2rem' }}>Welcome back.</h3>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.94rem', margin: 0 }}>
              Access your rental account or the administrative simulation center.
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div
            style={{
              background: 'rgba(92, 69, 253, 0.05)',
              border: '1px solid rgba(92, 69, 253, 0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              marginBottom: '1.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                1-Click Quick Demo Login
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pre-seeded</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@rentai.com', 'adminpassword123')}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(92, 69, 253, 0.25)',
                  borderRadius: '12px',
                  padding: '8px 4px',
                  color: 'var(--accent)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.18s ease'
                }}
              >
                <Shield size={16} /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin_owner@rentai.com', 'password123')}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(15, 23, 32, 0.12)',
                  borderRadius: '12px',
                  padding: '8px 4px',
                  color: 'var(--text)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.18s ease'
                }}
              >
                <Briefcase size={16} /> Owner
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('cust_0001@rentai.sim', 'simpass123')}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(15, 23, 32, 0.12)',
                  borderRadius: '12px',
                  padding: '8px 4px',
                  color: 'var(--text)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.18s ease'
                }}
              >
                <UserCheck size={16} /> Tenant
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="auth-input-wrapper">
              <Mail className="icon-left" size={18} />
              <input
                type="email"
                className="input auth-input"
                placeholder="Email address (e.g. admin@rentai.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-wrapper">
              <Lock className="icon-left" size={18} />
              <input
                type="password"
                className="input auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary auth-btn">
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={17} />}
            </button>
          </form>

          <div style={{ marginTop: '1.4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-soft)' }}>
            <div>
              <button
                type="button"
                onClick={handleSkip}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', font: 'inherit' }}
              >
                Skip login as Guest Tenant →
              </button>
            </div>

            <div>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'underline' }}>
                Sign up
              </Link>
            </div>

            <div>
              <Link to="/tour" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                Take visual product tour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Home as HomeIcon, User, Phone } from 'lucide-react';
import api from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant',
    address: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('users/register/', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color, white)' }}>
      {/* Centered Form Area */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'white' }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
            <div style={{ background: 'var(--primary-color, #ef4444)', padding: '0.4rem', borderRadius: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HomeIcon size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color, #ef4444)' }}>RentAI</h2>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--secondary-color, #111827)' }}>
              Create an account
            </h1>
            <p style={{ color: 'var(--text-secondary, #6b7280)', lineHeight: '1.5' }}>
              Join thousands of users who have upgraded their lifestyle.
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', borderLeft: '4px solid var(--primary-color, #ef4444)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', color: '#b91c1c', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Username / Full Name */}
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary, #9ca3af)', width: '1.25rem', height: '1.25rem' }} />
                <input 
                  type="text" 
                  id="full_name"
                  className="input-field" 
                  placeholder="Enter your username" 
                  value={formData.full_name}
                  onChange={handleChange}
                  style={{ paddingLeft: '3rem', width: '100%', padding: '0.875rem 0.875rem 0.875rem 3rem', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                  required 
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary, #9ca3af)', width: '1.25rem', height: '1.25rem' }} />
                <input 
                  type="email" 
                  id="email"
                  className="input-field" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '3rem', width: '100%', padding: '0.875rem 0.875rem 0.875rem 3rem', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                  required 
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary, #9ca3af)', width: '1.25rem', height: '1.25rem' }} />
                <input 
                  type="text" 
                  id="phone"
                  className="input-field" 
                  placeholder="Enter your phone number" 
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '3rem', width: '100%', padding: '0.875rem 0.875rem 0.875rem 3rem', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary, #9ca3af)', width: '1.25rem', height: '1.25rem' }} />
                <input 
                  type="password" 
                  id="password"
                  className="input-field" 
                  placeholder="••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '3rem', width: '100%', padding: '0.875rem 0.875rem 0.875rem 3rem', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                  required 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', background: 'var(--primary-color, #ef4444)', color: 'white', border: 'none', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
              {!isLoading && <ArrowRight size={18} />}
            </button>

          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary, #6b7280)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color, #ef4444)', textDecoration: 'none', fontWeight: '600' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

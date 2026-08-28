import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      if (onLogin) onLogin(data.access);
      // Let's also set it in AuthContext if possible, but the original logic didn't use it.
      // We'll stick to what we need for guest.
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    login(
      { id: 'guest', email: 'guest@example.com', role: 'tenant', full_name: 'Guest User' },
      { access: 'dummy', refresh: 'dummy' }
    );
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'black' }}>
      {/* Centered Form Area */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'black' }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
            <div style={{ background: '#3b82f6', padding: '0.4rem', borderRadius: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HomeIcon size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#3b82f6' }}>RentAI</h2>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
              Welcome back
            </h1>
            <p style={{ color: '#9ca3af', lineHeight: '1.5' }}>Sign in to manage your rentals and packages.</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', color: '#b91c1c', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '1.25rem', height: '1.25rem' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '3rem', width: '100%', padding: '0.875rem 0.875rem 0.875rem 3rem', boxSizing: 'border-box', border: '1px solid #374151', borderRadius: '0.5rem', outline: 'none', background: '#1f2937', color: 'white' }}
                  required 
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="input-label" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb' }}>Password</label>
                <a href="#" style={{ fontSize: '0.875rem', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '1.25rem', height: '1.25rem' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '3rem', width: '100%', padding: '0.875rem 0.875rem 0.875rem 3rem', boxSizing: 'border-box', border: '1px solid #374151', borderRadius: '0.5rem', outline: 'none', background: '#1f2937', color: 'white' }}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            <button type="button" onClick={handleSkip} style={{ background: 'none', border: 'none', color: '#3b82f6', textDecoration: 'none', fontWeight: '600', cursor: 'pointer', padding: 0, font: 'inherit' }}>
              Skip for now
            </button>
          </p>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

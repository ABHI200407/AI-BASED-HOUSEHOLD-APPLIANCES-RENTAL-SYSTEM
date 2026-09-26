import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { CityContext } from '../context/CityContext';
import { cityOptions } from '../data/experience';
import {
  LogOut, MapPin, Search, ShoppingBag, UserCircle2, X, ChevronDown, Sparkles, Menu, ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { city, changeCity } = useContext(CityContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location.pathname]);



  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = useMemo(() => {
    if (!user) return [
      { to: '/', label: 'Home' },
      { to: '/new-drops', label: 'New Drops' },
      { to: '/financials', label: 'Financials' },
      { to: '/journal', label: 'Journal' },
      { to: '/catalog', label: 'Browse' },
      { to: '#how-it-works', label: 'How it Works' },
    ];
    if (user.role === 'owner') return [
      { to: '/owner', label: 'Dashboard' },
      { to: '/owner/bookings', label: 'Bookings' },
      { to: '/owner/add-appliance', label: 'Add Listing' },
    ];
    if (user.role === 'admin') return [
      { to: '/admin', label: 'Admin' },
      { to: '/installations', label: 'Installations' },
      { to: '/catalog', label: 'Catalog' },
    ];
    return [
      { to: '/', label: 'Home' },
      { to: '/new-drops', label: 'New Drops' },
      { to: '/financials', label: 'Financials' },
      { to: '/journal', label: 'Journal' },
      { to: '/catalog', label: 'Browse' },
      { to: '/my-bookings', label: 'Bookings' },
      { to: '/installations', label: 'Installations' },
    ];
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  return (
    <>
      <header className="rvn">
        {/* ── Top bar ── */}
        <div className="rvn__top">
          <div className="rvn__top-inner">
            <Sparkles size={12} />
            Free delivery &amp; setup on all orders · No hidden fees · Cancel anytime
          </div>
        </div>

        {/* ── Main bar ── */}
        <div className="rvn__main">
          {/* Brand */}
          <Link to="/" className="rvn__brand">
            <span className="rvn__brand-mark">R</span>
            <strong className="rvn__brand-name">Rentova</strong>
          </Link>

          {/* City pill */}
          <button className="rvn__city-pill" onClick={() => setCityModalOpen(true)}>
            <MapPin size={13} />
            <span>{city}</span>
            <ChevronDown size={12} />
          </button>

          {/* Nav links */}
          <nav className="rvn__links">
            {navItems.map((item) =>
              item.to.startsWith('#') ? (
                <a key={item.label} href={item.to} className="rvn__link">{item.label}</a>
              ) : (
                <NavLink key={item.to} to={item.to} end={item.to === '/'}
                  className={({ isActive }) => `rvn__link${isActive ? ' is-active' : ''}`}>
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="rvn__spacer" />

          {/* Search */}
          <form className="rvn__inline-search" onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--rv-color-background)', borderRadius: '99px', padding: '0.5rem 1rem', flex: '0 1 300px', margin: '0 1rem', border: '1px solid var(--rv-color-border)' }}>
            <Search size={16} style={{ color: 'var(--rv-color-secondary)', marginRight: '0.5rem' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--rv-color-primary)' }}
            />
          </form>

          {/* Cart */}
          {user?.role === 'tenant' && (
            <Link to="/cart" className="rvn__cart-btn">
              <ShoppingBag size={16} />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="rvn__cart-count">{cartItems.length}</span>
              )}
            </Link>
          )}

          {/* Auth */}
          {user ? (
            <div className="rvn__profile-wrap" ref={profileRef}>
              <button className="rvn__profile-btn" onClick={() => setProfileOpen(v => !v)}>
                <span className="rvn__avatar">{(user.full_name || 'U')[0].toUpperCase()}</span>
                <span className="rvn__profile-name">{user.full_name?.split(' ')[0] || 'Account'}</span>
                <ChevronDown size={13} />
              </button>
              {profileOpen && (
                <div className="rvn__dropdown">
                  <div className="rvn__dropdown-header">
                    <strong>{user.full_name}</strong>
                    <span>{user.role}</span>
                  </div>
                  <Link to="/profile" className="rvn__dropdown-item">
                    <UserCircle2 size={15} /> My Profile
                  </Link>
                  {user.role === 'tenant' && (
                    <>
                      <Link to="/my-bookings" className="rvn__dropdown-item">
                        <ShoppingBag size={15} /> My Bookings
                      </Link>
                      <Link to="/kyc" className="rvn__dropdown-item">
                        <ShieldCheck size={15} /> KYC Verification
                      </Link>
                      <Link to="/service-requests" className="rvn__dropdown-item">
                        <Sparkles size={15} /> Service Requests
                      </Link>
                    </>
                  )}
                  <button onClick={logout} className="rvn__dropdown-item rvn__dropdown-item--danger">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rvn__auth-btns">
              <Link to="/login" className="rvn__link">Log in</Link>
              <Link to="/register" className="rvn__cta-btn">Start Renting</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="rvn__hamburger" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>



        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="rvn__mobile-drawer">
            {navItems.map((item) =>
              item.to.startsWith('#') ? (
                <a key={item.label} href={item.to} className="rvn__mobile-link" onClick={() => setMobileOpen(false)}>{item.label}</a>
              ) : (
                <NavLink key={item.to} to={item.to} className="rvn__mobile-link" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavLink>
              )
            )}
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="rvn__mobile-link" style={{ color: '#ef4444', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="rvn__mobile-link" onClick={() => setMobileOpen(false)}>Log in</Link>
                <Link to="/register" className="rvn__mobile-link" onClick={() => setMobileOpen(false)}>Start Renting</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* ── City Modal ── */}
      {cityModalOpen && (
        <div className="rvn__modal-overlay" onClick={() => setCityModalOpen(false)}>
          <div className="rvn__modal" onClick={e => e.stopPropagation()}>
            <div className="rvn__modal-header">
              <h2>Choose your city</h2>
              <button onClick={() => setCityModalOpen(false)} className="rvn__modal-close"><X size={20} /></button>
            </div>
            <p className="rvn__modal-sub">We will show inventory available in your area</p>
            <input type="text" placeholder="Search cities..." className="rvn__modal-search" autoFocus />
            <div className="rvn__city-grid">
              {cityOptions.map(c => (
                <button key={c} onClick={() => { changeCity(c); setCityModalOpen(false); }}
                  className={`rvn__city-tile${city === c ? ' is-selected' : ''}`}>
                  <MapPin size={14} />
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

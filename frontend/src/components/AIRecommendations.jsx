import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProductCard from './ProductCard';
import { featuredProducts } from '../data/experience';

const API = 'http://localhost:8000';

function SkeletonCard() {
  return (
    <div style={{
      flex: '0 0 260px',
      minWidth: 220,
      height: 340,
      borderRadius: 20,
      background: 'rgba(92,69,253,0.04)',
      border: '1px solid rgba(92,69,253,0.08)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      />
    </div>
  );
}

/** Magnetic hover card — cursor pulls the card slightly toward it,
 *  and reveals an expand strip at the bottom with quick-view CTA */
function MagneticCard({ product, animDelay }) {
  const cardRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setOffset({
        x: (e.clientX - cx) * 0.14,
        y: (e.clientY - cy) * 0.10,
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setOffset({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 18 }}
      animate={{
        opacity: 1,
        y: offset.y,
        x: offset.x,
        scale: hovered ? 1.025 : 1,
        zIndex: hovered ? 20 : 1,
      }}
      transition={{
        opacity: { delay: animDelay, duration: 0.4 },
        y: { type: 'spring', stiffness: 380, damping: 30 },
        x: { type: 'spring', stiffness: 380, damping: 30 },
        scale: { type: 'spring', stiffness: 300, damping: 26 },
      }}
      style={{
        flex: '0 0 280px',
        minWidth: 260,
        scrollSnapAlign: 'start',
        position: 'relative',
        transformOrigin: 'center center',
      }}
    >
      {/* The product card */}
      <ProductCard product={product} />

      {/* ── Hover Expand Strip ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scaleY: 0.85 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 6, scaleY: 0.9 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(135deg, #111827 0%, #1e293b 100%)',
              borderRadius: '0 0 20px 20px',
              padding: '10px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            }}
          >
            <div>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.68rem', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                from
              </span>
              <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>
                ₹{(product.price || product.monthly_rent || 0).toLocaleString('en-IN')}
                <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>/mo</span>
              </span>
            </div>
            <Link
              to={`/product/${product.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'var(--accent, #5c45fd)',
                color: '#ffffff',
                padding: '7px 14px',
                borderRadius: '99px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
                boxShadow: '0 4px 12px rgba(92,69,253,0.35)',
              }}
            >
              <Eye size={13} /> Quick View
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle magnetic shadow glow */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '28px',
            background: 'radial-gradient(ellipse at center, rgba(92,69,253,0.12) 0%, transparent 72%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
    </motion.div>
  );
}

export default function AIRecommendations() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(false);
    try {
      let response;
      if (user && user.id) {
        try {
          const token = localStorage.getItem('access');
          response = await axios.get(`${API}/api/recommend/${user.id}/`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            timeout: 8000,
          });
          setIsPersonalized(true);
        } catch {
          // Fall back gracefully to trending
          response = await axios.get(`${API}/api/recommend/trending/`, { timeout: 8000 });
          setIsPersonalized(false);
        }
      } else {
        response = await axios.get(`${API}/api/recommend/trending/`, { timeout: 8000 });
        setIsPersonalized(false);
      }

      if (response && response.data && response.data.length > 0) {
        setItems(response.data);
        setError(false);
      } else {
        setItems(featuredProducts.slice(0, 6));
        setIsPersonalized(false);
      }
    } catch {
      setItems(featuredProducts.slice(0, 6));
      setIsPersonalized(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  return (
    <section
      style={{
        padding: '80px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(92,69,253,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="rv-shell" style={{ position: 'relative' }}>
        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 36, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, rgba(92,69,253,0.12), rgba(129,140,248,0.08))',
              border: '1px solid rgba(92,69,253,0.2)',
              borderRadius: 99, padding: '4px 14px', marginBottom: 12,
            }}>
              <Sparkles size={13} color="var(--accent, #5c45fd)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent, #5c45fd)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {isPersonalized ? 'AI Picks For You' : 'Trending Now'}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, lineHeight: 1.15, margin: 0, fontFamily: 'var(--font-display)' }}>
              {isPersonalized ? (
                <>Curated for<br />your home</>
              ) : (
                <>Good objects.<br />No long goodbye.</>
              )}
            </h2>
            {isPersonalized && (
              <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--text-soft)', maxWidth: 320 }}>
                Based on your rental history and preferences
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!loading && (
              <button
                onClick={fetchRecommendations}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: '1px solid rgba(92,69,253,0.25)',
                  borderRadius: 99, padding: '7px 14px', cursor: 'pointer',
                  color: 'var(--accent, #5c45fd)', fontSize: 12.5, fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            )}
            <Link
              to="/catalog"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13.5, fontWeight: 700, color: 'var(--text)',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor', paddingBottom: 1,
              }}
            >
              Browse all <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div style={{
            marginBottom: 16, padding: '8px 16px', borderRadius: 10,
            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
            fontSize: 12.5, color: '#d97706',
          }}>
            Showing featured picks — live recommendations unavailable right now
          </div>
        )}

        {/* Product rail — overflow visible so expand strip isn't clipped */}
        <div style={{
          display: 'flex', gap: 20,
          overflowX: 'auto', overflowY: 'visible',
          paddingBottom: 56, /* extra padding for the expand strip */
          paddingTop: 8,
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(92,69,253,0.2) transparent',
          WebkitOverflowScrolling: 'touch',
        }}>
          {loading
            ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
            : items.map((product, idx) => (
              <MagneticCard
                key={product.id}
                product={product}
                animDelay={idx * 0.07}
              />
            ))
          }
        </div>

        {/* Scroll hint dots */}
        {!loading && items.length > 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }}>
            {items.slice(0, 6).map((_, i) => (
              <div key={i} style={{
                width: i === 0 ? 20 : 6, height: 6, borderRadius: 99,
                background: i === 0 ? 'var(--accent, #5c45fd)' : 'rgba(0,0,0,0.12)',
                transition: 'width 0.3s',
              }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

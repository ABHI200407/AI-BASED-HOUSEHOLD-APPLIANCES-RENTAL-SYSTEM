import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
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
        const token = localStorage.getItem('access');
        response = await axios.get(`${API}/api/recommend/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 8000,
        });
        setIsPersonalized(true);
      } else {
        response = await axios.get(`${API}/api/recommend/trending/`, { timeout: 8000 });
        setIsPersonalized(false);
      }

      if (response.data && response.data.length > 0) {
        setItems(response.data);
      } else {
        // DB empty — fall back to static featured products
        setItems(featuredProducts.slice(0, 6));
        setIsPersonalized(false);
      }
    } catch {
      // Network or server error — fall back gracefully
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

        {/* Product rail */}
        <div style={{
          display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 16,
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(92,69,253,0.2) transparent',
          WebkitOverflowScrolling: 'touch',
        }}>
          {loading
            ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
            : items.map((product, idx) => (
              <motion.div
                key={product.id}
                style={{ flex: '0 0 260px', minWidth: 220, scrollSnapAlign: 'start' }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))
          }
        </div>

        {/* Scroll hint dots */}
        {!loading && items.length > 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
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

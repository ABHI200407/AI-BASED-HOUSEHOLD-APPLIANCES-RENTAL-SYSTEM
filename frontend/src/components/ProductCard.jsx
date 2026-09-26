import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import Magnetic from '../components/Magnetic';
import { ArrowUpRight, Check, Heart, Plus, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { asCartItem } from '../data/experience';
import DynamicThemeWrapper from './DynamicThemeWrapper';

export default function ProductCard({ product, appliance, compact = false, financialModel = 'rent' }) {

  const [quickView, setQuickView] = useState(false);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  const item = product || appliance || {};
  const itemName = item.name || 'Curated Asset';
  const monthlyRent = Number(item.price || item.monthly_rent || (item.price_per_day ? Math.round(item.price_per_day * 30) : 1200));
  const itemCategory = item.category || 'Living Room';
  const itemRating = item.rating || '4.8';
  const itemId = item.id || item._id;

  // Resolve image reliably
  const fallbackImg = '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg';
  const rawImage = item.image || item.image_url || (item.images && item.images.length > 0 ? item.images[0] : null);
  let resolvedImage = fallbackImg;
  if (rawImage) {
    if (rawImage.startsWith('http') || rawImage.startsWith('/downloaded_images') || rawImage.startsWith('/images')) {
      resolvedImage = rawImage;
    } else if (rawImage.startsWith('/')) {
      resolvedImage = rawImage;
    } else {
      resolvedImage = `http://localhost:8000/${rawImage}`;
    }
  }

  // Dynamic pricing based on model
  let displayPrice = monthlyRent;
  let displayLabel = '/month';
  let badgeLabel = item.badge || (item.available !== false ? 'Available' : 'Booked');

  if (financialModel === 'subscribe') {
    displayPrice = Math.round(monthlyRent * 0.8);
    badgeLabel = 'Free Swaps';
  } else if (financialModel === 'buy') {
    displayPrice = Math.round(monthlyRent * 24);
    displayLabel = '';
    badgeLabel = 'No Cost EMI';
  }

  const handleAdd = () => {
    if (user?.role !== 'tenant') {
      navigate('/login');
      return;
    }

    addToCart(asCartItem(item), { tenure: financialModel === 'subscribe' ? 12 : 3, purchaseModel: financialModel });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <Magnetic className="magnetic-btn">
        <DynamicThemeWrapper imageUrl={resolvedImage} className="theme-wrapper">
          <motion.article
            layoutId={`product-card-${itemId}`}
            whileHover={{ y: -4, boxShadow: '0 18px 36px -10px rgba(0,0,0,0.12)' }}
            className={`rv-product-card ${compact ? 'rv-product-card--compact' : ''}`}
            style={{ 
              background: '#ffffff', 
              border: '1px solid var(--rv-color-border, #e2e8f0)',
              borderRadius: '20px',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="card-3d-wrapper" style={{ height: '100%' }}>
              <div className="card-3d">
                <div className="rv-product-card__media" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={resolvedImage}
                    alt={itemName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImg;
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <span className="rv-product-card__tag" style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>{badgeLabel}</span>
                  <button
                    type="button"
                    className={`rv-save-button ${saved ? 'rv-save-button--active' : ''}`}
                    onClick={() => setSaved((value) => !value)}
                    aria-label={`Save ${itemName}`}
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                  >
                    <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickView(true)}
                    style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', padding: '0.25rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', opacity: 0.8, transition: '0.2s' }}
                  >
                    Quick View
                  </button>
                </div>

                <div className="rv-product-card__body">
                  <div className="rv-product-card__meta">
                    <span>{itemCategory}</span>
                    <span><Star size={13} fill="currentColor" /> {itemRating}</span>
                  </div>
                  <Link to={`/appliance/${itemId}`} className="rv-product-card__title">
                    {itemName}
                    <ArrowUpRight size={17} />
                  </Link>
                  <p className="rv-product-card__tenure">
                    {financialModel === 'rent' && 'from 3 months · '}
                    {financialModel === 'subscribe' && '12 mo lock-in · '}
                    {financialModel === 'buy' && 'Full ownership · '}
                    Free delivery
                  </p>
                  <div className="rv-product-card__action-row">
                    <div>
                      <strong>₹{displayPrice.toLocaleString('en-IN')}</strong>
                      <span>{displayLabel}</span>
                    </div>
                    <button type="button" className="rv-add-button" onClick={handleAdd}>
                      {added ? <Check size={17} /> : <Plus size={17} />}
                      {added ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </DynamicThemeWrapper>
      </Magnetic>

      {quickView && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setQuickView(false)}>
          <div style={{ background: '#fff', borderRadius: '16px', display: 'flex', width: '800px', maxWidth: '90%', height: '500px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ flex: 1, background: '#f9fafb' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rv-color-secondary)' }}>{product.category}</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{product.name}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <span style={{ padding: '0.25rem 0.5rem', background: '#10b98110', color: '#10b981', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>In Stock</span>
                <span style={{ padding: '0.25rem 0.5rem', background: 'var(--rv-color-background)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{badgeLabel}</span>
              </div>

              <p style={{ color: 'var(--rv-color-secondary)', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                A perfect addition to your home. Rent, subscribe for long-term perks, or buy it outright.
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--rv-color-border)' }}>
                <div>
                  <strong style={{ fontSize: '1.5rem', display: 'block' }}>₹{displayPrice.toLocaleString('en-IN')}{displayLabel}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--rv-color-secondary)' }}>Via {financialModel} plan</span>
                </div>
                <button onClick={handleAdd} className="rv-button rv-button--signal" style={{ padding: '0.75rem 1.5rem' }}>
                  {added ? 'Added to Cart' : `Add to Cart`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

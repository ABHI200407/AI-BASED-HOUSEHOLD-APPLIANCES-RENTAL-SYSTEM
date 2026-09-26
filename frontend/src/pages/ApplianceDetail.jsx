import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calculator, CheckCircle2, ChevronRight, Clock3, ShieldCheck, Truck, Wrench } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { resolveMediaUrl } from '../utils/media';
import ItemInspector from '../components/ItemInspector';

export default function ApplianceDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const [appliance, setAppliance] = useState(null);
  const [error, setError] = useState('');
  const [financialModel, setFinancialModel] = useState('rent');
  const [tenure, setTenure] = useState(3);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    fetchAppliance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAppliance = async () => {
    try {
      const res = await api.get(`appliances/${id}/`);
      setAppliance(res.data);

      const inCart = cartItems.find((item) => String(item.id) === String(id));
      if (inCart) {
        setAdded(true);
        setTenure(inCart.tenure);
        if (inCart.purchaseModel) setFinancialModel(inCart.purchaseModel);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch details');
    }
  };

  useEffect(() => {
    const src = (appliance?.images && appliance.images.length > 0) ? appliance.images[0] : (appliance?.image_url || appliance?.image);
    if (src && !activeImage) {
      setActiveImage(resolveMediaUrl(src));
    }
  }, [appliance, activeImage]);

  const handleAddToCart = () => {
    const finalTenure = financialModel === 'subscribe' ? 12 : (financialModel === 'buy' ? 1 : tenure);
    addToCart(appliance, { tenure: finalTenure, purchaseModel: financialModel });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const pricing = useMemo(() => {
    const baseMonthlyRent = appliance?.monthly_rent || (appliance?.price_per_day || 0) * 30 || appliance?.price || 0;
    
    if (financialModel === 'subscribe') {
      return { 
        discountedMonthlyRent: Math.round(baseMonthlyRent * 0.8), 
        securityDeposit: 0, 
        depositMultiplier: 0,
        discount: 0.2, 
        label: '/month' 
      };
    } else if (financialModel === 'buy') {
      return { 
        discountedMonthlyRent: Math.round(baseMonthlyRent * 24), 
        securityDeposit: 0, 
        depositMultiplier: 0,
        discount: 0, 
        label: ' total' 
      };
    }

    let discount = 0;
    let depositMultiplier = 1.5;
    if (tenure === 1) {
      discount = 0;
      depositMultiplier = 1.5;
    } else if (tenure === 3) {
      discount = 0.05;
      depositMultiplier = 1.3;
    } else if (tenure === 6) {
      discount = 0.10;
      depositMultiplier = 1.1;
    } else if (tenure >= 12) {
      discount = 0.20;
      depositMultiplier = 0.9;
    }

    const discountedMonthlyRent = Math.round(baseMonthlyRent * (1 - discount));
    const securityDeposit = Math.round(discountedMonthlyRent * depositMultiplier);

    return { discount, depositMultiplier, baseMonthlyRent, discountedMonthlyRent, securityDeposit, label: '/month' };
  }, [appliance, tenure, financialModel]);

  if (error) {
    return (
      <div className="rv-shell" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', padding: '4rem 0', background: '#fff', borderRadius: 'var(--rv-radius-xl)', border: '1px solid var(--rv-color-border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{error}</h3>
          <Link to="/catalog" className="rv-button rv-button--signal">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  if (!appliance) {
    return (
      <div className="rv-shell" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--rv-color-secondary)' }}>
          Loading product details...
        </div>
      </div>
    );
  }

  const defaultImg = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
  const images = appliance.images && appliance.images.length > 0 ? appliance.images.map(resolveMediaUrl) : [defaultImg];
  const mainImage = activeImage || images[0];

  return (
    <main className="rv-shell" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--rv-color-secondary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginBottom: '2rem' }}>
        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to catalog
      </Link>

      <div className="rv-split-layout">
        <section>
          <div className="rv-detail-hero" style={{ padding: 0, overflow: 'visible', background: 'transparent' }}>
            <ItemInspector />
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <span className="rv-section-label"><ShieldCheck size={14} style={{display:'inline', verticalAlign:'middle'}}/> Description</span>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--rv-color-secondary)', marginTop: '1rem' }}>
              {appliance.description || 'Elevate your space with this premium piece. Sourced for quality, delivered with care, and backed by full maintenance support.'}
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <span className="rv-section-label"><Wrench size={14} style={{display:'inline', verticalAlign:'middle'}}/> Information</span>
            
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--rv-color-border)', marginBottom: '2rem' }}>
              <button style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--rv-color-primary)', padding: '0 0 1rem 0', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Specifications</button>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--rv-color-secondary)', padding: '0 0 1rem 0', cursor: 'pointer', fontSize: '1rem' }}>Features & Care</button>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--rv-color-secondary)', padding: '0 0 1rem 0', cursor: 'pointer', fontSize: '1rem' }}>Reviews (4)</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--rv-color-border)', borderRadius: 'var(--rv-radius-md)' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Category</strong>
                <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{appliance.category}</span>
              </div>
              <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--rv-color-border)', borderRadius: 'var(--rv-radius-md)' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Status</strong>
                <span style={{ fontSize: '1.125rem', fontWeight: 600, color: appliance.available ? '#10b981' : '#ef4444' }}>{appliance.available ? 'Available' : 'Booked'}</span>
              </div>
              <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--rv-color-border)', borderRadius: 'var(--rv-radius-md)' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Brand</strong>
                <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{appliance.brand || 'Premium Brand'}</span>
              </div>
              <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--rv-color-border)', borderRadius: 'var(--rv-radius-md)' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>Dimensions</strong>
                <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>120 x 60 x 75 cm</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="rv-sticky-card">
          <span className="rv-section-label" style={{ marginBottom: '0.5rem' }}>{appliance.category}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>{appliance.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', color: '#fbbf24' }}>★ ★ ★ ★ ★</div>
            <span style={{ color: 'var(--rv-color-secondary)', fontSize: '0.875rem', textDecoration: 'underline' }}>12 reviews</span>
          </div>

          <div style={{ padding: '1rem', background: 'var(--rv-color-background)', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Check delivery time</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Enter Pincode" className="rv-input" style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--rv-color-border)' }} />
              <button className="rv-button rv-button--light" style={{ padding: '0.5rem 1rem' }}>Check</button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 600 }}>✓ Usually delivered in 72 hrs</p>
          </div>

          <div style={{ display: 'flex', background: 'var(--rv-color-background)', padding: '0.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setFinancialModel('rent')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'var(--rv-transition)', background: financialModel === 'rent' ? '#fff' : 'transparent', color: financialModel === 'rent' ? 'var(--rv-color-primary)' : 'var(--rv-color-secondary)', boxShadow: financialModel === 'rent' ? 'var(--rv-shadow-float)' : 'none' }}
            >
              Rent
            </button>
            <button 
              onClick={() => setFinancialModel('subscribe')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'var(--rv-transition)', background: financialModel === 'subscribe' ? '#fff' : 'transparent', color: financialModel === 'subscribe' ? 'var(--rv-color-primary)' : 'var(--rv-color-secondary)', boxShadow: financialModel === 'subscribe' ? 'var(--rv-shadow-float)' : 'none' }}
            >
              Subscribe
            </button>
            <button 
              onClick={() => setFinancialModel('buy')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'var(--rv-transition)', background: financialModel === 'buy' ? '#fff' : 'transparent', color: financialModel === 'buy' ? 'var(--rv-color-primary)' : 'var(--rv-color-secondary)', boxShadow: financialModel === 'buy' ? 'var(--rv-shadow-float)' : 'none' }}
            >
              Buy
            </button>
          </div>

          {financialModel === 'rent' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="rv-section-label">Select Rental Tenure</span>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>Dynamic Deposit Tier</span>
              </div>
              <div className="rv-tenure-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {[
                  { m: 1, label: 'Standard', depositText: '1.5x' },
                  { m: 3, label: '5% OFF', depositText: '1.3x' },
                  { m: 6, label: '10% OFF', depositText: '1.1x' },
                  { m: 12, label: '20% OFF', depositText: '0.9x' }
                ].map(({ m, label, depositText }) => (
                  <div
                    key={m}
                    className={`rv-tenure-card ${tenure === m ? 'active' : ''}`}
                    onClick={() => setTenure(m)}
                    style={{ position: 'relative', textAlign: 'center', padding: '0.75rem 0.25rem' }}
                  >
                    <strong>{m}M</strong>
                    <span style={{ fontSize: '0.7rem', display: 'block', color: tenure === m ? '#ffffff' : 'var(--rv-color-secondary)' }}>{label}</span>
                    <span style={{ fontSize: '0.65rem', display: 'block', opacity: 0.8, marginTop: '2px' }}>{depositText} dep</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Deposit Explanation Card */}
              <div style={{
                marginTop: '0.75rem',
                padding: '0.6rem 0.85rem',
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.2)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#0369a1'
              }}>
                <ShieldCheck size={14} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Dynamic Deposit Active:</strong> {pricing.depositMultiplier}x monthly rent (₹{pricing.securityDeposit.toLocaleString('en-IN')}). 100% refundable on return.
                </span>
              </div>
            </div>
          )}

          {financialModel === 'subscribe' && (
            <div style={{ padding: '1rem', background: '#10b98110', border: '1px solid #10b981', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#059669', display: 'block', marginBottom: '0.5rem' }}>Annual Subscription Plan</strong>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--rv-color-secondary)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Locked in at our lowest rate</li>
                <li>Free Annual Deep Cleaning included</li>
                <li>Free Style Swaps anytime</li>
              </ul>
            </div>
          )}

          {financialModel === 'buy' && (
            <div style={{ padding: '1rem', background: '#3b82f610', border: '1px solid #3b82f6', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '0.5rem' }}>Full Ownership</strong>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--rv-color-secondary)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Brand new, mint condition guarantee</li>
                <li>Manufacturer warranty included</li>
                <li>No Cost EMI available at checkout</li>
              </ul>
            </div>
          )}

          {pricing.discount > 0 && financialModel === 'rent' && (
            <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
              Save {(pricing.discount * 100).toFixed(0)}% on rent
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--rv-color-border)' }}>
            <div>
              <span className="rv-section-label" style={{ marginBottom: '0.25rem' }}>{financialModel === 'buy' ? 'Total Price' : 'Monthly Rent'}</span>
              <strong style={{ fontSize: '2rem', color: 'var(--rv-color-primary)', lineHeight: 1 }}>₹{pricing.discountedMonthlyRent.toLocaleString('en-IN')}</strong>
            </div>
            {financialModel === 'rent' && (
              <div style={{ textAlign: 'right' }}>
                <span className="rv-section-label" style={{ marginBottom: '0.25rem' }}>Deposit</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--rv-color-secondary)' }}>₹{pricing.securityDeposit.toLocaleString('en-IN')}</strong>
              </div>
            )}
          </div>

          {financialModel === 'rent' && (
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Base rent ({tenure} mo plan):</span>
                <span>₹{pricing.discountedMonthlyRent.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>18% GST (Rental SAC 997212):</span>
                <span>+₹{Math.round(pricing.discountedMonthlyRent * 0.18).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a', borderTop: '1px dashed #cbd5e1', paddingTop: '4px' }}>
                <span>Total monthly:</span>
                <span>₹{Math.round(pricing.discountedMonthlyRent * 1.18).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ marginTop: '6px', fontSize: '0.74rem', color: '#059669', display: 'flex', justifyContent: 'space-between' }}>
                <span>Refundable deposit ({pricing.depositMultiplier}×):</span>
                <strong>₹{pricing.securityDeposit.toLocaleString('en-IN')} (100% refund)</strong>
              </div>
            </div>
          )}

          <Link to="/financials" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '0.8rem', color: 'var(--accent, #5c45fd)', fontWeight: 700,
            textDecoration: 'none', marginBottom: '1.25rem', padding: '0.6rem 0.8rem',
            borderRadius: '10px', background: 'rgba(92, 69, 253, 0.06)',
            border: '1px solid rgba(92, 69, 253, 0.15)',
          }}>
            <Calculator size={14} /> Compare with Rent vs. Buy Calculator →
          </Link>

          {user && user.role === 'tenant' ? (
            appliance.available ? (
              <button onClick={handleAddToCart} className="rv-button rv-button--signal" style={{ width: '100%', marginBottom: '1.5rem' }}>
                {added ? <><CheckCircle2 size={18} /> Added to cart</> : 'Add to cart'}
              </button>
            ) : (
              <button disabled className="rv-button rv-button--light" style={{ width: '100%', marginBottom: '1.5rem', opacity: 0.5 }}>
                Out of stock
              </button>
            )
          ) : (
            <Link to="/login" className="rv-button rv-button--signal" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              Log in to order
            </Link>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Truck size={16} color="var(--rv-color-accent)" /> Free delivery & installation</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wrench size={16} color="var(--rv-color-accent)" /> Free maintenance included</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock3 size={16} color="var(--rv-color-accent)" /> Easy returns & extensions</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

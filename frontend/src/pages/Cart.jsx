import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, PackageSearch, ShieldCheck, Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { resolveMediaUrl, formatINR } from '../utils/media';

export default function Cart() {
  const { cartItems, removeFromCart, updateTenure } = useContext(CartContext);
  const navigate = useNavigate();

  const calculateItemTotals = (item) => {
    const baseMonthly = item.monthly_rent || (item.price_per_day || 0) * 30 || item.price || 0;
    let discount = 0;
    let depositMultiplier = 1.5;

    if (item.tenure === 1) {
      discount = 0;
      depositMultiplier = 1.5;
    } else if (item.tenure === 3) {
      discount = 0.05;
      depositMultiplier = 1.3;
    } else if (item.tenure === 6) {
      discount = 0.10;
      depositMultiplier = 1.1;
    } else if (item.tenure >= 12) {
      discount = 0.20;
      depositMultiplier = 0.9;
    }

    const discountedMonthly = Math.round(baseMonthly * (1 - discount));
    const securityDeposit = Math.round(discountedMonthly * depositMultiplier);

    return { discountedMonthly, securityDeposit, depositMultiplier, discount };
  };

  const totals = cartItems.reduce(
    (acc, item) => {
      const { discountedMonthly, securityDeposit } = calculateItemTotals(item);
      return {
        monthly: acc.monthly + discountedMonthly,
        deposit: acc.deposit + securityDeposit,
      };
    },
    { monthly: 0, deposit: 0 },
  );

  if (cartItems.length === 0) {
    return (
      <main className="rv-shell" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', padding: '4rem 0', background: '#fff', borderRadius: 'var(--rv-radius-xl)', border: '1px solid var(--rv-color-border)' }}>
          <PackageSearch size={72} style={{ margin: '0 auto 1rem', color: 'var(--rv-color-secondary)', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--rv-color-secondary)', marginBottom: '2rem' }}>Shortlist items from the catalog and build a rental plan that fits your move.</p>
          <Link to="/catalog" className="rv-button rv-button--signal">
            Start browsing <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="rv-section-heading" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="rv-section-label"><PackageSearch size={14} style={{display:'inline', verticalAlign:'middle'}}/> Cart</span>
          <h2>Review your shortlist.</h2>
        </div>
      </div>

      <div className="rv-split-layout">
        <section>
          {cartItems.map((item) => {
            const { discountedMonthly, securityDeposit, depositMultiplier } = calculateItemTotals(item);
            let image = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
            if (item.images && item.images.length > 0) {
              const src = item.images[0];
              image = src.startsWith('http') ? src : `http://localhost:8000${src}`;
            }

            return (
              <article key={item.id} className="rv-cart-item">
                <div className="rv-cart-item__media">
                  <img src={image} alt={item.name} />
                </div>

                <div className="rv-cart-item__body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className="rv-section-label" style={{ marginBottom: '0.25rem' }}>{item.category}</span>
                      <Link to={`/appliance/${item.id}`} style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rv-color-primary)', textDecoration: 'none' }}>
                        {item.name}
                      </Link>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: 'auto', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <label className="rv-section-label" style={{ margin: 0 }}>Tenure</label>
                        <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>{depositMultiplier}x deposit</span>
                      </div>
                      <select
                        value={item.tenure || 3}
                        onChange={(e) => updateTenure(item.id, parseInt(e.target.value, 10))}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--rv-color-border)', background: 'var(--rv-color-background)', fontSize: '0.9rem' }}
                      >
                        <option value={1}>1 month &bull; 1.5x deposit</option>
                        <option value={3}>3 months (5% off &bull; 1.3x dep)</option>
                        <option value={6}>6 months (10% off &bull; 1.1x dep)</option>
                        <option value={12}>12 months (20% off &bull; 0.9x dep)</option>
                      </select>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="rv-section-label" style={{ marginBottom: '0.25rem' }}>Deposit (100% Refundable)</span>
                      <strong style={{ fontSize: '1.1rem', color: '#0284c7' }}>{formatINR(securityDeposit)}</strong>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="rv-section-label" style={{ marginBottom: '0.25rem' }}>Monthly rent</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--rv-color-primary)' }}>{formatINR(discountedMonthly)}</strong>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="rv-sticky-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order summary</h2>

          <div className="rv-summary-row">
            <span>Monthly rent ({cartItems.length} items)</span>
            <strong>{formatINR(totals.monthly)}</strong>
          </div>
          <div className="rv-summary-row">
            <span>Refundable deposit</span>
            <strong>{formatINR(totals.deposit)}</strong>
          </div>
          <div className="rv-summary-row">
            <span>Delivery and installation</span>
            <strong style={{ color: '#10b981' }}>Free</strong>
          </div>

          <div className="rv-summary-row rv-summary-row--strong">
            <span>Payable now</span>
            <strong>{formatINR(totals.monthly + totals.deposit)}</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--rv-color-secondary)', marginBottom: '1.5rem' }}>First month rent plus deposit, before delivery.</p>

          <button onClick={() => navigate('/checkout')} className="rv-button rv-button--signal" style={{ width: '100%', marginBottom: '1.5rem' }}>
            Proceed to checkout <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> Safe and secure payments</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> Cancel anytime policy</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

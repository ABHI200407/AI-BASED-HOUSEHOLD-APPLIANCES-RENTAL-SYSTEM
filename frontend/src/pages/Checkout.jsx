import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, MapPin, ShieldCheck, UploadCloud } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { formatINR } from '../utils/media';

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [kycUploaded, setKycUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate, success]);

  const totals = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => {
          const baseMonthly = item.monthly_rent || (item.price_per_day || 0) * 30 || item.price;
          
          if (item.purchaseModel === 'buy') {
             acc.purchasePrice += (baseMonthly * 24);
             acc.buyCount++;
          } else if (item.purchaseModel === 'subscribe') {
             acc.monthly += (baseMonthly * 0.8);
             acc.rentCount++;
          } else {
             let discount = 0;
             if (item.tenure >= 6) discount = 0.1;
             if (item.tenure >= 12) discount = 0.2;
             acc.monthly += baseMonthly * (1 - discount);
             acc.deposit += item.deposit || baseMonthly * 2;
             acc.rentCount++;
          }
          return acc;
        },
        { monthly: 0, deposit: 0, purchasePrice: 0, rentCount: 0, buyCount: 0 },
      ),
    [cartItems],
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const items = cartItems.map((item) => {
        const start = new Date(deliveryDate);
        const end = new Date(deliveryDate);
        end.setMonth(end.getMonth() + item.tenure);

        return {
          appliance_id: item.id,
          start_date: start.toISOString(),
          end_date: end.toISOString(),
        };
      });

      await api.post('bookings/bulk/', { items });
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="rv-shell" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: 'var(--rv-radius-xl)', border: '1px solid var(--rv-color-border)', boxShadow: 'var(--rv-shadow-float)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            <CheckCircle2 size={16} /> Order confirmed
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--rv-font-display)' }}>Your rental is confirmed.</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--rv-color-secondary)', marginBottom: '2rem' }}>
            Thank you, {user?.full_name || 'there'}. Your order is scheduled for{' '}
            <strong style={{ color: 'var(--rv-color-primary)' }}>{deliveryDate}</strong>.
          </p>
          <button onClick={() => navigate('/my-bookings')} className="rv-button rv-button--signal">
            View my bookings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="rv-section-heading" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="rv-section-label"><ShieldCheck size={14} style={{display:'inline', verticalAlign:'middle'}}/> Checkout</span>
          <h2>Confirm delivery and verification.</h2>
        </div>
      </div>

      <div className="rv-split-layout">
        <section>
          
          <article className="rv-stepper-card" style={{ opacity: step === 1 ? 1 : 0.6 }}>
            <div className="rv-step-header">
              <div className="rv-step-badge">1</div>
              <div>
                <h3>Delivery details</h3>
                <p>Add the address and preferred date for setup.</p>
              </div>
            </div>

            {step === 1 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="rv-section-label" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} /> Delivery address
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Enter your full address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--rv-color-border)', fontSize: '1rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label className="rv-section-label" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> Preferred delivery time
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--rv-color-border)', fontSize: '1rem' }}
                    />
                    <select
                      style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--rv-color-border)', fontSize: '1rem', background: '#fff' }}
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (12 PM - 3 PM)</option>
                      <option>Evening (3 PM - 6 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (address.length > 5 && deliveryDate) setStep(2);
                    else alert('Please fill out both address and date.');
                  }}
                  className="rv-button rv-button--signal"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Continue to verification
                </button>
              </div>
            )}
          </article>

          <article className="rv-stepper-card" style={{ opacity: step === 2 ? 1 : 0.6 }}>
            <div className="rv-step-header">
              <div className="rv-step-badge" style={{ background: step >= 2 ? 'var(--rv-color-primary)' : 'var(--rv-color-border)' }}>2</div>
              <div>
                <h3>Identity verification</h3>
                <p>Upload a government ID to keep the rental flow secure.</p>
              </div>
            </div>

            {step === 2 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--rv-color-secondary)', fontSize: '0.9375rem' }}>
                  The platform uses a guided KYC-style step for identity and address verification. We keep the layout simple and visible so it feels like part of the service, not an interruption.
                </p>

                <label style={{ display: 'block', padding: '3rem 2rem', background: 'var(--rv-color-background)', border: '2px dashed var(--rv-color-border)', borderRadius: 'var(--rv-radius-lg)', textAlign: 'center', cursor: 'pointer', transition: 'var(--rv-transition)' }}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setKycUploaded(Boolean(e.target.files?.length))}
                  />
                  <UploadCloud size={48} color="var(--rv-color-accent)" style={{ margin: '0 auto 1rem' }} />
                  <strong style={{ display: 'block', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    {kycUploaded ? 'Document uploaded successfully!' : 'Click to upload ID document'}
                  </strong>
                  <span style={{ color: 'var(--rv-color-secondary)', fontSize: '0.875rem' }}>Supports JPG, PNG, or PDF</span>
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setStep(1)} className="rv-button rv-button--light">Back</button>
                  <button
                    onClick={() => {
                      if (kycUploaded) setStep(3);
                      else alert('Please upload your ID document first.');
                    }}
                    className="rv-button rv-button--signal"
                  >
                    Continue to review
                  </button>
                </div>
              </div>
            )}
          </article>

          <article className="rv-stepper-card" style={{ opacity: step === 3 ? 1 : 0.6 }}>
            <div className="rv-step-header">
              <div className="rv-step-badge" style={{ background: step >= 3 ? 'var(--rv-color-primary)' : 'var(--rv-color-border)' }}>3</div>
              <div>
                <h3>Review and confirm</h3>
                <p>Check the plan before we place the booking request.</p>
              </div>
            </div>

            {step === 3 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1.5rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--rv-color-secondary)', marginBottom: '0.5rem' }}>Address</strong>
                    <span style={{ fontWeight: 600 }}>{address}</span>
                  </div>
                  <div style={{ padding: '1.5rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--rv-color-secondary)', marginBottom: '0.5rem' }}>Delivery Date</strong>
                    <span style={{ fontWeight: 600 }}>{deliveryDate}</span>
                  </div>
                  <div style={{ padding: '1.5rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--rv-color-secondary)', marginBottom: '0.5rem' }}>Verification</strong>
                    <span style={{ fontWeight: 600, color: '#10b981' }}>{kycUploaded ? 'Uploaded' : 'Pending'}</span>
                  </div>
                  <div style={{ padding: '1.5rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--rv-color-secondary)', marginBottom: '0.5rem' }}>Items</strong>
                    <span style={{ fontWeight: 600 }}>{cartItems.length} shortlisted pieces</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={() => setStep(2)} className="rv-button rv-button--light">Back</button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="rv-button rv-button--signal">
                    {isSubmitting ? 'Processing order...' : 'Complete order'}
                  </button>
                </div>
              </div>
            )}
          </article>
        </section>

        <aside className="rv-sticky-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your order summary</h2>
          
          {totals.rentCount > 0 && (
            <>
              <div className="rv-summary-row">
                <span>Monthly plan ({totals.rentCount} items)</span>
                <strong>{formatINR(totals.monthly)}</strong>
              </div>
              <div className="rv-summary-row">
                <span>Refundable deposit</span>
                <strong>{formatINR(totals.deposit)}</strong>
              </div>
            </>
          )}

          {totals.buyCount > 0 && (
            <div className="rv-summary-row">
              <span>Purchase total ({totals.buyCount} items)</span>
              <strong>{formatINR(totals.purchasePrice)}</strong>
            </div>
          )}

          <div className="rv-summary-row">
            <span>Delivery and installation</span>
            <strong style={{ color: '#10b981' }}>Free</strong>
          </div>

          <div style={{ padding: '1rem', background: 'var(--rv-color-background)', borderRadius: '8px', marginTop: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Rentova Cash</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Use ₹500
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="text" placeholder="Coupon Code" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--rv-color-border)', textTransform: 'uppercase' }} />
            <button className="rv-button rv-button--light" style={{ padding: '0.75rem 1rem' }}>Apply</button>
          </div>

          <div className="rv-summary-row rv-summary-row--strong">
            <span>Payable now</span>
            <strong>{formatINR(totals.monthly + totals.deposit + totals.purchasePrice)}</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--rv-color-secondary)', marginBottom: '1.5rem' }}>Total due today before delivery.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> Safe and secure payments</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> Flexible cancel policy</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> Service and support included</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

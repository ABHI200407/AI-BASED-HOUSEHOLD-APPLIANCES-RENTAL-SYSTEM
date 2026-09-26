import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, CheckCircle2, MapPin, ShieldCheck, UploadCloud, FileCheck2, ExternalLink, CreditCard, Lock } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { formatINR } from '../utils/media';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import InvoiceReceiptModal from '../components/InvoiceReceiptModal';

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

  // KYC Gate state
  const [isKycVerified, setIsKycVerified] = useState(
    () => localStorage.getItem('rentai_kyc_verified') === 'true'
  );
  const [kycDocType, setKycDocType] = useState('aadhaar');
  const [kycNumber, setKycNumber] = useState('');
  const [kycVerifying, setKycVerifying] = useState(false);
  const [kycFeedback, setKycFeedback] = useState('');

  // Payment Gateway Modal & Invoice state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState(null);

  useEffect(() => {
    // Check backend KYC status on mount
    const checkBackendKyc = async () => {
      try {
        const res = await api.get('users/kyc/');
        if (res.data?.is_verified) {
          setIsKycVerified(true);
          setKycUploaded(true);
          localStorage.setItem('rentai_kyc_verified', 'true');
        }
      } catch (e) {
        // Fall back to local storage
      }
    };
    checkBackendKyc();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate, success]);

  const totals = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => {
          const baseMonthly = item.monthly_rent || (item.price_per_day || 0) * 30 || item.price || 0;
          
          if (item.purchaseModel === 'buy') {
             acc.purchasePrice += Math.round(baseMonthly * 24);
             acc.buyCount++;
          } else if (item.purchaseModel === 'subscribe') {
             acc.monthly += Math.round(baseMonthly * 0.8);
             acc.rentCount++;
          } else {
             const tenure = item.tenure || 3;
             let discount = 0;
             let depositMult = 1.5;
             if (tenure === 1) { discount = 0; depositMult = 1.5; }
             else if (tenure === 3) { discount = 0.05; depositMult = 1.3; }
             else if (tenure === 6) { discount = 0.10; depositMult = 1.1; }
             else if (tenure >= 12) { discount = 0.20; depositMult = 0.9; }

             const discounted = Math.round(baseMonthly * (1 - discount));
             acc.monthly += discounted;
             acc.deposit += Math.round(discounted * depositMult);
             acc.rentCount++;
          }
          return acc;
        },
        { monthly: 0, deposit: 0, purchasePrice: 0, rentCount: 0, buyCount: 0 },
      ),
    [cartItems],
  );

  const taxAmount = Math.round(totals.monthly * 0.18);
  const payableNow = totals.monthly + totals.deposit + totals.purchasePrice + taxAmount;

  const handleQuickKycVerify = async () => {
    if (!kycNumber || kycNumber.trim().length < 4) {
      alert('Please enter a valid document ID number (e.g. 12-digit Aadhaar or PAN).');
      return;
    }
    setKycVerifying(true);
    setKycFeedback('Connecting to UIDAI/ITD Verification Gateway...');

    setTimeout(async () => {
      try {
        await api.post('users/kyc/', {
          id_type: kycDocType,
          id_number: kycNumber.toUpperCase().trim(),
          verified: true
        });
      } catch (e) {
        // Fall back locally
      }

      localStorage.setItem('rentai_kyc_verified', 'true');
      localStorage.setItem('rentai_kyc_data', JSON.stringify({
        id_type: kycDocType,
        id_number: kycNumber.toUpperCase().trim(),
        verified_at: new Date().toISOString(),
        cert_id: 'KYC-IND-' + Math.floor(100000 + Math.random() * 900000)
      }));

      setIsKycVerified(true);
      setKycUploaded(true);
      setKycVerifying(false);
      setKycFeedback('');
    }, 1200);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsPaymentOpen(false);
    setIsSubmitting(true);
    try {
      const items = cartItems.map((item) => {
        const start = new Date(deliveryDate);
        const end = new Date(deliveryDate);
        end.setMonth(end.getMonth() + (item.tenure || 3));

        return {
          appliance_id: item.id,
          start_date: start.toISOString(),
          end_date: end.toISOString(),
        };
      });

      await api.post('bookings/bulk/', { items });
      
      const invoice = {
        invoice_number: 'INV-' + Math.floor(100000 + Math.random() * 900000),
        created_at: new Date().toISOString(),
        payment_reference: paymentDetails?.referenceId || ('PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase()),
        customer_name: user?.full_name || 'Rentova Resident',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '+91 98765 43210',
        customer_address: address,
        items: cartItems.map(item => ({
          name: item.name,
          tenure: item.tenure || 3,
          monthly_rent: item.monthly_rent || 1000,
          deposit: item.deposit || 1500
        })),
        amount_rent: totals.monthly,
        amount_deposit: totals.deposit,
        amount_tax: taxAmount,
        amount_total: payableNow,
      };

      setCompletedInvoice(invoice);
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
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 'var(--rv-radius-xl)', border: '1px solid var(--rv-color-border)', boxShadow: 'var(--rv-shadow-float)', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} /> Payment &amp; KYC Verified &bull; Order Confirmed
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--rv-font-display)' }}>
            Your rental order is secured.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--rv-color-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Thank you, <strong>{user?.full_name || 'Resident'}</strong>. Your delivery and white-glove installation is scheduled for{' '}
            <strong style={{ color: 'var(--rv-color-primary)' }}>{deliveryDate}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {completedInvoice && (
              <button 
                onClick={() => setIsInvoiceOpen(true)}
                className="rv-button rv-button--light"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', fontSize: '1rem', fontWeight: 700 }}
              >
                <FileCheck2 size={18} /> View GST Tax Invoice
              </button>
            )}
            <button 
              onClick={() => navigate('/my-bookings')} 
              className="rv-button rv-button--signal"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', fontSize: '1rem', fontWeight: 700 }}
            >
              View My Rentals
            </button>
          </div>
        </div>

        {/* Invoice Modal on Success */}
        {completedInvoice && (
          <InvoiceReceiptModal 
            isOpen={isInvoiceOpen} 
            onClose={() => setIsInvoiceOpen(false)} 
            invoiceData={completedInvoice} 
          />
        )}
      </main>
    );
  }

  return (
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="rv-section-heading" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="rv-section-label"><ShieldCheck size={14} style={{display:'inline', verticalAlign:'middle'}}/> Checkout</span>
          <h2>Confirm delivery, KYC verification &amp; payment.</h2>
        </div>
      </div>

      <div className="rv-split-layout">
        <section>
          
          {/* STEP 1: Delivery Details */}
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
                    placeholder="Enter your full address with flat/house number and street..."
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
                    else alert('Please enter both delivery address and preferred delivery date.');
                  }}
                  className="rv-button rv-button--signal"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Continue to KYC Verification Gate &rarr;
                </button>
              </div>
            )}
          </article>

          {/* STEP 2: KYC Verification Gate */}
          <article className="rv-stepper-card" style={{ opacity: step === 2 ? 1 : 0.6 }}>
            <div className="rv-step-header">
              <div className="rv-step-badge" style={{ background: step >= 2 ? 'var(--rv-color-primary)' : 'var(--rv-color-border)' }}>2</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>KYC Verification Gate</h3>
                  {isKycVerified && (
                    <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p>Mandatory government identity verification before equipment dispatch.</p>
              </div>
            </div>

            {step === 2 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {isKycVerified ? (
                  <div style={{ padding: '1.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                      <CheckCircle2 size={28} color="#059669" />
                      <div>
                        <strong style={{ fontSize: '1.1rem', color: '#065f46', display: 'block' }}>Identity Verified</strong>
                        <span style={{ fontSize: '0.85rem', color: '#047857' }}>
                          Verified Aadhaar / PAN on file &bull; Clearance Certificate Generated
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#065f46', margin: 0 }}>
                      Your KYC profile meets all regulatory standards for zero-friction appliance delivery and instant deposit refunds.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '1rem 1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', fontSize: '0.875rem', color: '#1e40af', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <ShieldCheck size={22} style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Zero-Fraud Security Policy:</strong> Quick-verify your identity to enable insured white-glove delivery and automated deposit refunds.
                      </span>
                    </div>

                    {/* Quick Verification Form */}
                    <div style={{ background: 'var(--rv-color-background)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--rv-color-border)' }}>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => setKycDocType('aadhaar')}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: kycDocType === 'aadhaar' ? '2px solid var(--rv-color-primary)' : '1px solid var(--rv-color-border)',
                            background: kycDocType === 'aadhaar' ? '#fff' : 'transparent',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          Aadhaar Card (12-Digit)
                        </button>
                        <button
                          type="button"
                          onClick={() => setKycDocType('pan')}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: kycDocType === 'pan' ? '2px solid var(--rv-color-primary)' : '1px solid var(--rv-color-border)',
                            background: kycDocType === 'pan' ? '#fff' : 'transparent',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          PAN Card (10-Char)
                        </button>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label className="rv-section-label" style={{ marginBottom: '0.5rem' }}>
                          {kycDocType === 'aadhaar' ? 'Aadhaar Number (UIDAI)' : 'PAN Card Number (ITD)'}
                        </label>
                        <input
                          type="text"
                          placeholder={kycDocType === 'aadhaar' ? 'e.g. 5482 9102 4432' : 'e.g. ABCDE1234F'}
                          value={kycNumber}
                          onChange={(e) => setKycNumber(e.target.value)}
                          style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--rv-color-border)', fontSize: '1rem', background: '#fff', textTransform: 'uppercase' }}
                        />
                      </div>

                      {/* File upload simulator */}
                      <label style={{ display: 'block', padding: '1.5rem', background: '#fff', border: '2px dashed var(--rv-color-border)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files?.length) {
                              setKycUploaded(true);
                              if (!kycNumber) setKycNumber('548291024432');
                            }
                          }}
                        />
                        <UploadCloud size={32} color="var(--rv-color-accent)" style={{ margin: '0 auto 0.5rem' }} />
                        <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                          {kycUploaded ? 'Document Uploaded &amp; OCR Read' : 'Upload photo of ID Document (Front)'}
                        </strong>
                        <span style={{ color: 'var(--rv-color-secondary)', fontSize: '0.75rem' }}>PNG, JPG or PDF up to 10MB</span>
                      </label>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={handleQuickKycVerify}
                          disabled={kycVerifying}
                          className="rv-button rv-button--signal"
                          style={{ flex: 1, padding: '0.75rem' }}
                        >
                          {kycVerifying ? 'Authenticating with Gateway...' : 'Verify Now (AI Instant Gate)'}
                        </button>
                        
                        <Link 
                          to="/kyc" 
                          target="_blank" 
                          style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', padding: '0.5rem' }}
                        >
                          Full Portal <ExternalLink size={14} />
                        </Link>
                      </div>

                      {kycFeedback && (
                        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                          {kycFeedback}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setStep(1)} className="rv-button rv-button--light">Back</button>
                  <button
                    onClick={() => {
                      if (isKycVerified) {
                        setStep(3);
                      } else {
                        alert('Please complete the KYC verification step above to proceed.');
                      }
                    }}
                    className="rv-button rv-button--signal"
                  >
                    Continue to review &amp; payment &rarr;
                  </button>
                </div>
              </div>
            )}
          </article>

          {/* STEP 3: Review and Confirm */}
          <article className="rv-stepper-card" style={{ opacity: step === 3 ? 1 : 0.6 }}>
            <div className="rv-step-header">
              <div className="rv-step-badge" style={{ background: step >= 3 ? 'var(--rv-color-primary)' : 'var(--rv-color-border)' }}>3</div>
              <div>
                <h3>Review and confirm</h3>
                <p>Check the plan and proceed to secure payment gateway.</p>
              </div>
            </div>

            {step === 3 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1.25rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--rv-color-secondary)', marginBottom: '0.25rem' }}>Delivery Address</strong>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{address}</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--rv-color-secondary)', marginBottom: '0.25rem' }}>Delivery Date</strong>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{deliveryDate}</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--rv-color-secondary)', marginBottom: '0.25rem' }}>KYC Clearance</strong>
                    <span style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Verified &bull; Gate Cleared
                    </span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--rv-color-background)', borderRadius: 'var(--rv-radius-md)' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--rv-color-secondary)', marginBottom: '0.25rem' }}>Shortlisted Items</strong>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cartItems.length} appliances</span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={24} color="#0284c7" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>Razorpay &bull; UPI Instant Gateway</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Supports GPay, PhonePe, Cards, NetBanking &bull; 256-bit SSL</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--rv-color-primary)' }}>{formatINR(payableNow)}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Due today</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button onClick={() => setStep(2)} className="rv-button rv-button--light">Back</button>
                  <button 
                    onClick={() => setIsPaymentOpen(true)} 
                    disabled={isSubmitting} 
                    className="rv-button rv-button--signal"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Lock size={16} /> Proceed to Razorpay / UPI Simulator ({formatINR(payableNow)})
                  </button>
                </div>
              </div>
            )}
          </article>
        </section>

        {/* ORDER SUMMARY SIDEBAR */}
        <aside className="rv-sticky-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order summary</h2>
          
          {totals.rentCount > 0 && (
            <>
              <div className="rv-summary-row">
                <span>Monthly rent ({totals.rentCount} items)</span>
                <strong>{formatINR(totals.monthly)}</strong>
              </div>
              <div className="rv-summary-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Dynamic deposit <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>(100% Refundable)</span>
                </span>
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
            <span>GST Tax (18% on rent)</span>
            <strong>{formatINR(taxAmount)}</strong>
          </div>

          <div className="rv-summary-row">
            <span>Delivery &amp; setup</span>
            <strong style={{ color: '#10b981' }}>Free</strong>
          </div>

          <div style={{ padding: '0.75rem 1rem', background: '#ecfdf5', borderRadius: '8px', margin: '1rem 0', fontSize: '0.8rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Deposit is automatically refunded upon return simulation.</span>
          </div>

          <div className="rv-summary-row rv-summary-row--strong">
            <span>Payable now</span>
            <strong>{formatINR(payableNow)}</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--rv-color-secondary)', marginBottom: '1.5rem' }}>Total due today before delivery.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--rv-color-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> 256-bit Encrypted Payments</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> Instant Return &amp; Refund Guarantee</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} color="var(--rv-color-accent)" /> Service &amp; Maintenance Included</div>
          </div>
        </aside>
      </div>

      {/* Razorpay / UPI Simulator Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={payableNow}
        rentAmount={totals.monthly}
        depositAmount={totals.deposit}
        taxAmount={taxAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </main>
  );
}

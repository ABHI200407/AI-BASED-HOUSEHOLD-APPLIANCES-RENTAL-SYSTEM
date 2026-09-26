import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  Sparkles, 
  ArrowRight,
  QrCode,
  AlertCircle
} from 'lucide-react';

export default function PaymentGatewayModal({ 
  isOpen, 
  onClose, 
  totalAmount = 0, 
  rentAmount = 0, 
  depositAmount = 0, 
  taxAmount = 0, 
  onPaymentSuccess 
}) {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [stage, setStage] = useState('input'); // 'input' | 'processing' | 'success'
  const [statusMessage, setStatusMessage] = useState('');
  
  // UPI Form state
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [qrCountdown, setQrCountdown] = useState(180);

  // Card Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');

  // NetBanking state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  const popularBanks = [
    { id: 'HDFC', name: 'HDFC Bank', code: 'HDFC', icon: '🏛️', color: '#004c8f' },
    { id: 'SBI', name: 'State Bank of India', code: 'SBI', icon: '🏦', color: '#280071' },
    { id: 'ICICI', name: 'ICICI Bank', code: 'ICICI', icon: '🏢', color: '#b02a30' },
    { id: 'AXIS', name: 'Axis Bank', code: 'AXIS', icon: '🏬', color: '#97144d' },
    { id: 'KOTAK', name: 'Kotak Mahindra', code: 'KOTAK', icon: '🏦', color: '#ed1c24' },
    { id: 'PNB', name: 'Punjab National Bank', code: 'PNB', icon: '🏛️', color: '#a20a3a' },
  ];

  // Timer for QR code
  useEffect(() => {
    let timer;
    if (isOpen && activeTab === 'upi' && stage === 'input' && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, activeTab, stage, qrCountdown]);

  if (!isOpen) return null;

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const getCardNetwork = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('6') || clean.startsWith('3')) return 'RuPay';
    return 'Card';
  };

  const triggerPaymentProcess = (paymentMethod, paymentDetails) => {
    setStage('processing');
    setStatusMessage('Initiating 256-bit encrypted handshake...');

    setTimeout(() => {
      setStatusMessage('Authenticating with Banking Gateway Node...');
    }, 800);

    setTimeout(() => {
      setStatusMessage('Verifying 3D-Secure e-Mandate...');
    }, 1600);

    setTimeout(() => {
      setStage('success');
      setStatusMessage('Payment Authorized & Verified!');
      
      setTimeout(() => {
        const txId = 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const invNum = 'INV-RENT-' + Math.floor(100000 + Math.random() * 900000);
        
        onPaymentSuccess({
          payment_method: paymentMethod,
          transaction_id: txId,
          invoice_number: invNum,
          details: paymentDetails,
          amount_total: totalAmount,
          amount_rent: rentAmount,
          amount_deposit: depositAmount,
          amount_tax: taxAmount,
          timestamp: new Date().toISOString()
        });
      }, 1200);
    }, 2400);
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (!upiId || !upiId.includes('@')) {
      setUpiError('Enter a valid UPI Virtual Payment Address (e.g. name@okhdfcbank)');
      return;
    }
    setUpiError('');
    triggerPaymentProcess('UPI', { vpa: upiId });
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length < 16) {
      setCardError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setCardError('Enter expiry in MM/YY format.');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setCardError('Enter 3-digit CVV.');
      return;
    }
    setCardError('');
    triggerPaymentProcess('Card', { 
      network: getCardNetwork(), 
      last4: cleanNum.slice(-4),
      holder: cardHolder || 'Cardholder'
    });
  };

  const handleNetBankingSubmit = () => {
    triggerPaymentProcess('NetBanking', { bank: selectedBank });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1rem',
      fontFamily: 'Manrope, Inter, sans-serif',
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '560px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        border: '1px solid #e2e8f0',
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <ShieldCheck size={16} /> Rentova Pay Gateway Simulator
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              ₹{Number(totalAmount).toLocaleString('en-IN')}
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>total due today</span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={stage === 'processing'}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: stage === 'processing' ? 'not-allowed' : 'pointer',
              color: '#ffffff',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Breakdown bar */}
        <div style={{
          background: '#f8fafc',
          padding: '10px 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#64748b',
        }}>
          <span>1st Month Rent: <strong style={{ color: '#0f172a' }}>₹{rentAmount}</strong></span>
          <span>Refundable Deposit: <strong style={{ color: '#0f172a' }}>₹{depositAmount}</strong></span>
          <span>Tax: <strong style={{ color: '#0f172a' }}>₹{taxAmount}</strong></span>
        </div>

        {/* Processing State */}
        {stage === 'processing' && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 1.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '4px solid #e2e8f0',
                borderTopColor: '#5c45fd',
                animation: 'spin 1s linear infinite',
              }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Processing Transaction
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{statusMessage}</p>
            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              🔒 Do not close or refresh this window
            </div>
          </div>
        )}

        {/* Success State */}
        {stage === 'success' && (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <CheckCircle2 size={40} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>
              Payment Authorized!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem' }}>
              {statusMessage} Generating your rental agreement and tax invoice receipt...
            </p>
          </div>
        )}

        {/* Input Stage */}
        {stage === 'input' && (
          <div style={{ padding: '1.5rem' }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #f1f5f9',
              marginBottom: '1.5rem',
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'upi' ? '2px solid #5c45fd' : '2px solid transparent',
                  marginBottom: '-2px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: activeTab === 'upi' ? '#5c45fd' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Smartphone size={16} /> UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'card' ? '2px solid #5c45fd' : '2px solid transparent',
                  marginBottom: '-2px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: activeTab === 'card' ? '#5c45fd' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <CreditCard size={16} /> Card
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'netbanking' ? '2px solid #5c45fd' : '2px solid transparent',
                  marginBottom: '-2px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: activeTab === 'netbanking' ? '#5c45fd' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Building2 size={16} /> NetBanking
              </button>
            </div>

            {/* UPI Tab */}
            {activeTab === 'upi' && (
              <div>
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}>
                  {/* Generated QR code box */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <QrCode size={90} color="#0f172a" />
                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                      Scan &amp; Pay
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      Scan with any UPI App
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px', lineHeight: 1.4 }}>
                      Google Pay, PhonePe, Paytm, BHIM, or CRED
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 600 }}>
                      ⏳ QR expires in: {Math.floor(qrCountdown / 60)}:{(qrCountdown % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpiSubmit}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Or Enter UPI ID / VPA
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: upiError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#5c45fd',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Pay ₹{totalAmount}
                    </button>
                  </div>

                  {upiError && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '10px' }}>
                      {upiError}
                    </div>
                  )}

                  {/* Quick autofill buttons */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {['@okhdfcbank', '@paytm', '@okaxis', '@ybl'].map((suf) => (
                      <button
                        key={suf}
                        type="button"
                        onClick={() => setUpiId(`demo.renter${suf}`)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          color: '#475569',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        + demo{suf}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            )}

            {/* Card Tab */}
            {activeTab === 'card' && (
              <form onSubmit={handleCardSubmit}>
                {cardError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '12px' }}>
                    {cardError}
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    <span>Card Number</span>
                    <span style={{ color: '#5c45fd', fontWeight: 600 }}>{getCardNetwork()}</span>
                  </label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCardNumber('4532 8812 9942 1084');
                    setCardExpiry('08/29');
                    setCardCvv('782');
                    setCardHolder('Aditya Sharma');
                  }}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    cursor: 'pointer',
                    marginBottom: '16px',
                  }}
                >
                  ⚡ Fill Sample Test Card
                </button>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  Pay ₹{totalAmount} via Card
                </button>
              </form>
            )}

            {/* NetBanking Tab */}
            {activeTab === 'netbanking' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                  Select Bank
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
                  {popularBanks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBank(b.id)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: '10px',
                        border: selectedBank === b.id ? '2px solid #5c45fd' : '1px solid #e2e8f0',
                        background: selectedBank === b.id ? '#f5f3ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{b.icon}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{b.name}</div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNetBankingSubmit}
                  style={{
                    width: '100%',
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  Proceed with {selectedBank} Bank &bull; ₹{totalAmount}
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.25rem' }}>
              <Lock size={12} /> Powered by Razorpay Sandbox Simulator &bull; Test Mode
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

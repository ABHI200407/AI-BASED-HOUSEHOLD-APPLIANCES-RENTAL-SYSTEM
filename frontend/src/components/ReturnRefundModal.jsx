import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Smartphone, 
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import api from '../api/axios';

export default function ReturnRefundModal({ isOpen, onClose, rental, onRefundSuccess }) {
  const [stage, setStage] = useState('review'); // 'review' | 'processing' | 'completed'
  const [returnReason, setReturnReason] = useState('Relocating to new address');
  const [refundMethod, setRefundMethod] = useState('upi'); // 'upi' | 'bank'
  const [processingMsg, setProcessingMsg] = useState('');
  const [refundTxId, setRefundTxId] = useState('');

  if (!isOpen || !rental) return null;

  const deposit = Number(rental.total_amount ? Math.round(rental.total_amount * 0.35) : 1200);

  const handleConfirmReturn = async () => {
    setStage('processing');
    setProcessingMsg('Initiating Reverse Logistics Dispatch Ticket...');

    setTimeout(() => {
      setProcessingMsg('Verifying Equipment Condition & 0-Damage Self-Check...');
    }, 900);

    setTimeout(() => {
      setProcessingMsg('Authorizing Instant Banking IMPS Deposit Reversal...');
    }, 1800);

    setTimeout(async () => {
      const generatedTx = 'RFND-IMPS-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setRefundTxId(generatedTx);

      try {
        await api.patch(`bookings/${rental.id}/`, { status: 'returned' });
      } catch (e) {
        console.warn('Booking status backend update note:', e);
      }

      setStage('completed');
      if (onRefundSuccess) {
        onRefundSuccess({
          rentalId: rental.id,
          depositRefunded: deposit,
          refundTxId: generatedTx,
        });
      }
    }, 2700);
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
        border: '1px solid #e2e8f0',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
              <RotateCcw size={15} /> Return &amp; Refund Simulation
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 0' }}>
              Return {rental.appliance_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={stage === 'processing'}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: stage === 'processing' ? 'not-allowed' : 'pointer',
              color: '#fff',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Processing State */}
        {stage === 'processing' && (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '4px solid #e2e8f0',
              borderTopColor: '#0284c7',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem',
            }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Simulating Instant Refund &amp; Pickup
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{processingMsg}</p>
          </div>
        )}

        {/* Completed State */}
        {stage === 'completed' && (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
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
              ₹{deposit.toLocaleString('en-IN')} Refund Completed!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Security deposit has been successfully credited to your original payment destination.
            </p>

            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Refund Reference:</span>
                <strong style={{ fontFamily: 'monospace' }}>{refundTxId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Reverse Pickup:</span>
                <strong>Tomorrow (10 AM &bull; Free Pickup)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Rental Status:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Returned &amp; Closed</span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#111827',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Done &bull; Return to Bookings
            </button>
          </div>
        )}

        {/* Review State */}
        {stage === 'review' && (
          <div style={{ padding: '1.75rem' }}>
            {/* Condition Check banner */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '14px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}>
              <ShieldCheck size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#166534', marginBottom: '2px' }}>
                  Eligible for 100% Full Deposit Refund
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#15803d' }}>
                  No damage penalty. Normal usage &amp; wear-and-tear is completely covered under Rentova Care.
                </span>
              </div>
            </div>

            {/* Deposit Breakdown */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                <span>Paid Security Deposit:</span>
                <strong style={{ color: '#0f172a' }}>₹{deposit.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                <span>Deduction for Fair Wear:</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>- ₹0 (Covered)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                <span>Reverse Logistics / Pickup:</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                <span>Net Refund to You:</span>
                <span style={{ color: '#0284c7' }}>₹{deposit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Reason selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Return Reason
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                }}
              >
                <option>Relocating to new address or city</option>
                <option>Tenure ended / Project completed</option>
                <option>Upgrading to a newer drop or model</option>
                <option>No longer needed</option>
              </select>
            </div>

            {/* Refund destination */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Refund Destination
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRefundMethod('upi')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: refundMethod === 'upi' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: refundMethod === 'upi' ? '#f0f9ff' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Smartphone size={16} /> Instant UPI Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setRefundMethod('bank')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: refundMethod === 'bank' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: refundMethod === 'bank' ? '#f0f9ff' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <CreditCard size={16} /> Original Bank Account
                </button>
              </div>
            </div>

            {/* Action */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                style={{
                  flex: 2,
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                Confirm Return &bull; Refund ₹{deposit} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

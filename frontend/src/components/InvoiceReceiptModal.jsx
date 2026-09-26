import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, FileText } from 'lucide-react';
import { formatINR } from '../utils/media';

export default function InvoiceReceiptModal({ isOpen, onClose, invoiceData }) {
  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const rent = Number(invoiceData.amount_rent || 0);
  const deposit = Number(invoiceData.amount_deposit || 0);
  const tax = Number(invoiceData.amount_tax || Math.round(rent * 0.18));
  const total = Number(invoiceData.amount_total || (rent + deposit + tax));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'Manrope, Inter, sans-serif',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '640px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
      }}>
        {/* Top Actions */}
        <div style={{
          background: '#f8fafc',
          padding: '12px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '0.85rem', fontWeight: 700 }}>
            <CheckCircle size={16} /> Tax Invoice &bull; Authorized
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                RENTOVA
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Curated Habitation &amp; Equipment Systems</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>TAX INVOICE</div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#5c45fd' }}>
                {invoiceData.invoice_number || 'INV-RENT-892104'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Date: {formatDate(invoiceData.timestamp)}
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                Billed To
              </div>
              <strong style={{ display: 'block', color: '#0f172a' }}>Verified Resident</strong>
              <span style={{ color: '#64748b' }}>Hyderabad Hub Delivery Zone</span>
              <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600, marginTop: '2px' }}>
                ✓ KYC Validated
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                Transaction Node
              </div>
              <strong style={{ display: 'block', color: '#0f172a' }}>{invoiceData.payment_method || 'UPI (Live Gateway)'}</strong>
              <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {invoiceData.transaction_id || 'TXN_SIMULATED_8892'}
              </span>
            </div>
          </div>

          {/* Line items table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Description</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px' }}>
                  <strong>First Month Rental Advance</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tenure contract with free delivery &amp; maintenance</div>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600 }}>
                  ₹{rent.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px' }}>
                  <strong>Refundable Security Deposit</strong>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>100% refundable upon equipment return</div>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600 }}>
                  ₹{deposit.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px' }}>
                  <strong>GST (18% on Rental Service)</strong>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600 }}>
                  ₹{tax.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total summary */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Total Paid (Receipt)</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#5c45fd' }}>
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
            Rentova Technologies &bull; GSTIN: 36AAECR9812K1Z9 &bull; Reverse logistics guaranteed
          </div>
        </div>
      </div>
    </div>
  );
}

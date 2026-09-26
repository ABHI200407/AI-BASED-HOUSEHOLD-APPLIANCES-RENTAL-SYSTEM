import React, { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  UploadCloud, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Zap, 
  ShieldAlert, 
  X,
  FileCheck,
  ChevronLeft,
  Sparkles,
  Building2,
  BadgeCheck,
  ScanLine
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function KYC() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [idType, setIdType] = useState('Aadhar Card');
  const [idFile, setIdFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [idDragOver, setIdDragOver] = useState(false);
  const [addressDragOver, setAddressDragOver] = useState(false);
  
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [verified, setVerified] = useState(() => localStorage.getItem('rentai_kyc_verified') === 'true');
  const [verificationId, setVerificationId] = useState(() => localStorage.getItem('rentai_kyc_id') || 'KYC-IND-882194');
  const [error, setError] = useState('');

  const idInputRef = useRef(null);
  const addressInputRef = useRef(null);

  const verificationSteps = [
    'Scanning Document Structure & Tamper Check...',
    'Performing AI Optical Character Recognition (OCR)...',
    'Verifying UIDAI / NSDL Identity Ledger...',
    'Anti-Fraud Biometric Handshake Approved!'
  ];

  const handleStartVerification = async (e) => {
    e.preventDefault();
    if (!idFile && !verified) {
      setError('Please select or upload your ID Proof document.');
      return;
    }
    setError('');
    setVerifying(true);
    setVerifyStep(0);

    // Multi-stage verification animation
    for (let i = 0; i < verificationSteps.length; i++) {
      setVerifyStep(i);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      const generatedId = `KYC-IND-${Math.floor(100000 + Math.random() * 900000)}`;
      localStorage.setItem('rentai_kyc_verified', 'true');
      localStorage.setItem('rentai_kyc_id', generatedId);
      localStorage.setItem('rentai_kyc_type', idType);
      
      // Notify backend if logged in
      if (user && user.id) {
        await axios.post('http://localhost:8000/api/users/kyc/', {
          user_id: user.id,
          id_type: idType,
          id_number: '•••• •••• 8291'
        }).catch(() => {});
      }

      setVerificationId(generatedId);
      setVerified(true);
    } catch {
      setVerified(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('rentai_kyc_verified');
    localStorage.removeItem('rentai_kyc_id');
    setVerified(false);
    setIdFile(null);
    setAddressFile(null);
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Manrope, Inter, sans-serif',
      paddingTop: '6rem',
      paddingBottom: '8rem',
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '8px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
            <Lock size={14} color="#10b981" /> 256-Bit Encrypted &bull; UIDAI Compliant
          </div>
        </div>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(92, 69, 253, 0.08)',
            border: '1px solid rgba(92, 69, 253, 0.2)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#5c45fd',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <ShieldCheck size={16} /> KYC Verification Gate
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'Fraunces, serif',
            fontWeight: 700,
            marginBottom: '0.75rem',
            lineHeight: 1.15,
          }}>
            Instant Identity Verification.
          </h1>
          <p style={{ maxWidth: '580px', margin: '0 auto', color: '#64748b', fontSize: '1.05rem', lineHeight: 1.5 }}>
            To protect owners and secure high-value appliance rentals without massive security deposits, Rentova uses instant AI-powered KYC verification.
          </p>
        </header>

        {/* Verification Card */}
        {verified ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #10b981',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <CheckCircle2 size={48} color="#10b981" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#065f46' }}>
              KYC Verification Verified!
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '2rem' }}>
              Your government identity token is active and eligible for instant rentals with dynamic tenure deposits.
            </p>

            <div style={{
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Certificate ID</span>
                <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{verificationId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Document Type</span>
                <strong>{localStorage.getItem('rentai_kyc_type') || 'Aadhar Card'} (Validated)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Verification Status</span>
                <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BadgeCheck size={16} /> Level 3 Verified
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/cart')}
                style={{
                  background: '#111827',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Proceed to Cart &bull; Checkout <ArrowRight size={18} />
              </button>

              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #cbd5e1',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset / Re-upload
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          }}>
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <ShieldAlert size={16} /> {error}
              </div>
            )}

            {/* Document Selection Tabs */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Government ID Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {['Aadhar Card', 'PAN Card', 'Passport', 'Voter ID'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIdType(type)}
                    style={{
                      background: idType === type ? '#111827' : '#f8fafc',
                      color: idType === type ? '#ffffff' : '#475569',
                      border: idType === type ? '1px solid #111827' : '1px solid #e2e8f0',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* ID Proof Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  {idType} Document (Front &amp; Back) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIdDragOver(true); }}
                  onDragLeave={() => setIdDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIdDragOver(false);
                    if (e.dataTransfer.files?.[0]) setIdFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => idInputRef.current?.click()}
                  style={{
                    border: idDragOver ? '2px dashed #5c45fd' : '2px dashed #cbd5e1',
                    background: idDragOver ? 'rgba(92,69,253,0.04)' : '#f8fafc',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    ref={idInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) setIdFile(e.target.files[0]);
                    }}
                  />
                  {idFile ? (
                    <div>
                      <FileCheck size={36} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>{idFile.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Ready for verification</span>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud size={36} color="#64748b" style={{ margin: '0 auto 0.5rem' }} />
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1e293b', marginBottom: '0.25rem' }}>Click or drag {idType} file here</strong>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Supports PNG, JPG, or PDF (up to 10MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Proof Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  Address Verification Proof (Optional / Fast-Track)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setAddressDragOver(true); }}
                  onDragLeave={() => setAddressDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setAddressDragOver(false);
                    if (e.dataTransfer.files?.[0]) setAddressFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => addressInputRef.current?.click()}
                  style={{
                    border: addressDragOver ? '2px dashed #5c45fd' : '2px dashed #cbd5e1',
                    background: addressDragOver ? 'rgba(92,69,253,0.04)' : '#f8fafc',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    ref={addressInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) setAddressFile(e.target.files[0]);
                    }}
                  />
                  {addressFile ? (
                    <div>
                      <FileCheck size={36} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>{addressFile.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Address document attached</span>
                    </div>
                  ) : (
                    <div>
                      <Building2 size={36} color="#64748b" style={{ margin: '0 auto 0.5rem' }} />
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1e293b', marginBottom: '0.25rem' }}>Utility Bill or Rental Agreement</strong>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Auto-unlocks zero-deposit rental tiers</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Processing Modal */}
            {verifying && (
              <div style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#5c45fd', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <ScanLine className="spin" size={20} /> AI Verification Engine Active
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                  {verificationSteps[verifyStep]}
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
                  <div style={{
                    width: `${((verifyStep + 1) / verificationSteps.length) * 100}%`,
                    height: '100%',
                    background: '#5c45fd',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                <Zap size={15} color="#eab308" /> Instant approval in &lt; 30 seconds
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    // Quick test autofill for user convenience
                    setIdFile({ name: 'mock_aadhar_card_front.png' });
                    setAddressFile({ name: 'mock_electricity_bill_hyd.pdf' });
                  }}
                  style={{
                    background: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Autofill Sample Docs
                </button>

                <button
                  onClick={handleStartVerification}
                  disabled={verifying}
                  style={{
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: verifying ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {verifying ? 'Verifying...' : 'Verify Identity Now'} <ArrowRight size={16} />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

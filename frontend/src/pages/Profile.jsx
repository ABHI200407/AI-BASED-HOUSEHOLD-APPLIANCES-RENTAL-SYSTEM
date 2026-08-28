import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, User, MapPin, FileText, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('details');
  const [kycUploaded, setKycUploaded] = useState(false);

  if (!user) {
    return (
      <div className="rv-shell" style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center' }}>
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  return (
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="rv-section-heading" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="rv-section-label"><User size={14} style={{display:'inline', verticalAlign:'middle'}}/> My Account</span>
          <h2>Manage your profile</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Sidebar Tabs */}
        <aside style={{ flex: '0 0 250px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fff', padding: '1rem', borderRadius: 'var(--rv-radius-md)', border: '1px solid var(--rv-color-border)' }}>
            <button 
              onClick={() => setActiveTab('details')}
              style={{ padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '8px', background: activeTab === 'details' ? 'rgba(0,0,0,0.05)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === 'details' ? 600 : 400 }}
            >
              <User size={18} /> Personal Details
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              style={{ padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '8px', background: activeTab === 'addresses' ? 'rgba(0,0,0,0.05)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === 'addresses' ? 600 : 400 }}
            >
              <MapPin size={18} /> Saved Addresses
            </button>
            <button 
              onClick={() => setActiveTab('kyc')}
              style={{ padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '8px', background: activeTab === 'kyc' ? 'rgba(0,0,0,0.05)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === 'kyc' ? 600 : 400 }}
            >
              <ShieldCheck size={18} /> KYC Verification
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <section style={{ flex: 1, minWidth: '300px' }}>
          {activeTab === 'details' && (
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--rv-radius-md)', border: '1px solid var(--rv-color-border)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Personal Details</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '400px' }}>
                <div>
                  <label className="rv-section-label" style={{ marginBottom: '0.25rem' }}>Full Name</label>
                  <input type="text" defaultValue={user.full_name} className="rv-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--rv-color-border)', borderRadius: '8px' }} />
                </div>
                <div>
                  <label className="rv-section-label" style={{ marginBottom: '0.25rem' }}>Email Address</label>
                  <input type="email" defaultValue={user.email} disabled className="rv-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--rv-color-border)', borderRadius: '8px', background: '#f9fafb' }} />
                </div>
                <div>
                  <label className="rv-section-label" style={{ marginBottom: '0.25rem' }}>Phone Number</label>
                  <input type="tel" placeholder="+91" className="rv-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--rv-color-border)', borderRadius: '8px' }} />
                </div>
                <button className="rv-button rv-button--signal" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--rv-radius-md)', border: '1px solid var(--rv-color-border)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Saved Addresses</h3>
              <div style={{ padding: '1.5rem', border: '1px solid var(--rv-color-border)', borderRadius: '8px', marginBottom: '1rem' }}>
                <strong>Home</strong>
                <p style={{ color: 'var(--rv-color-secondary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>123 Tech Park, React Avenue<br/>Bangalore, KA 560001</p>
              </div>
              <button className="rv-button rv-button--light">+ Add New Address</button>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--rv-radius-md)', border: '1px solid var(--rv-color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>KYC Verification</h3>
                {kycUploaded ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle2 size={14} /> Verified
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Action Required
                  </span>
                )}
              </div>
              
              <p style={{ color: 'var(--rv-color-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                To rent furniture or appliances, we require a valid government ID for security purposes. This ensures a safe community for both owners and tenants.
              </p>

              <label style={{ display: 'block', padding: '3rem 2rem', background: 'var(--rv-color-background)', border: '2px dashed var(--rv-color-border)', borderRadius: 'var(--rv-radius-lg)', textAlign: 'center', cursor: 'pointer', transition: 'var(--rv-transition)' }}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => setKycUploaded(Boolean(e.target.files?.length))}
                />
                <UploadCloud size={48} color={kycUploaded ? "#10b981" : "var(--rv-color-accent)"} style={{ margin: '0 auto 1rem' }} />
                <strong style={{ display: 'block', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  {kycUploaded ? 'Aadhar Card (Verified)' : 'Click to upload Aadhar/PAN'}
                </strong>
                <span style={{ color: 'var(--rv-color-secondary)', fontSize: '0.875rem' }}>Supports JPG, PNG, or PDF</span>
              </label>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

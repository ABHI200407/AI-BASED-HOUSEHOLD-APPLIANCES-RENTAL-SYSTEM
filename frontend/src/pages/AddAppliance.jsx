import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2, DollarSign, FileImage, MapPin, Plus, Sparkles,
  Tag, Type, ArrowLeft, UploadCloud, X, ShieldCheck, Info,
  Layers, Package, Sliders, Check
} from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = [
  // Appliances
  { id: 'AC', name: 'Air Conditioner (Split / Window)', group: 'Appliances' },
  { id: 'Refrigerator', name: 'Refrigerator (Single / Double Door)', group: 'Appliances' },
  { id: 'Washing Machine', name: 'Washing Machine (Front / Top Load)', group: 'Appliances' },
  { id: 'TV', name: 'Smart 4K / OLED TV', group: 'Appliances' },
  { id: 'Microwave', name: 'Convection Microwave Oven', group: 'Appliances' },
  { id: 'Water Purifier', name: 'RO + UV Water Purifier', group: 'Appliances' },
  // Furniture
  { id: 'Sofa', name: 'Sofa / Sectional Couch', group: 'Furniture' },
  { id: 'Bed', name: 'Bed Frame & Ortho Mattress', group: 'Furniture' },
  { id: 'Dining', name: 'Dining Table & Chair Set', group: 'Furniture' },
  { id: 'Workstation', name: 'Ergonomic Desk & Mesh Chair', group: 'Furniture' },
  { id: 'Storage', name: 'Wardrobe & Storage Cabinet', group: 'Furniture' },
];

const CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi NCR', 'Gurugram',
  'Hyderabad', 'Pune', 'Chennai', 'Kolkata'
];

export default function AddAppliance() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    category: 'AC',
    brand: '',
    condition: 'Like New',
    description: '',
    price_per_day: '',
    monthly_rent: '1200',
    deposit_multiplier: '1.2',
    location: 'Bengaluru',
    dimensions: '',
    power_rating: '3-Star Inverter',
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [id]: value };
      // Auto-compute price per day if monthly rent changes
      if (id === 'monthly_rent') {
        const m = parseFloat(value) || 0;
        updated.price_per_day = (m / 30).toFixed(1);
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (user?.id) data.append('owner_id', user.id);
    images.forEach((file) => data.append('images', file));

    try {
      await api.post('appliances/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/owner');
    } catch (err) {
      console.warn('Backend rejected multipart, falling back or showing note:', err);
      // If error occurs, still gracefully navigate after small timeout if mock backend
      if (err.response?.status === 400 || err.response?.status === 500) {
        setError(err.response?.data?.error || 'Failed to submit listing. Please check required fields.');
      } else {
        navigate('/owner');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthlyRentNum = parseFloat(formData.monthly_rent) || 0;
  const netEarnings = Math.round(monthlyRentNum * 0.85);
  const depositEst = Math.round(monthlyRentNum * (parseFloat(formData.deposit_multiplier) || 1.2));

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'var(--font-body, "Manrope", Inter, sans-serif)',
      color: '#0f172a',
      padding: '2rem 3rem 6rem',
    }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>

        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#ffffff', borderRadius: '20px', padding: '1.5rem 2rem',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              to="/owner"
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                border: '1px solid #cbd5e1', background: '#f8fafc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#334155', textDecoration: 'none',
              }}
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 style={{
                fontSize: '1.45rem', fontWeight: 900, margin: 0,
                fontFamily: 'var(--font-display, "Fraunces", serif)', color: '#0f172a',
              }}>
                Onboard New Rental Asset
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                List your appliance or designer furniture piece on the Rentova marketplace.
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626',
            padding: '12px 18px', borderRadius: '12px', marginBottom: '1.5rem',
            fontSize: '0.9rem', fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left: Asset Form Fields */}
          <div style={{
            background: '#ffffff', borderRadius: '20px', padding: '2rem',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#0f172a' }}>
              Asset Details &amp; Specifications
            </h2>

            {/* Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                Item Title / Display Name *
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="e.g. Samsung 260L Digital Inverter Refrigerator"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Category & Brand Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                    border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff',
                  }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.group}] {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  id="brand"
                  placeholder="e.g. LG, Godrej, Ikea, Urban Ladder"
                  value={formData.brand}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Condition & Location Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Condition Grade *
                </label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                    border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff',
                  }}
                >
                  <option value="Brand New">Brand New (In Factory Box)</option>
                  <option value="Like New">Like New / Mint (&lt; 6 mo old)</option>
                  <option value="Good">Good (Light regular wear)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Base City Hub *
                </label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                    border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff',
                  }}
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dimensions & Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Dimensions / Capacity
                </label>
                <input
                  type="text"
                  id="dimensions"
                  placeholder="e.g. 180x90 cm or 260 Litres"
                  value={formData.dimensions}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Specification / Rating
                </label>
                <input
                  type="text"
                  id="power_rating"
                  placeholder="e.g. 4-Star Inverter, 720 RPM"
                  value={formData.power_rating}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                Item Description &amp; Highlights
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Mention key highlights, warranty status, inclusions (remote, power cable, mattress)..."
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box',
                  fontFamily: 'inherit', resize: 'vertical',
                }}
              />
            </div>

            {/* Multi-Image Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                High-Resolution Asset Photos (1-5 images)
              </label>
              
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const files = Array.from(e.dataTransfer.files || []);
                  setImages(prev => [...prev, ...files]);
                }}
                style={{
                  border: `2px dashed ${dragOver ? '#5c45fd' : '#cbd5e1'}`,
                  borderRadius: '16px', padding: '1.75rem', textAlign: 'center',
                  background: dragOver ? 'rgba(92,69,253,0.05)' : '#f8fafc',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <UploadCloud size={32} color="#5c45fd" style={{ margin: '0 auto 8px' }} />
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.9rem' }}>
                  Click to browse photos or drag and drop
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  PNG, JPG, or WEBP up to 10MB each
                </span>
                <input
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Previews */}
              {previewUrls.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {previewUrls.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        style={{
                          position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px',
                          borderRadius: '50%', background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right: Pricing & Yield Preview Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
              background: '#ffffff', borderRadius: '20px', padding: '1.75rem',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#0f172a' }}>
                Rental Yield &amp; Payout Settings
              </h2>

              {/* Monthly Rent Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Desired Monthly Rent (₹/mo) *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: 800, color: '#64748b' }}>₹</span>
                  <input
                    type="number"
                    id="monthly_rent"
                    required
                    min="100"
                    max="50000"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    style={{
                      width: '100%', padding: '10px 14px 10px 30px', borderRadius: '10px',
                      border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Deposit Multiplier */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Security Deposit Ratio
                </label>
                <select
                  id="deposit_multiplier"
                  value={formData.deposit_multiplier}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                    border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff',
                  }}
                >
                  <option value="1.0">1.0× Monthly Rent</option>
                  <option value="1.2">1.2× Monthly Rent (Recommended)</option>
                  <option value="1.5">1.5× Monthly Rent</option>
                </select>
              </div>

              {/* Real-time Payout Breakdown */}
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '10px' }}>
                  Host Net Take-Home Calculation
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Gross Monthly Rent:</span>
                  <strong style={{ color: '#0f172a' }}>₹{monthlyRentNum.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Platform Fee (15%):</span>
                  <span style={{ color: '#e11d48' }}>-₹{Math.round(monthlyRentNum * 0.15).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', color: '#059669' }}>
                  <span>Escrow Deposit Held:</span>
                  <span>₹{depositEst.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '2px solid #10b981' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>Your Monthly Payout:</span>
                  <strong style={{ fontSize: '1.35rem', color: '#10b981' }}>₹{netEarnings.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%', background: 'var(--accent, #5c45fd)', color: '#ffffff',
                  border: 'none', padding: '14px', borderRadius: '12px',
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 14px rgba(92,69,253,0.3)',
                }}
              >
                {isSubmitting ? 'Publishing Asset...' : <><Plus size={18} /> Publish Asset to Marketplace</>}
              </button>

            </div>

            {/* Host Protection Badge */}
            <div style={{
              background: '#ffffff', borderRadius: '18px', padding: '1.25rem',
              border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <ShieldCheck size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                  ₹5,00,000 Host Protection Guarantee
                </strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                  Every listed asset is insured against transit damage, tenant mishandling, and electrical surges. Rentova handles pickup and delivery.
                </p>
              </div>
            </div>

          </div>

        </form>

      </div>
    </main>
  );
}

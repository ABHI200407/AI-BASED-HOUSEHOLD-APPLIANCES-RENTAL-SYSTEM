import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, DollarSign, FileImage, MapPin, Plus, Sparkles, Tag, Type } from 'lucide-react';
import api from '../api/axios';

export default function AddAppliance() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'AC',
    description: '',
    price_per_day: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((file) => data.append('images', file));

    try {
      await api.post('appliances/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/owner');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add appliance');
    }
  };

  return (
    <main className="dashboard-layout">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} />
            New listing
          </div>
          <h1>Add a rental-ready appliance.</h1>
        </div>
      </div>

      <div className="grid-2">
        <section className="form-card" style={{ padding: '24px' }}>
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="stack">
            <div className="grid-2">
              <div className="stack" style={{ gap: '8px' }}>
                <label className="eyebrow">
                  <Type size={14} />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>

              <div className="stack" style={{ gap: '8px' }}>
                <label className="eyebrow">
                  <Tag size={14} />
                  Category
                </label>
                <select id="category" value={formData.category} onChange={handleChange} className="field-select">
                  <option value="AC">AC</option>
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="Washing Machine">Washing Machine</option>
                  <option value="Microwave">Microwave</option>
                  <option value="TV">TV</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="stack" style={{ gap: '8px' }}>
                <label className="eyebrow">
                  <DollarSign size={14} />
                  Price per day
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price_per_day"
                  required
                  value={formData.price_per_day}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>

              <div className="stack" style={{ gap: '8px' }}>
                <label className="eyebrow">
                  <MapPin size={14} />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            </div>

            <div className="stack" style={{ gap: '8px' }}>
              <label className="eyebrow">
                <FileImage size={14} />
                Images
              </label>
              <label className="surface-card" style={{ padding: '20px', borderRadius: '22px', borderStyle: 'dashed' }}>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <div className="stack" style={{ alignItems: 'center', textAlign: 'center' }}>
                  <Plus size={40} color="var(--accent)" />
                  <strong>Upload product photos</strong>
                  <span className="qna-note">The first image becomes the primary card image.</span>
                  <span className="badge badge-success">{images.length || 0} selected</span>
                </div>
              </label>
            </div>

            <div className="stack" style={{ gap: '8px' }}>
              <label className="eyebrow">Description</label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="field-textarea"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              Add appliance
            </button>
          </form>
        </section>

        <aside className="stack-lg">
          <section className="surface-card" style={{ padding: '24px' }}>
            <div className="eyebrow">
              <Sparkles size={14} />
              Listing tips
            </div>
            <div className="benefit-list" style={{ marginTop: '14px' }}>
              <div className="benefit-item">Add clean, bright images.</div>
              <div className="benefit-item">Use a clear category label.</div>
              <div className="benefit-item">Set a market-friendly daily rate.</div>
              <div className="benefit-item">Include location-specific notes.</div>
            </div>
          </section>

          <section className="surface-card" style={{ padding: '24px' }}>
            <div className="eyebrow">
              <FileImage size={14} />
              Image preview
            </div>
            {previewUrls.length > 0 ? (
              <div className="grid-2" style={{ marginTop: '14px' }}>
                {previewUrls.map((url) => (
                  <div key={url} className="gallery-thumb" style={{ width: '100%', height: '160px' }}>
                    <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="qna-note" style={{ marginTop: '12px' }}>
                No image selected yet. Upload at least one item photo for a stronger listing card.
              </p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Package, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function CategoryLanding() {
  const { name } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryMap = {
    'furniture': { title: 'Designer Furniture', subtitle: 'Elevate your space with premium, curated furniture pieces.', icon: <Package size={32} /> },
    'appliances': { title: 'Smart Appliances', subtitle: 'The latest home technology, delivered and installed.', icon: <Sparkles size={32} /> },
    'packages': { title: 'Complete Room Packages', subtitle: 'Rent an entire room in one click. Fully styled.', icon: <ShieldCheck size={32} /> },
  };

  const meta = categoryMap[name] || { title: 'Catalog', subtitle: 'Browse our collection' };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [name]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('appliances/', { params: { limit: 50 } });
      const rawList = res.data.results || res.data || [];
      const list = Array.isArray(rawList) ? rawList : [];

      let filtered = list;
      if (name === 'furniture') {
        filtered = list.filter(i => {
          const cat = (i.category || '').toLowerCase();
          return cat.includes('furniture') || cat.includes('chair') || cat.includes('sofa') || cat.includes('bed') || cat.includes('dining') || cat.includes('desk') || cat.includes('storage') || cat.includes('workstation');
        });
      } else if (name === 'appliances') {
        filtered = list.filter(i => {
          const cat = (i.category || '').toLowerCase();
          return cat.includes('appliance') || cat.includes('ac') || cat.includes('tv') || cat.includes('refrigerator') || cat.includes('washing') || cat.includes('microwave') || cat.includes('purifier');
        });
      } else if (name === 'packages') {
        filtered = list.slice(0, 6);
      }
      
      setItems(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingBottom: '6rem' }}>
      <div style={{ background: 'var(--rv-color-background)', padding: '6rem 2rem', textAlign: 'center', marginBottom: '4rem', borderBottom: '1px solid var(--rv-color-border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: '#fff', borderRadius: '50%', boxShadow: 'var(--rv-shadow-float)', color: 'var(--rv-color-primary)', marginBottom: '1.5rem' }}>
            {meta.icon}
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: 'var(--rv-font-display)', marginBottom: '1rem' }}>{meta.title}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--rv-color-secondary)' }}>{meta.subtitle}</p>
        </div>
      </div>

      <div className="rv-shell">
        {name === 'packages' && (
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div style={{ minWidth: '300px', padding: '2rem', background: '#10b98110', border: '1px solid #10b981', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>1 BHK Setup</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)', marginBottom: '1rem' }}>Bed, mattress, wardrobe, and fridge.</p>
              <strong style={{ fontSize: '1.5rem' }}>₹2,499/mo</strong>
            </div>
            <div style={{ minWidth: '300px', padding: '2rem', background: '#3b82f610', border: '1px solid #3b82f6', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '0.5rem' }}>Work from Home</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rv-color-secondary)', marginBottom: '1rem' }}>Ergo chair, desk, and monitor.</p>
              <strong style={{ fontSize: '1.5rem' }}>₹999/mo</strong>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <span className="rv-section-label">{items.length} items available</span>
          <select className="rv-input" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            <option>Sort by: Popular</option>
            <option>Sort by: Price (Low to High)</option>
            <option>Sort by: Delivery Time</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading items...</div>
        ) : (
          <div className="rv-appliance-grid">
            {items.map(appliance => (
              <ProductCard key={appliance.id} appliance={appliance} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

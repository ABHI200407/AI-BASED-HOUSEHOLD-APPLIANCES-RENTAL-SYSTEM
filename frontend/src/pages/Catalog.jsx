import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Armchair,
  Bed,
  Droplets,
  Grid,
  MapPin,
  PackageSearch,
  Search,
  Snowflake,
  Sparkles,
  Star,
  Tv,
  Wind,
  Zap,
  Bot,
  X,
} from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { featuredProducts } from '../data/experience';

export default function Catalog() {
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [appliances, setAppliances] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [financialModel, setFinancialModel] = useState('rent');

  useEffect(() => {
    setPage(1);
  }, [category, sortBy]);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search');
    if (q !== null && q !== search) {
      setSearch(q);
    }
  }, [location.search]);

  useEffect(() => {
    fetchAppliances(page === 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, sortBy, search]);

  useEffect(() => {
    fetchCategories();
    if (user) {
      fetchRecommended();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('appliances/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const fetchRecommended = async () => {
    setIsLoadingRecs(true);
    try {
      const res = await api.get(`recommend/${user.id}/`);
      setRecommended(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const fetchAppliances = async (reset = false, targetPage = page) => {
    if (reset) setIsLoadingApps(true);
    try {
      const res = await api.get('appliances/', {
        params: { category, search, page: targetPage, limit: 20 },
      });

      const data = [...(res.data.results || [])];

      if (sortBy === 'price_asc') {
        data.sort((a, b) => parseFloat(a.price_per_day) - parseFloat(b.price_per_day));
      } else if (sortBy === 'price_desc') {
        data.sort((a, b) => parseFloat(b.price_per_day) - parseFloat(a.price_per_day));
      }

      if (reset) {
        setAppliances(data);
      } else {
        setAppliances((prev) => [...prev, ...data]);
      }

      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.warn('Backend API failed, falling back to local featuredProducts:', err);
      // Fallback to local data
      let mockData = featuredProducts.map(fp => ({
        id: fp.id,
        name: fp.name,
        category: fp.category,
        price_per_day: fp.price / 30,
        monthly_rent: fp.price,
        available: true,
        image: fp.image,
        images: [fp.image]
      }));

      if (category) {
        mockData = mockData.filter(item => item.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        mockData = mockData.filter(item => item.name.toLowerCase().includes(s) || item.category.toLowerCase().includes(s));
      }

      if (sortBy === 'price_asc') {
        mockData.sort((a, b) => a.price_per_day - b.price_per_day);
      } else if (sortBy === 'price_desc') {
        mockData.sort((a, b) => b.price_per_day - a.price_per_day);
      }

      if (reset) {
        setAppliances(mockData);
      } else {
        setAppliances((prev) => [...prev, ...mockData]);
      }
      setTotalPages(1);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const hardcodedIcons = {
    AC: Wind,
    Refrigerator: Snowflake,
    'Washing Machine': Droplets,
    Microwave: Zap,
    TV: Tv,
    Sofa: Armchair,
    Bed,
  };

  // Convert raw API response into ProductCard format
  const formatForCard = (item) => {
    const defaultImage = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
    let img = defaultImage;
    if (item.images && item.images.length > 0) {
      const src = item.images[0];
      if (src.startsWith('http') || src.startsWith('/downloaded_images')) {
        img = src;
      } else {
        img = `http://localhost:8000${src}`;
      }
    }
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      price: Math.round((item.price_per_day || 0) * 30) || item.monthly_rent || 0,
      tenure: 'from 3 months',
      rating: '4.8',
      badge: item.available ? 'Available' : 'Booked',
      image: img,
      rawItem: item, // for addToCart if needed, but ProductCard maps it back via asCartItem
    };
  };

  return (
    <main className="rv-shell" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>

      <div className="rv-section-heading" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="rv-section-label"><PackageSearch size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Browse Catalog</span>
          <h2>Explore the full marketplace.</h2>
        </div>
      </div>

      <div className="rv-split-layout" style={{ gridTemplateColumns: '280px 1fr' }}>
        <aside style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--rv-radius-lg)', border: '1px solid var(--rv-color-border)', alignSelf: 'start', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Filters</h3>

          <div style={{ marginBottom: '2rem' }}>
            <span className="rv-section-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rv-input"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--rv-color-border)', fontSize: '0.875rem' }}
            >
              <option value="popularity">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <span className="rv-section-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Category</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="radio" name="category" checked={category === ''} onChange={() => setCategory('')} /> All Items
              </label>
              {categories.map((cat) => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} /> {cat}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <span className="rv-section-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Monthly Rent</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="number" placeholder="Min" className="rv-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rv-color-border)' }} />
              <span style={{ color: 'var(--rv-color-secondary)' }}>-</span>
              <input type="number" placeholder="Max" className="rv-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rv-color-border)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <span className="rv-section-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Material</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Solid Wood', 'Engineered Wood', 'Fabric', 'Metal'].map((mat) => (
                <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" /> {mat}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" /> In Stock Only
            </label>
          </div>
        </aside>

        <section>

          <div style={{ display: 'flex', background: 'var(--rv-color-background)', padding: '0.25rem', borderRadius: '12px', marginBottom: '2rem', width: 'fit-content' }}>
            <button
              onClick={() => setFinancialModel('rent')}
              style={{ padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'var(--rv-transition)', background: financialModel === 'rent' ? '#fff' : 'transparent', color: financialModel === 'rent' ? 'var(--rv-color-primary)' : 'var(--rv-color-secondary)', boxShadow: financialModel === 'rent' ? 'var(--rv-shadow-float)' : 'none' }}
            >
              Rent
            </button>
            <button
              onClick={() => setFinancialModel('subscribe')}
              style={{ padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'var(--rv-transition)', background: financialModel === 'subscribe' ? '#fff' : 'transparent', color: financialModel === 'subscribe' ? 'var(--rv-color-primary)' : 'var(--rv-color-secondary)', boxShadow: financialModel === 'subscribe' ? 'var(--rv-shadow-float)' : 'none' }}
            >
              Subscribe
            </button>
            <button
              onClick={() => setFinancialModel('buy')}
              style={{ padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'var(--rv-transition)', background: financialModel === 'buy' ? '#fff' : 'transparent', color: financialModel === 'buy' ? 'var(--rv-color-primary)' : 'var(--rv-color-secondary)', boxShadow: financialModel === 'buy' ? 'var(--rv-shadow-float)' : 'none' }}
            >
              Buy
            </button>
          </div>



          {(category || search) && (
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {category && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', background: 'var(--rv-color-border)', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 500 }}>
                  Category: {category}
                  <X size={14} style={{ cursor: 'pointer', marginLeft: '0.25rem' }} onClick={() => setCategory('')} />
                </span>
              )}
              {search && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', background: 'var(--rv-color-border)', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 500 }}>
                  Search: "{search}"
                  <X size={14} style={{ cursor: 'pointer', marginLeft: '0.25rem' }} onClick={() => { setSearch(''); navigate('/catalog'); }} />
                </span>
              )}
            </div>
          )}

          {isLoadingApps ? (
            <div className="rv-product-rail" style={{ opacity: 0.5 }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} style={{ height: '360px', background: 'var(--rv-color-border)', borderRadius: '12px' }} />
              ))}
            </div>
          ) : appliances.length > 0 ? (
            <div>
              <div style={{ marginBottom: '1.5rem', color: 'var(--rv-color-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                Showing {appliances.length} result{appliances.length !== 1 ? 's' : ''}
              </div>
              <div className="rv-product-rail">
                {appliances.map((item) => (
                  <ProductCard key={item.id} product={formatForCard(item)} financialModel={financialModel} />
                ))}
              </div>

              {page < totalPages && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                  <button onClick={() => setPage((value) => value + 1)} className="rv-button rv-button--light">
                    Load more items
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: 'var(--rv-radius-lg)', border: '1px solid var(--rv-color-border)', boxShadow: 'var(--rv-shadow-sm)' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>We couldn't find any matches.</h3>
              <p style={{ color: 'var(--rv-color-secondary)', maxWidth: '400px', margin: '0 auto 2rem', fontSize: '1.125rem' }}>
                It looks like your current filters might be too strict. You can clear them to see all items, or try browsing our popular categories.
              </p>
              <button onClick={() => { setSearch(''); setCategory(''); navigate('/catalog'); }} className="rv-button rv-button--signal" style={{ marginBottom: '3rem', padding: '1rem 2rem', fontSize: '1rem' }}>
                Clear All Filters
              </button>

              {categories.length > 0 && (
                <div style={{ borderTop: '1px solid var(--rv-color-border)', paddingTop: '3rem' }}>
                  <p style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--rv-color-secondary)' }}>Or browse our most popular categories:</p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {categories.slice(0, 4).map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSearch(''); setCategory(cat); }}
                        className="rv-button rv-button--light"
                        style={{ padding: '0.75rem 1.5rem' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </section>
      </div>

      {!user && (
        <div className="rv-move-planner" style={{ marginTop: '6rem', textAlign: 'center' }}>
          <h3>Get the full experience</h3>
          <p style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>Create an account to manage bookings, track installations, and unlock personalized recommendations.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="rv-button rv-button--signal">Unlock full access</Link>
            <Link to="/login" className="rv-button rv-button--light">Log in to manage bookings</Link>
          </div>
        </div>
      )}
    </main>
  );
}

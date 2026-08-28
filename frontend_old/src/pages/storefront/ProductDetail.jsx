import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { fetchAppliance } from '../../utils/api';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState('monthly'); // daily, weekly, monthly

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAppliance(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center text-indigo-600 bg-slate-50">
        <div className="animate-pulse flex gap-2"><div className="w-4 h-4 rounded-full bg-indigo-500"></div><div className="w-4 h-4 rounded-full bg-purple-500"></div><div className="w-4 h-4 rounded-full bg-pink-500"></div></div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen pt-32 text-center text-2xl font-bold bg-slate-50">Product not found.</div>;
  }

  const getPrice = () => {
    if (plan === 'daily') return product.daily_rent;
    if (plan === 'weekly') return product.weekly_rent;
    return product.monthly_rent;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left: Image Viewer */}
          <div className="relative">
            <div className="sticky top-28 rounded-3xl overflow-hidden glass-panel p-2 shadow-xl bg-white/40">
              <img 
                src={product.image_url || "/images/hero-banner.jpg"} 
                alt={product.name}
                className="w-full h-[500px] lg:h-[700px] object-cover rounded-2xl"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg font-bold shadow-sm text-sm">
                {product.brand}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="py-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.status === 'available' ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                <Star size={16} className="text-yellow-500 fill-yellow-500" /> {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {product.name}
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Pricing Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
              <h3 className="font-bold text-lg mb-4">Select Rental Plan</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['daily', 'weekly', 'monthly'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPlan(p)}
                    className={`py-3 px-4 rounded-xl border-2 font-bold text-sm capitalize transition-all ${
                      plan === p 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-100 hover:border-slate-300 text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-slate-100">
                <div>
                  <div className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Total {plan} Rent</div>
                  <span className="text-4xl font-extrabold text-slate-900">₹{getPrice()}</span>
                  <span className="text-slate-500 font-medium">/{plan === 'daily' ? 'day' : plan === 'weekly' ? 'week' : 'mo'}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Refundable Deposit</div>
                  <div className="text-xl font-bold text-slate-700">₹{product.deposit}</div>
                </div>
              </div>

              <button 
                onClick={() => addToCart(product, plan)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all transform hover:scale-[1.02]"
              >
                Rent Now
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-800">
                <CheckCircle2 size={24} className="text-emerald-500" />
                <span className="font-medium">Free delivery within 72 hours</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-800">
                <Shield size={24} className="text-blue-500" />
                <span className="font-medium">Free maintenance & relocation</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 text-purple-800">
                <Clock size={24} className="text-purple-500" />
                <span className="font-medium">Flexible upgrades anytime</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

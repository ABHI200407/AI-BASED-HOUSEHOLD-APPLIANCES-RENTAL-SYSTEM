import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, Zap, Shield, Clock, ShoppingBag, ShoppingCart, MapPin, Menu } from 'lucide-react';
import { fetchCategories, fetchAppliances } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import SearchModal from '../../components/SearchModal';
import MegaMenu from '../../components/MegaMenu';
import MobileMenu from '../../components/MobileMenu';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, cartItems, addToCart } = useCart();
  const { location, setIsLocationModalOpen } = useLocation();

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, products] = await Promise.all([
          fetchCategories(),
          fetchAppliances()
        ]);
        setCategories(cats);
        // Show max 8 products as featured
        setFeaturedProducts(products.slice(0, 8));
      } catch (error) {
        console.error("Failed to load storefront data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900 selection:bg-indigo-500/30">
      
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Navbar (Glassmorphism) */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl hidden sm:flex">
                C
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">Novorent</span>
            </div>
            
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
            >
              <MapPin size={16} className="text-teal-600" /> 
              {location.pincode ? location.pincode : location.city}
            </button>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <MegaMenu />
            <a href="#" className="font-bold text-slate-700 hover:text-teal-600 transition-colors">BUY</a>
            <a href="#" className="font-bold text-slate-700 hover:text-teal-600 transition-colors">UNLMTD</a>
            <a href="#" className="font-bold text-slate-700 hover:text-teal-600 transition-colors">B2B</a>
            <button onClick={() => window.location.href = '/admin'} className="text-slate-600 hover:text-slate-900 transition-colors">Admin Dashboard</button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="glass-pill px-4 py-2 text-sm hover:bg-black/5 transition-all flex md:flex items-center gap-2">
              <Search size={16} /> <span className="hidden md:block">Search</span>
            </button>
            <button onClick={toggleCart} className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center -translate-y-1 translate-x-1 shadow-sm">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button onClick={() => window.location.href = '/login'} className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.1)]">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6">
        {/* Decorative background glow */}
        <div className="absolute top-20 left-1/4 w-64 h-64 md:w-[500px] md:h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-[400px] md:h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-indigo-700 text-sm font-semibold">
              <SparklesIcon /> Premium Furniture Rental
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Design Your <br />
                <span className="text-gradient">Dream Space</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
              Rent premium, handcrafted furniture and state-of-the-art appliances. Upgrade your lifestyle without the commitment of buying.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex gap-4">
              <button 
                onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2 hover:scale-105"
              >
                Explore Collection <ArrowRight size={20} />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="pt-8 grid grid-cols-3 gap-4 border-t border-black/5">
              <div>
                <div className="text-xl md:text-2xl font-bold text-slate-900">50K+</div>
                <div className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wider">Happy Homes</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-slate-900">72Hr</div>
                <div className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wider">Free Delivery</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-slate-900">4.9/5</div>
                <div className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                  Reviews <Star size={12} className="text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image / Composition */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-10 lg:mt-0"
          >
            {/* Main Hero Image */}
            <div className="relative rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent z-10 pointer-events-none" />
              <img 
                src="/images/hero-banner.jpg" 
                alt="Modern Living Room" 
                className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover rounded-2xl opacity-95"
              />
              
              {/* Floating Glass Badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-4 left-4 lg:top-10 lg:-left-6 glass-panel px-3 py-2 lg:px-4 lg:py-3 rounded-2xl flex items-center gap-2 lg:gap-3 z-20"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Shield size={16} />
                </div>
                <div>
                  <div className="text-xs lg:text-sm font-bold text-slate-900">Free Maintenance</div>
                  <div className="text-[10px] lg:text-xs text-slate-500">Included in plan</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-4 right-4 lg:bottom-20 lg:-right-6 glass-panel px-3 py-2 lg:px-4 lg:py-3 rounded-2xl flex items-center gap-2 lg:gap-3 z-20"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-xs lg:text-sm font-bold text-slate-900">Instant Upgrade</div>
                  <div className="text-[10px] lg:text-xs text-slate-500">Swap anytime</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Categories Grid */}
      <section id="categories" className="py-20 border-t border-black/5 relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
              <p className="text-slate-600">Everything you need to complete your home.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12"><div className="animate-pulse flex gap-2"><div className="w-4 h-4 rounded-full bg-indigo-500"></div><div className="w-4 h-4 rounded-full bg-purple-500"></div><div className="w-4 h-4 rounded-full bg-pink-500"></div></div></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <motion.div 
                  key={cat.id || i}
                  onClick={() => window.location.href = `/category/${cat.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 6) * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer group"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon || "📦"}</div>
                  <div className="font-medium text-sm text-center">{cat.name}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-black/5 border-t border-black/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-slate-600">Premium appliances available to rent right now.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {!loading && featuredProducts.map((product, i) => (
              <motion.div 
                key={product.id || i}
                onClick={() => window.location.href = `/product/${product.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 4) * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_rgba(31,38,135,0.15)] transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  {/* Fallback image logic if missing */}
                  <img src={product.image_url || "/images/hero-banner.jpg"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                    {product.brand}
                  </div>
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                    <Star size={10} className="fill-white" /> {product.rating || '4.5'}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-black/10 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-indigo-700">₹{product.monthly_rent}</span>
                      <span className="text-slate-500 text-xs"> /mo</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product, 'monthly'); }}
                      className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20L12 14L18 12L12 10L10 4L8 10L2 12L8 14L10 20Z" fill="currentColor" />
      <path d="M19 8L20 5L23 4L20 3L19 0L18 3L15 4L18 5L19 8Z" fill="currentColor" />
      <path d="M19 24L20 21L23 20L20 19L19 16L18 19L15 20L18 21L19 24Z" fill="currentColor" />
    </svg>
  );
}

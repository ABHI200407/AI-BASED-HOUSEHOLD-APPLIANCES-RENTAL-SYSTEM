import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Truck, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAppliances, fetchCategories } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';

export default function CategoryView() {
  const { categoryId } = useParams();
  const { addToCart } = useCart();
  const { location } = useLocation();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('Category');
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let queryId = categoryId;
        
        if (categoryId === 'all') {
          setCategoryName('All Products');
        } else if (isNaN(categoryId)) {
          const cats = await fetchCategories();
          const found = cats.find(c => c.name.toLowerCase() === categoryId.toLowerCase());
          if (found) {
            queryId = found.id;
            setCategoryName(found.name);
          } else {
            setCategoryName(categoryId);
          }
        } else {
          const cats = await fetchCategories();
          const found = cats.find(c => c.id.toString() === categoryId);
          if (found) setCategoryName(found.name);
        }

        let minPrice = '';
        let maxPrice = '';
        if (priceRange === 'under500') maxPrice = '500';
        if (priceRange === '501-1000') { minPrice = '501'; maxPrice = '1000'; }
        if (priceRange === '1001-1500') { minPrice = '1001'; maxPrice = '1500'; }
        if (priceRange === 'over1500') minPrice = '1500';

        const params = {};
        if (queryId !== 'all') params.category = queryId;
        if (sort) params.sort = sort;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const data = await fetchAppliances(params);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load category products", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId, sort, priceRange]);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const deliveryStr = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 text-slate-900 capitalize font-serif">{categoryName}</h1>
              <p className="text-slate-600">Showing premium items available in {location.city}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm shadow-sm"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <div className="relative">
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer shadow-sm"
                >
                  <option value="">Sort by Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-28">
              <div className="flex items-center gap-2 font-extrabold text-lg mb-6 pb-4 border-b border-slate-100">
                <SlidersHorizontal size={20} className="text-teal-600" /> Filters
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" value="" checked={priceRange === ''} onChange={(e) => setPriceRange(e.target.value)} className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Any Price</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" value="under500" checked={priceRange === 'under500'} onChange={(e) => setPriceRange(e.target.value)} className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Under ₹500</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" value="501-1000" checked={priceRange === '501-1000'} onChange={(e) => setPriceRange(e.target.value)} className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">₹501 - ₹1000</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" value="1001-1500" checked={priceRange === '1001-1500'} onChange={(e) => setPriceRange(e.target.value)} className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">₹1001 - ₹1500</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" value="over1500" checked={priceRange === 'over1500'} onChange={(e) => setPriceRange(e.target.value)} className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Over ₹1500</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200/50 cursor-pointer hover:bg-amber-100 transition-colors">Best Seller</span>
                  <span className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200/50 cursor-pointer hover:bg-rose-100 transition-colors">Price Drop</span>
                  <span className="px-3 py-1.5 bg-sky-50 text-sky-700 text-xs font-bold rounded-lg border border-sky-200/50 cursor-pointer hover:bg-sky-100 transition-colors">Z Rated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-4 h-96 animate-pulse">
                    <div className="w-full h-48 bg-slate-100 rounded-2xl mb-4"></div>
                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <div className="text-6xl mb-4">🏜️</div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
                <button onClick={() => {setPriceRange(''); setSort('');}} className="mt-6 text-teal-600 font-bold hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <motion.div 
                    key={product.id || i}
                    onClick={() => window.location.href = `/product/${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 6) * 0.05 }}
                    className="group bg-white rounded-3xl p-4 border border-black/5 hover:border-black/10 hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                      )}
                      
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {product.rating}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] font-bold text-slate-700 flex items-center gap-2 shadow-sm border border-white/50">
                          <Truck size={14} className="text-teal-600" />
                          Delivery by {deliveryStr}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="text-xs font-bold text-slate-400 mb-1 tracking-wider uppercase">{product.brand}</div>
                      <h3 className="font-extrabold text-lg text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">{product.name}</h3>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xl font-extrabold text-slate-900">₹{product.monthly_rent}</span>
                          <span className="text-slate-500 text-xs font-medium"> /mo</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product, 'monthly'); }}
                          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-teal-600 group-hover:text-white transition-colors border border-slate-200 group-hover:border-teal-600 shadow-sm"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Search, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAppliances } from '../utils/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchAppliances({ search: query });
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] p-4 flex justify-center items-start pt-[10vh]"
        >
          <div className="absolute inset-0" onClick={onClose} />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[80vh]"
          >
            {/* Search Input */}
            <div className="flex items-center px-6 py-4 border-b border-slate-100 bg-white">
              <Search className="text-indigo-500 mr-4" size={24} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search premium furniture and appliances..."
                className="flex-1 bg-transparent text-xl outline-none text-slate-800 placeholder-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse flex gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><div className="w-3 h-3 rounded-full bg-purple-500"></div><div className="w-3 h-3 rounded-full bg-pink-500"></div></div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-4">
                    {results.length} Results Found
                  </div>
                  {results.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => window.location.href = `/product/${product.id}`}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <img src={product.image_url || "/images/hero-banner.jpg"} alt={product.name} className="w-16 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-slate-500">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-indigo-700">₹{product.monthly_rent}/mo</div>
                        <div className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1"><Star size={10} className="fill-slate-400"/> {product.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.length > 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p>Type to start searching...</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Navigation, Phone, MapPin, HelpCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">C</div>
                Novorent
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <Link to="/login" onClick={onClose} className="flex items-center gap-4 p-4 bg-teal-50 rounded-2xl mb-8 group hover:bg-teal-100 transition-colors border border-teal-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <div>
                  <div className="font-extrabold text-teal-900">Hello! User</div>
                  <div className="text-sm font-semibold text-teal-700">Login / Signup</div>
                </div>
              </Link>

              <div className="space-y-1">
                <Link to="/" onClick={onClose} className="flex items-center gap-4 p-4 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors">
                  <Navigation size={20} className="text-slate-400" /> Browse Catalog
                </Link>
                <button className="w-full flex items-center gap-4 p-4 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors">
                  <FileText size={20} className="text-slate-400" /> Track Product Issue Request
                </button>
                <button className="w-full flex items-center gap-4 p-4 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors">
                  <Phone size={20} className="text-slate-400" /> Contact Us
                </button>
                <button className="w-full flex items-center gap-4 p-4 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors">
                  <MapPin size={20} className="text-slate-400" /> Find Store
                </button>
                <button className="w-full flex items-center gap-4 p-4 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors">
                  <HelpCircle size={20} className="text-slate-400" /> Help Centre
                </button>
              </div>
            </div>

            <div className="p-6 mt-auto border-t border-slate-100">
              <div className="text-xs text-center text-slate-400 font-medium uppercase tracking-widest">
                Trusted by 50,000+ Indians
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

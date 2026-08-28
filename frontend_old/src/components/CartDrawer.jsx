import { X, Trash2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart } = useCart();

  const totalMonthly = cartItems.reduce((acc, item) => {
    if (item.plan === 'daily') return acc + parseFloat(item.product.daily_rent);
    if (item.plan === 'weekly') return acc + parseFloat(item.product.weekly_rent);
    return acc + parseFloat(item.product.monthly_rent);
  }, 0);

  const totalDeposit = cartItems.reduce((acc, item) => acc + parseFloat(item.product.deposit), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-extrabold text-slate-900">Your Rentals</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">
                  <div className="text-6xl mb-4">🛒</div>
                  <p>Your rental cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 border border-slate-100 rounded-2xl bg-white shadow-sm group">
                    <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl bg-slate-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-500 mb-2 capitalize">{item.plan} Plan</p>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-indigo-600">₹{
                          item.plan === 'daily' ? item.product.daily_rent :
                          item.plan === 'weekly' ? item.product.weekly_rent : item.product.monthly_rent
                        }</div>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-slate-50">
                <div className="flex justify-between text-sm mb-2 text-slate-600">
                  <span>Total Rental Price</span>
                  <span className="font-bold text-slate-900">₹{totalMonthly.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4 text-slate-600">
                  <span>Refundable Deposit</span>
                  <span className="font-bold text-slate-900">₹{totalDeposit.toFixed(2)}</span>
                </div>
                
                <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl flex items-start gap-2 text-xs font-medium mb-4">
                  <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <p>Deposit is fully refundable at the end of your tenure if items are returned in good condition.</p>
                </div>

                <button 
                  onClick={() => { setIsCartOpen(false); window.location.href = '/checkout'; }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

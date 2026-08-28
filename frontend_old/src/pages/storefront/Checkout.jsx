import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalMonthly = cartItems.reduce((acc, item) => acc + (item.plan === 'daily' ? parseFloat(item.product.daily_rent) : item.plan === 'weekly' ? parseFloat(item.product.weekly_rent) : parseFloat(item.product.monthly_rent)), 0);
  const totalDeposit = cartItems.reduce((acc, item) => acc + parseFloat(item.product.deposit), 0);
  const grandTotal = totalMonthly + totalDeposit;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Store
        </Link>
        
        <h1 className="text-4xl font-extrabold mb-8 text-slate-900">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Form Area */}
          <div className="lg:col-span-2">
            
            {/* Steps Indicator */}
            <div className="flex items-center mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {step > s ? <CheckCircle2 size={16} /> : s}
                  </div>
                  {s !== 3 && <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleCheckout} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
                      <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
                      <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                    <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                      <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Zip Code</label>
                      <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center gap-3 p-4 border border-indigo-600 rounded-xl bg-indigo-50 cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                      <span className="font-bold text-indigo-900">Credit / Debit Card</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer">
                      <input type="radio" name="payment" className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                      <span className="font-bold text-slate-700">PayPal</span>
                    </label>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Card Number</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">CVV</label>
                      <input required type="text" placeholder="123" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-8">
                  <div className="text-5xl mb-4">📜</div>
                  <h2 className="text-2xl font-bold mb-2">Review & Confirm</h2>
                  <p className="text-slate-600 mb-8">Please review your order details before final confirmation.</p>
                  <div className="bg-slate-50 p-6 rounded-2xl text-left">
                    <h3 className="font-bold mb-4">Terms of Rental</h3>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                      <li>Minimum rental tenure must be completed.</li>
                      <li>Security deposit is 100% refundable.</li>
                      <li>Free maintenance covers normal wear and tear.</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              <div className="mt-8 flex justify-end">
                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-70">
                  {loading ? 'Processing...' : step === 3 ? 'Confirm Order' : 'Continue'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-sm text-slate-900 line-clamp-1">{item.product.name}</div>
                      <div className="text-xs text-slate-500 capitalize">{item.plan} plan</div>
                    </div>
                    <div className="font-bold text-slate-900">
                      ₹{item.plan === 'daily' ? item.product.daily_rent : item.plan === 'weekly' ? item.product.weekly_rent : item.product.monthly_rent}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>First Month Rent</span>
                  <span className="font-bold text-slate-900">₹{totalMonthly.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Refundable Deposit</span>
                  <span className="font-bold text-slate-900">₹{totalDeposit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery & Installation</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
                <span className="font-bold text-slate-900 text-lg">Total Due</span>
                <span className="font-extrabold text-indigo-700 text-2xl">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

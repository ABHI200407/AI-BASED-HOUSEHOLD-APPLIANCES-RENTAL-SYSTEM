import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MapPin, Building2, Landmark, Tent, Castle, Briefcase, Coffee, Train } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export default function LocationModal() {
  const { location, setLocation, isLocationModalOpen, setIsLocationModalOpen } = useLocation();
  const [inputPincode, setInputPincode] = useState('');

  const topCities = [
    { name: 'Bengaluru', icon: <Building2 size={24} /> },
    { name: 'Mumbai', icon: <Landmark size={24} /> },
    { name: 'Hyderabad', icon: <Castle size={24} /> },
    { name: 'Pune', icon: <Briefcase size={24} /> },
    { name: 'Delhi', icon: <Tent size={24} /> },
    { name: 'Gurugram', icon: <Coffee size={24} /> },
    { name: 'Noida', icon: <Train size={24} /> },
    { name: 'Chennai', icon: <MapPin size={24} /> },
  ];

  const otherCities = [
    'Kolkata', 'Jaipur', 'Chandigarh', 'Ahmedabad', 'Indore', 
    'Lucknow', 'Coimbatore', 'Kochi', 'Bhopal', 'Vadodara'
  ];

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (inputPincode.length === 6) {
      setLocation({ city: 'Custom Location', pincode: inputPincode });
      setIsLocationModalOpen(false);
    }
  };

  const handleCitySelect = (city) => {
    setLocation({ city, pincode: '' });
    setIsLocationModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
          >
            <button 
              onClick={() => setIsLocationModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors p-2"
            >
              <X size={24} />
            </button>

            <div className="p-8 sm:p-12 text-center max-h-[85vh] overflow-y-auto">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8 font-serif">Select Delivery Location</h2>
              
              <form onSubmit={handlePincodeSubmit} className="relative max-w-md mx-auto mb-4">
                <input 
                  type="text" 
                  maxLength={6}
                  value={inputPincode}
                  onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter your pincode"
                  className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-teal-500 text-lg focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all text-center placeholder-slate-400"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <ArrowRight size={24} />
                </button>
              </form>
              
              {location.pincode && (
                <p className="text-sm text-slate-500 mb-10">Currently selected pincode : <strong className="text-slate-900">{location.pincode}</strong></p>
              )}

              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px bg-slate-200 flex-1 max-w-[100px]"></div>
                <span className="text-slate-600 font-serif text-xl">Or select your city</span>
                <div className="h-px bg-slate-200 flex-1 max-w-[100px]"></div>
              </div>

              <div className="grid grid-cols-4 gap-4 sm:gap-6 mb-12">
                {topCities.map((c) => (
                  <button 
                    key={c.name}
                    onClick={() => handleCitySelect(c.name)}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100/50 rounded-2xl flex items-center justify-center text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors border border-teal-200/50">
                      {c.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-teal-700 transition-colors">{c.name}</span>
                  </button>
                ))}
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-8 font-serif">Other Cities</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 text-center">
                {otherCities.map(city => (
                  <button 
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="text-slate-700 font-medium hover:text-teal-600 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

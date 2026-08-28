import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState({
    city: 'Bengaluru',
    pincode: '560068'
  });
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Persist location
  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userLocation', JSON.stringify(location));
  }, [location]);

  return (
    <LocationContext.Provider value={{ 
      location, 
      setLocation, 
      isLocationModalOpen, 
      setIsLocationModalOpen 
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

import React, { createContext, useState, useEffect } from 'react';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [city, setCity] = useState('Bengaluru');

    useEffect(() => {
        const storedCity = localStorage.getItem('rentova_city');
        if (storedCity) {
            setCity(storedCity);
        }
    }, []);

    const changeCity = (newCity) => {
        setCity(newCity);
        localStorage.setItem('rentova_city', newCity);
    };

    return (
        <CityContext.Provider value={{ city, changeCity }}>
            {children}
        </CityContext.Provider>
    );
};

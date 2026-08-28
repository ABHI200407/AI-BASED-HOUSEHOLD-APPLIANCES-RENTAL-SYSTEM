import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart JSON from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (appliance, options = { tenure: 3, purchaseModel: 'rent' }) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === appliance.id);
            if (existing) {
                return prev.map(item => 
                    item.id === appliance.id ? { ...item, ...options } : item
                );
            }
            return [...prev, { ...appliance, ...options }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateCartItem = (id, options) => {
        setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, ...options } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateCartItem,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { LocationProvider } from './context/LocationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocationProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </LocationProvider>
  </StrictMode>,
)

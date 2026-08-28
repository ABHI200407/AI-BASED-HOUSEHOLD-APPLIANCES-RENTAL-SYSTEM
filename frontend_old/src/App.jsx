import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/storefront/Home';
import ProductDetail from './pages/storefront/ProductDetail';
import CategoryView from './pages/storefront/CategoryView';
import Checkout from './pages/storefront/Checkout';
import CustomerDashboard from './pages/storefront/CustomerDashboard';
import Login from './pages/auth/Login';
import CartDrawer from './components/CartDrawer';
import LocationModal from './components/LocationModal';
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <>
      <LocationModal />
      <CartDrawer />
      <Chatbot />
      <Routes>
        {/* Storefront Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categoryId" element={<CategoryView />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </>
  );
}

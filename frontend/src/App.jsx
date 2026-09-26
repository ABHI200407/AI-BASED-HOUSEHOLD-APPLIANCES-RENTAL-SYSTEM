import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CityProvider } from './context/CityContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import SiteFooter from './components/SiteFooter';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import LandingTour from './pages/LandingTour';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddAppliance from './pages/AddAppliance';
import ApplianceDetail from './pages/ApplianceDetail';
import TenantBookings from './pages/TenantBookings';
import OwnerBookings from './pages/OwnerBookings';
import Installations from './pages/Installations';
import RoomConfigurator from './pages/RoomConfigurator';
import InfiniteCanvas, { CanvasIsland } from './components/InfiniteCanvas';
import AIWorldCanvas from './components/AIWorldCanvas';
import CommandCenter from './components/CommandCenter';
import AIChatbot from './components/AIChatbot';
import AmbientOrbs from './components/AmbientOrbs';
import ScrollProgress from './components/ScrollProgress';
import Profile from './pages/Profile';
import ServiceRequests from './pages/ServiceRequests';
import CategoryLanding from './pages/CategoryLanding';
import MovePlanner from './pages/MovePlanner';
import Inspiration from './pages/Inspiration';
import Packages from './pages/Packages';
import Releases from './pages/Releases';
import Business from './pages/Business';

function AppShell() {
  const location = useLocation();
  const hideChrome = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {/* <AmbientOrbs /> */}
      <ScrollProgress />
      <CommandCenter />
      <AIChatbot />
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/tour" element={<LandingTour />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Home />} />
        <Route path="/move-planner" element={<MovePlanner />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/releases" element={<Releases />} />
        <Route path="/business" element={<Business />} />

        <Route
          path="/category/:name"
          element={<CategoryLanding />}
        />

        <Route
          path="/catalog"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <Catalog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <TenantBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service-requests"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <ServiceRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['tenant', 'owner', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appliance/:id"
          element={
            <ProtectedRoute allowedRoles={['tenant', 'owner', 'admin']}>
              <ApplianceDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/bookings"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/add-appliance"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <AddAppliance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/installations"
          element={
            <ProtectedRoute allowedRoles={['tenant', 'owner', 'admin']}>
              <Installations />
            </ProtectedRoute>
          }
        />

        <Route path="/room-configurator" element={<RoomConfigurator />} />

        <Route path="/spatial-view" element={
          <InfiniteCanvas>
            <CanvasIsland x={-600} y={0} title="Home" link="/">
              <p>Navigate back to the main dashboard.</p>
            </CanvasIsland>
            <CanvasIsland x={0} y={-300} title="Catalog" link="/catalog">
              <p>Browse our extensive appliance collection.</p>
            </CanvasIsland>
            <CanvasIsland x={600} y={100} title="My Bookings" link="/my-bookings">
              <p>Check the status of your current rentals.</p>
            </CanvasIsland>
            <CanvasIsland x={200} y={400} title="Room Configurator" link="/room-configurator">
              <p>Design your layout in 3D.</p>
            </CanvasIsland>
          </InfiniteCanvas>
        } />

        <Route path="/ai-workspace" element={<AIWorldCanvas />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideChrome && <SiteFooter />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CityProvider>
          <Router>
            <AppShell />
          </Router>
        </CityProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

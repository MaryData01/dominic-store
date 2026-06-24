import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';

// Layout & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import SetupBuilder from './pages/SetupBuilder';
import Assistant from './pages/Assistant';
import FAQ from './pages/FAQ';
import ShippingReturns from './pages/ShippingReturns';
import Warranty from './pages/Warranty';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hasStickyBottomBar = ['/build', '/assistant'].includes(location.pathname);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      
      <main className={!isAdminRoute ? "min-h-[calc(100vh-64px)]" : "min-h-screen"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/build" element={<SetupBuilder />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminRoute && <Footer hasStickyBottomBar={hasStickyBottomBar} />}
      <CartDrawer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1A26',
            color: '#F0F0FF',
            border: '1px solid #252535',
          },
          success: {
            iconTheme: {
              primary: '#00D4FF',
              secondary: '#1A1A26',
            },
          },
        }}
      />
    </>
  );
}

export default App;

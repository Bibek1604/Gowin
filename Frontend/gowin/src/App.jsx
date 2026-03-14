import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useAdminStore } from './components/Store/AdminStore';

import Sidebar from './components/admin/Sidebar';
import AddCategory from './components/admin/AddCategory';
import AddDetail from './components/admin/AddDetail';
import AddPlace from './components/admin/AddPlace';
import Dashboard from './components/admin/Dashboard';
import DestinationDetails from './components/Details/FetchDestinationDetails';
import NotFound from './components/Layout/Notfound';
import BookingForm from './components/Layout/Booking';
import Booking from './components/admin/AddBooking';
import AddTestimonial from './components/admin/AddTestimonial';
import Messages from './components/admin/Messages';
import Subscribers from './components/admin/Subscribers';
import Footer from './components/Tourism/Footer';
import Login from './components/Layout/Login';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Tourism/Navbar';
import TourismHome from './components/Tourism/TourismHome';
import About from './components/Tourism/About';
import Contact from './components/Tourism/Contact';
import AllDestinations from './components/Tourism/AllDestinations';
import PrivacyPolicy from './components/Tourism/PrivacyPolicy';
import RefundPolicy from './components/Tourism/RefundPolicy';
import TravelGuides from './components/Tourism/TravelGuides';
import ContactSupport from './components/Tourism/ContactSupport';
import TermsConditions from './components/Tourism/TermsConditions';
import colors from './theme/colors';
import ScrollToTop from './components/Layout/ScrollToTop';
import RouteScrollReset from './components/Layout/RouteScrollReset';

// Admin layout with sidebar
function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}

// App content with routes and conditional footer
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar on all pages except admin and login */}
      {!isAdminRoute && !isLoginRoute && <Navbar />}

      <Routes>
        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-category"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddCategory />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-booking"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Booking />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-place"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddPlace />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-detail"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddDetail />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddTestimonial />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Messages />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subscribers"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Subscribers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<TourismHome />} />
        <Route path="/places/:placeId" element={<DestinationDetails />} />
        <Route path="/details/all" element={<AllDestinations />} />
        <Route path="/details/:placeId" element={<DestinationDetails />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/guides" element={<TravelGuides />} />
        <Route path="/support" element={<ContactSupport />} />
        <Route path="/terms" element={<TermsConditions />} />

        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer only on non-admin pages */}
      {!isAdminRoute && <Footer />}
      <ScrollToTop />
      <RouteScrollReset />
    </div>
  );
}

// Main App component with Router wrapper
function App() {
  const initializeAuth = useAdminStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

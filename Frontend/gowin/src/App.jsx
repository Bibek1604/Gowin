import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAdminStore } from './components/Store/AdminStore';
import usePlaceStore from './components/Store/PlaceStore';
import useCategoryStore from './components/Store/CategoryStore';
import useSettingsStore from './components/Store/SettingsStore';

import Navbar from './components/Tourism/Navbar';
import Footer from './components/Tourism/Footer';
import TourismHome from './components/Tourism/TourismHome';
import AllDestinations from './components/Tourism/AllDestinations';
import DestinationDetails from './components/Details/DestinationDetails';
import Booking from './components/Layout/Booking';
import Contact from './components/Tourism/Contact';
import About from './components/Tourism/About';
import Services from './components/Tourism/Services';
import NotFound from './components/Layout/Notfound';
import ScrollToTop from './components/Layout/ScrollToTop';
import RouteScrollReset from './components/Layout/RouteScrollReset';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { PageSpinner } from './components/ui/Skeleton';

// Rarely visited pages and the whole admin panel are code-split.
const TravelGuides = lazy(() => import('./components/Tourism/TravelGuides'));
const ContactSupport = lazy(() => import('./components/Tourism/ContactSupport'));
const PrivacyPolicy = lazy(() => import('./components/Tourism/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./components/Tourism/RefundPolicy'));
const TermsConditions = lazy(() => import('./components/Tourism/TermsConditions'));
const Login = lazy(() => import('./components/Layout/Login'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const Destinations = lazy(() => import('./components/admin/Destinations'));
const Categories = lazy(() => import('./components/admin/Categories'));
const Bookings = lazy(() => import('./components/admin/Bookings'));
const Messages = lazy(() => import('./components/admin/Messages'));
const TestimonialsAdmin = lazy(() => import('./components/admin/Testimonials'));
const Subscribers = lazy(() => import('./components/admin/Subscribers'));
const Settings = lazy(() => import('./components/admin/Settings'));

const LegacyDetails = () => { const { placeId } = useParams(); return <Navigate to={`/places/${placeId}`} replace />; };

const admin = (page) => (
  <ProtectedRoute><AdminLayout>{page}</AdminLayout></ProtectedRoute>
);

function Shell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';
  const chromeless = isAdmin || isLogin;

  return (
    <div className="flex flex-col min-h-screen">
      {!chromeless && <Navbar />}
      <div className="flex-1">
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<TourismHome />} />
            <Route path="/destinations" element={<AllDestinations />} />
            <Route path="/destinations/:type" element={<AllDestinations />} />
            <Route path="/places/:placeId" element={<DestinationDetails />} />
            <Route path="/details/all" element={<Navigate to="/destinations" replace />} />
            <Route path="/details/:placeId" element={<LegacyDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/guides" element={<TravelGuides />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={admin(<Dashboard />)} />
            <Route path="/admin/destinations" element={admin(<Destinations />)} />
            <Route path="/admin/categories" element={admin(<Categories />)} />
            <Route path="/admin/bookings" element={admin(<Bookings />)} />
            <Route path="/admin/messages" element={admin(<Messages />)} />
            <Route path="/admin/testimonials" element={admin(<TestimonialsAdmin />)} />
            <Route path="/admin/subscribers" element={admin(<Subscribers />)} />
            <Route path="/admin/settings" element={admin(<Settings />)} />
            {/* Old admin URLs */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/add-place" element={<Navigate to="/admin/destinations" replace />} />
            <Route path="/admin/add-detail" element={<Navigate to="/admin/destinations" replace />} />
            <Route path="/admin/add-category" element={<Navigate to="/admin/categories" replace />} />
            <Route path="/admin/add-booking" element={<Navigate to="/admin/bookings" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {!chromeless && <Footer />}
      {!isAdmin && <ScrollToTop />}
      <RouteScrollReset />
    </div>
  );
}

export default function App() {
  const initializeAuth = useAdminStore((s) => s.initialize);
  const fetchPlaces = usePlaceStore((s) => s.fetchPlaces);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);

  // Shared data is loaded once here; realtime subscriptions keep it fresh.
  useEffect(() => {
    initializeAuth();
    fetchPlaces();
    fetchCategories();
    fetchSettings();
  }, [initializeAuth, fetchPlaces, fetchCategories, fetchSettings]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' } }} />
      <Shell />
    </BrowserRouter>
  );
}

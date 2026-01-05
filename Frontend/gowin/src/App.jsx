import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Sidebar from './components/admin/Sidebar';
import AddCategory from './components/admin/AddCategory';
import AddDetail from './components/admin/AddDetail';
import AddPlace from './components/admin/AddPlace';
import Home from './components/Home/Home';
import Dashboard from './components/admin/Dashboard';
import Place from './components/Home/Place';
import DestinationDetails from './components/Details/FetchDestinationDetails';
import NotFound from './components/Layout/Notfound';
import BookingForm from './components/Layout/Booking';
import Booking from './components/admin/AddBooking';
import Footer from './components/Home/Footer';
import Login from './components/Layout/Login';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Home/Navbar';
import Aboutus from './components/Layout/Aboutus';
import ContactUs from './components/Layout/ContactUs';
import colors from './theme/colors';

// Admin layout with sidebar
function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: colors.neutral.offWhite }}>
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

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Place />} />
        <Route path="/places/:placeId" element={<DestinationDetails />} />
        <Route path="/details/:placeId" element={<DestinationDetails />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<ContactUs />} />

        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer only on non-admin pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

// Main App component with Router wrapper
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

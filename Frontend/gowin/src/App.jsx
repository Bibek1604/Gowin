import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/admin/Sidebar';
import AddCategory from './components/admin/AddCategory';
import AddDetail from './components/admin/AddDetail';
import AddPlace from './components/admin/AddPlace';
import Home from './components/Home/Home';
import Dashboard from './components/admin/Dashboard';
import Place from './components/Home/Place';
import DestinationDetails from './components/Details/FetchDestinationDetails'; // Assuming this is the correct import

// Admin layout component to wrap admin routes with Sidebar
function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes with Sidebar layout */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-category"
          element={
            <AdminLayout>
              <AddCategory />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-place"
          element={
            <AdminLayout>
              <AddPlace />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-detail"
          element={
            <AdminLayout>
              <AddDetail />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Place />} />
        <Route path="/places/:placeId" element={<DestinationDetails />} />
        <Route path="/details/:placeId" element={<DestinationDetails />} />

        {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
}

export default App;
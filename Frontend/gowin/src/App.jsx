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
import DestinationDetails from './components/Details/FetchDestinationDetails'; 
import NotFound from './components/Layout/Notfound';
import BookingForm from './components/Layout/Booking';
import Booking from "./components/admin/AddBooking"

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
          path="/admin/add-booking"
          element={
            <AdminLayout>
              <Booking />
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

        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Place />} />
        <Route path="/places/:placeId" element={<DestinationDetails />} />

        <Route path="/details/:placeId" element={<DestinationDetails />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
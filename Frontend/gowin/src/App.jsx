import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/admin/Sidebar';
import AddCategory from './components/admin/AddCategory';
import FetchDestinationDetails from '../../gowin/src/components/Details/FetchDestinationDetails'
import AddDetail from './components/admin/AddDetail';
import AddPlace from './components/admin/AddPlace';
import Home from './components/Home/Home';
import Dashboard from './components/admin/Dashboard';
function App() {
  return (
    <Router>
        
          <Routes>
            <Route path="/admin" element={<Sidebar />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route path="/admin/add-place" element={<AddPlace />} />
            <Route path="/admin/add-detail" element={<AddDetail />} />
            <Route path="/details" element={<FetchDestinationDetails />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          
            {/* Add other routes here */}
            
            {/* Home route */}

            <Route path="/" element={<Home />} />
            
          </Routes>
    </Router>
  );
}

export default App;

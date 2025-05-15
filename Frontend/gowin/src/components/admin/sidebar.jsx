import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4">Gowin Admin</h2>
      <ul className="space-y-3">
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
          <Link to="/admin/add-category">Add Category</Link>
        </li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
          <Link to="/admin/add-place">Add Place</Link>
        </li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
          <Link to="/admin/add-detail">Add Details</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

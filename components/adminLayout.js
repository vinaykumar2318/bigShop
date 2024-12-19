import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white flex flex-col fixed top-0 left-0 h-full transition-all duration-300`}>
        <div className="flex items-center justify-between p-4">
          <h2 className={`text-2xl font-bold ${ isSidebarOpen ? 'block' : 'hidden' }`} >
            Admin Panel
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-xl focus:outline-none"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          <Link
            href="/admin/dashboard"
            className="hover:bg-gray-700 hover:text-gray-300 rounded-lg px-3 py-2 transition"
          >
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
              Dashboard
            </span>
            {!isSidebarOpen && <span className="text-center">D</span>}
          </Link>
          <Link
            href="/admin/users"
            className="hover:bg-gray-700 hover:text-gray-300 rounded-lg px-3 py-2 transition"
          >
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
              Users
            </span>
            {!isSidebarOpen && <span className="text-center">U</span>}
          </Link>
          <Link
            href="/admin/products"
            className="hover:bg-gray-700 hover:text-gray-300 rounded-lg px-3 py-2 transition"
          >
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
              Products
            </span>
            {!isSidebarOpen && <span className="text-center">P</span>}
          </Link>
          <Link
            href="/admin/orders"
            className="hover:bg-gray-700 hover:text-gray-300 rounded-lg px-3 py-2 transition"
          >
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
              Orders
            </span>
            {!isSidebarOpen && <span className="text-center">O</span>}
          </Link>
          <Link
            href="/admin/imageUpload"
            className="hover:bg-gray-700 hover:text-gray-300 rounded-lg px-3 py-2 transition"
          >
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
              Image Uploader
            </span>
            {!isSidebarOpen && <span className="text-center">I</span>}
          </Link>
          <Link
            href="/admin/settings"
            className="hover:bg-gray-700 hover:text-gray-300 rounded-lg px-3 py-2 transition"
          >
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
              Settings
            </span>
            {!isSidebarOpen && <span className="text-center">S</span>}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className={`bg-white shadow rounded-lg p-6 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;

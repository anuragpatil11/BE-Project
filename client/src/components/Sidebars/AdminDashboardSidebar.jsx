import React from "react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  FaChalkboardTeacher,
  FaUserShield,
  FaUserGraduate,
  FaFileUpload,
} from "react-icons/fa";

const AdminDashboardSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#1A2A4F] text-white transition-all duration-300 flex flex-col h-full fixed`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && (
            <h1 className="text-2xl font-bold whitespace-nowrap">Admin Portal</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#2C3E6D] rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-3 px-3 py-4 flex-grow overflow-y-auto">
          <NavItem
            icon={<FaFileUpload className="w-5 h-5" />}
            label="File Upload"
            isSidebarOpen={isSidebarOpen}
            to="/admin-dashboard"
          />
          <NavItem
            icon={<FaUserGraduate className="w-5 h-5" />}
            label="Students Compliances"
            isSidebarOpen={isSidebarOpen}
            to="/admin-dashboard/student-compliance"
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto ml-64 transition-all duration-300" 
            style={{ marginLeft: isSidebarOpen ? '16rem' : '5rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, to, isSidebarOpen }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
          isActive
            ? "bg-gray-800 text-white font-medium"
            : "text-gray-300 hover:bg-[#2C3E6D]"
        }`
      }
    >
      <span className="flex-shrink-0">
        {icon}
      </span>
      {isSidebarOpen && (
        <span className="text-lg">
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default AdminDashboardSidebar;
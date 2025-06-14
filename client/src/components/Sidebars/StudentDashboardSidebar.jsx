import React from "react";
import { useState } from "react";
import { FaClipboardCheck, FaListAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
const StudentDashboardSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-auto" : "w-28"
        } bg-[#1A2A4F] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && (
            <span className="text-2xl font-bold">Student Portal</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4 py-6">
          <NavItem
            icon={<FaClipboardCheck className="w-6 h-6" />}
            label={<span className="text-lg">My Compliances</span>}
            isSidebarOpen={isSidebarOpen}
            to="/student-dashboard"
          />
          <NavItem
            icon={<FaListAlt className="w-6 h-6" />}
            label={<span className="text-lg">Summarize Compliances</span>}
            isSidebarOpen={isSidebarOpen}
            to="/student-dashboard/summarize-compliances"
          />
        </nav>
      </aside>
    </div>
  );
};

// Sidebar Navigation Item Component
const NavItem = ({ icon, label, to, isSidebarOpen }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gray-800 text-white dark:bg-gray-700 font-medium"
            : "text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex-shrink-0 ${
              isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {icon}
          </span>
          {isSidebarOpen && (
            <span
              className={`${
                isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};
export default StudentDashboardSidebar;

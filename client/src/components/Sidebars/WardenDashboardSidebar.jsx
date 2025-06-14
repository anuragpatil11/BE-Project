import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Mail, Bell, User, FileText, Menu } from "lucide-react";
import {
  FaClipboardList,
  FaClipboardCheck,
  FaFileUpload,
  FaListAlt,
} from "react-icons/fa";
import { useAuth } from "../../store/AuthContext";
const WardenDashboardSidebar = () => {
  const userName1 = useAuth().userName;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-auto" : "w-28"
        } bg-[#1A2A4F] text-white  transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && <h1 className="text-2xl font-bold">Welcome {userName1}</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 px-3">
          {/* <NavItem
            icon={<FaClipboardCheck className="w-5 h-5" />}
            label={<span className="text-lg">My Compliances</span>}
            to="/warden-dashboard"
            isSidebarOpen={sidebarOpen}
          /> */}
          <NavItem
            icon={<FaFileUpload className="w-5 h-5" />}
            label={<span className="text-lg">Upload Compliances</span>}
            to="/warden-dashboard/upload-student-compliances"
            isSidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FaClipboardList className="w-5 h-5" />}
            label={<span className="text-lg">Students Compliances Status</span>}
            to="/warden-dashboard/student-compliances"
            isSidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FaClipboardList className="w-5 h-5" />}
            label={<span className="text-lg">Students Uploaded Compliance</span>}
            to="/warden-dashboard/student-uploaded-compliances"
            isSidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FaClipboardList className="w-5 h-5" />}
            label={<span className="text-lg">Students List</span>}
            to="/warden-dashboard/student-list"
            isSidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FaListAlt className="w-6 h-6" />}
            label={<span className="text-lg">Summarize Compliances</span>}
            isSidebarOpen={sidebarOpen}
            to="/warden-dashboard/summarize-compliances"
          />
        </nav>
      </aside>
    </div>
  );
};

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

export default WardenDashboardSidebar;

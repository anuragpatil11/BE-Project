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
const TeacherDashboardSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-[#1A2A4F] text-white transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        {isSidebarOpen && (
          <h1 className="text-2xl font-bold">Teacher Portal</h1>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex flex-col gap-3 px-3">
        <NavItem
          icon={<FaClipboardCheck className="w-5 h-5" />}
          label={<span className="text-lg">My Compliances</span>}
          isSidebarOpen={isSidebarOpen}
          to="/teacher-dashboard" // Pass the `to` prop for navigation
        />
        {/* <NavItem
          icon={<FaClipboardList className="w-5 h-5" />}
          label={<span className="text-lg">Students Compliances</span>}
          isSidebarOpen={isSidebarOpen}
          to="/teacher-dashboard/student-compliances"
        /> */}
        {/* <NavItem
          icon={<FaClipboardList className="w-5 h-5" />}
          label={<span className="text-lg">Students List</span>}
          to="/teacher-dashboard/student-list"
          isSidebarOpen={isSidebarOpen}
        /> */}
        <NavItem
          icon={<FaListAlt className="w-6 h-6" />}
          label={<span className="text-lg">Summarize Compliances</span>}
          isSidebarOpen={isSidebarOpen}
          to="/teacher-dashboard/summarize-compliances"
        />
      </nav>
    </aside>
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
export default TeacherDashboardSidebar;

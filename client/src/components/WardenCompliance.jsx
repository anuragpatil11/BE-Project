import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  FaChalkboardTeacher,
  FaFileUpload,
  FaUserGraduate,
} from "react-icons/fa";
const WardenCompliance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const wardens = [
    {
      id: 1,
      name: "Mr. Sharma",
      compliances: [
        { id: 1, name: "Hostel Inspection", status: "Approved" },
        { id: 2, name: "Fire Safety Check", status: "Pending" },
        { id: 3, name: "Sanitation Report", status: "Rejected" },
        { id: 4, name: "Electrical Safety", status: "Approved" },
        { id: 5, name: "Security Review", status: "Pending" },
      ],
    },
    {
      id: 2,
      name: "Ms. Verma",
      compliances: [
        { id: 1, name: "Hostel Inspection", status: "Pending" },
        { id: 2, name: "Fire Safety Check", status: "Approved" },
        { id: 3, name: "Sanitation Report", status: "Approved" },
        { id: 4, name: "Electrical Safety", status: "Rejected" },
        { id: 5, name: "Security Review", status: "Approved" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-[#1A2A4F] text-white w-64 p-4 space-y-6 transition-transform duration-300 fixed md:relative z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        <nav className="space-y-2">
          <Link
            to="/admin-dashboard"
            className="flex items-center gap-2 hover:bg-[#2C3E6D] p-2 rounded transition-colors duration-200"
          >
            <FaFileUpload className="w-5 h-5" /> Upload File
          </Link>
          <Link
            to="/admin-dashboard/teacher-compliance"
            className="flex items-center gap-2 hover:bg-[#2C3E6D] p-2 rounded transition-colors duration-200"
          >
            <FaChalkboardTeacher className="w-5 h-5" /> Teacher Compliances
          </Link>
          <Link
            to="/admin-dashboard/student-compliance"
            className="flex items-center gap-2 hover:bg-[#2C3E6D] p-2 rounded transition-colors duration-200"
          >
            <FaUserGraduate className="w-5 h-5" /> Student Compliances
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 p-6 overflow-x-auto">
        <button
          className="md:hidden mb-4 bg-[#1A2A4F] text-white p-2 rounded"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Warden Compliances
        </h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 uppercase">
                  Warden Name
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 uppercase">
                  Compliance
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {wardens.map((warden) => (
                <React.Fragment key={warden.id}>
                  {warden.compliances.map((compliance, index) => (
                    <tr
                      key={compliance.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {index === 0 && (
                        <td
                          rowSpan={warden.compliances.length}
                          className="py-3 px-4 text-center text-gray-700"
                        >
                          {warden.name}
                        </td>
                      )}
                      <td className="py-3 px-4 text-gray-600 text-center">
                        {compliance.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            compliance.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : compliance.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {compliance.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WardenCompliance;

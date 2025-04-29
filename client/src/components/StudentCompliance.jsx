import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
const serverUrl = import.meta.env.VITE_SERVER_URL;
import {
  FaUserShield,
  FaFileUpload,
  FaChalkboardTeacher,
} from "react-icons/fa";
import axios from "axios";


const StudentCompliance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentCompliance, setStudentCompliance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllStudentsCompliances = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:3000/api/warden/get-all-student-compliances"
          `${serverUrl}/api/warden/get-all-student-compliances`
        );

        if (response.status === 200 && response.data) {
          setStudentCompliance(response.data.students);
        } else {
          throw new Error("Invalid response from the server");
        }
      } catch (error) {
        console.error("Error fetching student compliances:", error);
        setError(
          "Failed to fetch student compliances. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    getAllStudentsCompliances();
  }, []);
  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting For Approve":
        return " text-blue-500";
      case "Rejected":
        return " text-red-500";
      case "Completed":
        return " text-violet-500";
      default:
        return " text-yellow-500";
    }
  };
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
            to="/admin-dashboard/warden-compliance"
            className="flex items-center gap-2 hover:bg-[#2C3E6D] p-2 rounded transition-colors duration-200"
          >
            <FaUserShield className="w-5 h-5" /> Warden Compliances
          </Link>
          <Link
            to="/admin-dashboard/teacher-compliance"
            className="flex items-center gap-2 hover:bg-[#2C3E6D] p-2 rounded transition-colors duration-200"
          >
            <FaChalkboardTeacher className="w-5 h-5" /> Teacher Compliances
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-x-auto">
        <button
          className="md:hidden mb-4 bg-[#1A2A4F] text-white p-2 rounded"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Student Compliances
        </h1>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-2 border-b text-left">Student ID</th>
                <th className="py-3 px-4 border-b text-left">Student Name</th>

                <th className="py-3 px-4 border-b text-left">Compliance</th>

                <th className="py-3 px-2 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentCompliance.map((student) =>
                student.compliances.map((compliance, index) => (
                  <tr
                    key={compliance.StudentComplianceStatus_ID}
                    className="hover:bg-gray-100"
                  >
                    {index === 0 && (
                      <>
                        <td
                          className="py-3 px-4 border-b"
                          rowSpan={student.compliances.length}
                        >
                          {student.student_id}
                        </td>
                        <td
                          className="py-3 px-4 border-b"
                          rowSpan={student.compliances.length}
                        >
                          {student.student_name}
                        </td>
                      </>
                    )}
                    <td className="py-3 px-4 border-b">
                      <a
                        href={compliance.urlOfCompliance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        {compliance.compliance_name}
                      </a>
                    </td>

                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          compliance.status
                        )}`}
                      >
                        {compliance.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentCompliance;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { FaClipboardList, FaClipboardCheck } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const StudentListTeacher = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student data from the API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          // "http://localhost:3000/api/student/getStudent"
          `${serverUrl}/api/student/getStudent`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        console.log("API Response:", data); // Log the API response
        setStudents(data.students); // Assuming the API returns { students: [...] }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Log the students state to verify data
  useEffect(() => {
    console.log("Students State:", students);
  }, [students]);


  const handleDownload = async () => {
    const requestBody = {
      tableName: "Student",
      columns: ["id", "name", "email"],
      fileName: "student_contacts.xlsx",
    };

    try {
      const response = await axios.post(
        `${serverUrl}/api/download/convertTableIntoExcel`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob", // Important: set responseType to blob
        }
      );

      if (response.status === 200) {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", requestBody.fileName);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        toast.success("Excel file downloaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to download Excel file.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1A2A4F] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && <h1 className="text-xl font-bold">Student List</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#2C3E6D] rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 px-3">
          <NavItem
            icon={<FaClipboardCheck className="w-5 h-5" />}
            label="Teacher Compliance"
            to="/teacher-dashboard"
            isSidebarOpen={sidebarOpen}
          />
          {/* <NavItem
            icon={<FaClipboardList className="w-5 h-5" />}
            label="Students Compliances Status"
            to="/warden-dashboard/student-compliances"
            isSidebarOpen={sidebarOpen}
          /> */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto p-6">
        <div className="flex justify-between items-center p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold">Student List</h1>
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 focus:ring-2 focus:ring-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Download Excel
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Student Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 uppercase">
                    ID
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 uppercase">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors "
                    >
                      <td className="py-3 px-4 text-gray-700 text-center">
                        {student.id}
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-center">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-center">
                        {student.email}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Sidebar Navigation Item Component
const NavItem = ({ icon, label, to, isSidebarOpen }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 hover:bg-[#2C3E6D] rounded-md transition-colors"
    >
      {icon}
      {isSidebarOpen && <span className="text-lg">{label}</span>}
    </Link>
  );
};

export default StudentListTeacher;

import { Bell, User, Menu, FileText, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../store/AuthContext";
import { FaClipboardCheck, FaListAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [compliances, setCompliances] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const { userID } = useAuth();

  // Fetch compliance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/api/student/getStudentComplianceByStudentId/${userID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.compliances)) {
          setCompliances(data.compliances);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  // Toggle status of a compliance
  const toggleStatus = async (complianceId) => {
    try {
      const response = await fetch(
        `${serverUrl}/api/student/toggleFileStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: userID,
            complianceId: complianceId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCompliances((prevCompliances) =>
          prevCompliances.map((compliance) =>
            compliance.compliance_id === complianceId
              ? { ...compliance, status: result.newStatus }
              : compliance
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error.message);
    }
  };

  // Open confirmation modal
  const openModal = (compliance) => {
    setSelectedCompliance(compliance);
    setIsModalOpen(true);
  };

  // Close confirmation modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompliance(null);
  };

  // Filter compliances based on search query and status
  const filteredCompliances = compliances
    .filter((compliance) =>
      compliance.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((compliance) =>
      statusFilter === "All" ? true : compliance.status === statusFilter
    );

  // Display only first 4 items initially
  const displayedCompliances = showAll
    ? filteredCompliances
    : filteredCompliances.slice(0, 4);

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
            <h1 className="text-2xl font-bold">Student Portal</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 px-4">
          <NavItem
            icon={<FaClipboardCheck className="w-6 h-6" />}
            label={<span className="text-lg">My Compliances</span>}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            icon={<FaListAlt className="w-6 h-6" />}
            label={<span className="text-lg">Summarize Compliances</span>}
            isSidebarOpen={isSidebarOpen}
            to="/student-dashboard/summarize-compliances"
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-auto">
        {/* Navbar */}
        <nav className="bg-white px-6 py-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-semibold">I2IT Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 text-gray-600" />
            <Bell className="w-6 h-6 text-gray-600" />
            <User className="w-6 h-6 text-gray-600" />
          </div>
        </nav>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-10 mt-5 justify-center">
          {/* Total Compliances Card */}
          <div className="bg-blue-500 p-6 rounded-lg shadow-md text-white text-2xl flex-1 min-w-[150px] max-w-[350px] text-center hover:shadow-lg transition-shadow">
            <h1 className="text-lg font-semibold">Total Compliances</h1>
            <h2 className="text-2xl font-bold mt-2">{compliances.length}</h2>
          </div>

          {/* Completed Compliances Card */}
          <div className="bg-green-500 p-6 rounded-lg shadow-md text-white flex-1 min-w-[150px] max-w-[350px] text-center hover:shadow-lg transition-shadow">
            <h1 className="text-lg font-semibold">Completed Compliances</h1>
            <h2 className="text-2xl font-bold mt-2">
              {
                compliances.filter(
                  (compliance) => compliance.status === "Completed"
                ).length
              }
            </h2>
          </div>

          {/* Pending Compliances Card */}
          <div className="bg-yellow-500 p-6 rounded-lg shadow-md text-white flex-1 min-w-[150px] max-w-[350px] text-center hover:shadow-lg transition-shadow">
            <h1 className="text-lg font-semibold">Pending Compliances</h1>
            <h2 className="text-2xl font-bold mt-2">
              {
                compliances.filter(
                  (compliance) => compliance.status === "Pending"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Rejected Compliances Card */}
        <div className="flex justify-center mt-10">
          <div className="bg-red-500 p-6 rounded-lg shadow-md text-white flex-1 min-w-[150px] max-w-[350px] text-center hover:shadow-lg transition-shadow">
            <h1 className="text-lg font-semibold">Rejected Compliances</h1>
            <h2 className="text-2xl font-bold mt-2">
              {
                compliances.filter(
                  (compliance) => compliance.status === "Rejected"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Compliance PDFs Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recently Uploaded Compliance PDFs
          </h2>

          {/* Search and Filter Section */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Waiting For Approve">Waiting For Approval</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Compliance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedCompliances.map((compliance) => (
                  <div
                    key={compliance.compliance_id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* PDF Preview Section */}
                    <div className="h-40 bg-gray-100 flex items-center justify-center rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>

                    {/* Compliance Name */}
                    <p className="mt-2 text-center font-medium truncate">
                      {compliance.name || "N/A"}
                    </p>

                    {/* Compliance Dates */}
                    <div className="mt-2 space-y-1 text-center text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {compliance.created_at
                          ? new Date(compliance.created_at).toLocaleString(
                              "en-IN",
                              {
                                timeZone: "Asia/Kolkata",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true, // Ensures AM/PM format
                              }
                            )
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Due:</span>{" "}
                        {compliance.due_date
                          ? new Date(compliance.due_date).toLocaleString(
                              "en-IN",
                              {
                                timeZone: "Asia/Kolkata",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true, // Ensures AM/PM format
                              }
                            )
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Completed:</span>{" "}
                        {compliance.completed_at
                          ? compliance.completed_at.slice(0, 10)
                          : "Not Completed"}
                      </p>
                    </div>

                    {/* Compliance Status */}
                    <div className="mt-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-lg font-bold ${
                          compliance.status === "Pending"
                            ? " text-yellow-500"
                            : compliance.status === "Waiting For Approve"
                            ? " text-blue-500"
                            : compliance.status === "Completed"
                            ? " text-green-500"
                            : " text-red-500"
                        }`}
                      >
                        {compliance.status || "N/A"}
                      </span>
                    </div>

                    {/* View PDF Link */}
                    {compliance.url && (
                      <div className="mt-2 text-center">
                        <a
                          href={compliance.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          View PDF
                        </a>
                      </div>
                    )}

                    {/* Change Status Button */}
                    {(compliance.status === "Pending" ||
                      compliance.status === "Waiting For Approve") && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => openModal(compliance)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Change Status
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {filteredCompliances.length > 4 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className=" text-black  hover:text-blue-600  hover:underline"
                  >
                    {showAll ? "Show Less" : "View More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedCompliance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Status Change
            </h2>
            <p>
              Are you sure you want to change the status of{" "}
              <strong>{selectedCompliance.name}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleStatus(selectedCompliance.compliance_id);
                  closeModal();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Navigation Item Component
const NavItem = ({ icon, label, isSidebarOpen, to }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3  hover:bg-gray-700 rounded-md cursor-pointer transition-all"
    >
      {icon}
      {isSidebarOpen && <span>{label}</span>}
    </Link>
  );
};

export default StudentDashboard;

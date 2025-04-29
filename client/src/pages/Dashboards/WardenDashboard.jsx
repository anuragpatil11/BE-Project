import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Bell, User, FileText, Menu } from "lucide-react";
import { FaClipboardList, FaClipboardCheck } from "react-icons/fa";
// import { toast } from "react-toastify";

const WardenDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [compliances, setCompliances] = useState([
    {
      id: 1,
      name: "Review Hostel Applications",
      status: "Pending",
      pdfUrl: "",
    },
    { id: 2, name: "Approve Leave Requests", status: "Completed", pdfUrl: "" },
    { id: 3, name: "Inspect Hostel Facilities", status: "Pending", pdfUrl: "" },
    { id: 4, name: "Submit Monthly Report", status: "Pending", pdfUrl: "" },
    { id: 5, name: "Conduct Safety Drills", status: "Completed", pdfUrl: "" },
    { id: 6, name: "Verify Student Documents", status: "Pending", pdfUrl: "" },
    { id: 7, name: "Organize Hostel Events", status: "Pending", pdfUrl: "" },
    {
      id: 8,
      name: "Monitor Student Attendance",
      status: "Completed",
      pdfUrl: "",
    },
    { id: 9, name: "Address Complaints", status: "Pending", pdfUrl: "" },
    { id: 10, name: "Renew Contracts", status: "Pending", pdfUrl: "" },
  ]);

  const displayedCompliances = showAll ? compliances : compliances.slice(0, 4);

  const filteredCompliances = displayedCompliances.filter((compliance) => {
    const matchesSearch = compliance.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || compliance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1A2A4F] text-white  transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && <h1 className="text-2xl font-bold">Warden Portal</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 px-3">
          <NavItem
            icon={<FaClipboardCheck className="w-5 h-5" />}
            label={<span className="text-lg">My Compliances</span>}
            to="/warden-dashboard"
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
            label={<span className="text-lg">Students List</span>}
            to="/warden-dashboard/student-list"
            isSidebarOpen={sidebarOpen}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow bg-gray-100 min-h-screen overflow-auto">
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">I2IT Warden Dashboard</h1>
          <div className="flex items-center gap-4">
            <Mail
              className="w-6 h-6 text-gray-600"
              onClick={() => {
                alert("Mail");
              }}
            />
            <Bell className="w-6 h-6 text-gray-600" />
            <User className="w-6 h-6 text-gray-600" />
          </div>
        </nav>
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

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">My Compliances</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search compliances..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCompliances.map((compliance) => (
              <div
                key={compliance.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center rounded-lg">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <p className="mt-2 text-center font-medium">
                  {compliance.name}
                </p>
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
                {compliance.pdfUrl && (
                  <div className="mt-2 text-center">
                    <a
                      href={compliance.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View PDF
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          {compliances.length > 4 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className=" text-black  hover:text-blue-600  hover:underline"
              >
                {showAll ? "Show Less" : "View More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to, isSidebarOpen }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-md cursor-pointer transition-all"
    >
      {icon}
      {isSidebarOpen && <span>{label}</span>}
    </Link>
  );
};

export default WardenDashboard;

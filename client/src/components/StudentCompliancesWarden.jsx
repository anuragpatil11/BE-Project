import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaFileUpload, FaClipboardCheck } from "react-icons/fa";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const StudentCompliancesWarden = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedComplianceId, setSelectedComplianceId] = useState(null);
  const [selectedStudentID, setSelectedStudentID] = useState(null);
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [studentCompliance, setStudentCompliance] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Added isSubmitting state for button loading indicator
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showRejectionNotePopup, setShowRejectionNotePopup] = useState(false);
  const [note, setNote] = useState("");
  const [selectedComplianceName, setSelectedComplianceName] = useState("");
  const [selectedStudentEmail, setSelectedStudentEmail] = useState("");

  // Added state to store the entire selected student record
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCompliance, setSelectedCompliance] = useState(null);

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
  }, [status]);

  const handleStatusClick = (
    complianceId,
    studentId,
    complianceName,
    studentEmail,
    student,
    compliance
  ) => {
    setSelectedComplianceId(complianceId);
    setSelectedStudentID(studentId);
    setSelectedComplianceName(complianceName);
    setSelectedStudentEmail(studentEmail);
    setSelectedStudent(student);
    setSelectedCompliance(compliance);
    setShowPopup(true);
  };

  const handleStatusChange = async () => {
    if (!status) {
      toast.error("Please select a status.");
      return;
    }

    if (!selectedComplianceId || !selectedStudentID) {
      toast.error("Missing compliance ID or student ID.");
      return;
    }

    if (status === "Rejected") {
      // Show rejection note popup instead of immediately submitting
      setShowRejectionNotePopup(true);
      setShowPopup(false); // Hide the main status popup
      return;
    }

    await submitStatusUpdate(status, "");
  };

  const handleRejectionSubmit = async () => {
    if (!note.trim()) {
      toast.error("Please enter a rejection note.");
      return;
    }

    // Set submitting state to true
    setIsSubmitting(true);

    await submitStatusUpdate("Rejected", note);

    // Reset submitting state
    setIsSubmitting(false);
    setShowRejectionNotePopup(false);
  };

  const submitStatusUpdate = async (status, note) => {
    try {
      const response = await fetch(
        // "http://localhost:3000/api/warden/files/update-status",
        `${serverUrl}/api/warden/files/update-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: status,
            studentId: selectedStudentID,
            compliance_id: selectedComplianceId,
            complianceName: selectedComplianceName,
            studentEmail: selectedStudentEmail,
            note: note,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        throw new Error("Failed to update status");
      }

      toast.success("Status updated successfully!");
      setShowPopup(false);
      setStatus("");
      setNote("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting For Approve":
        return "text-blue-500";
      case "Rejected":
        return "text-red-500";
      case "Completed":
        return "text-green-500";
      default:
        return "text-yellow-500";
    }
  };

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
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Warden Dashboard</h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 px-3">
          <NavItem
            icon={<FaClipboardCheck className="w-5 h-5" />}
            label="My Compliance"
            to="/warden-dashboard"
            isSidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FaFileUpload className="w-5 h-5" />}
            label="Upload Student Compliance"
            to="/warden-dashboard/upload-student-compliances"
            isSidebarOpen={sidebarOpen}
          />
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold mb-2">Student Compliances</h1>
        </nav>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 border-x-2 border-y-2">
                <th className="py-3 px-2 border-b text-center">Student ID</th>
                <th className="py-3 px-4 border-b text-center">Student Name</th>
                <th className="py-3 px-4 border-b text-center">Email</th>
                <th className="py-3 px-4 border-b text-center">Compliance</th>
                <th className="py-3 px-4 border-b text-center">Created</th>
                <th className="py-3 px-4 border-b text-center">Due</th>
                <th className="py-3 px-4 border-b text-center">Complete</th>
                <th className="py-3 px-2 border-b text-center">Status</th>
                <th className="py-3 px-2 border-b text-center">Action</th>
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
                          className="py-3 px-4 border-b text-center border-x-2 border-y-2"
                          rowSpan={student.compliances.length}
                        >
                          {student.student_id}
                        </td>
                        <td
                          className="py-3 px-4 border-b text-center border-x-2 border-y-2"
                          rowSpan={student.compliances.length}
                        >
                          {student.student_name}
                        </td>
                        <td
                          className="py-3 px-4 border-b text-center border-x-2 border-y-2"
                          rowSpan={student.compliances.length}
                        >
                          {student.student_email}
                        </td>
                      </>
                    )}
                    <td className="py-3 px-4 border-b text-center border-x-2 border-y-2 align-middle">
                      <a
                        href={compliance.urlOfCompliance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                        style={{
                          wordBreak: "break-word", // Ensures long words are broken
                          whiteSpace: "normal", // Allows text to wrap
                          overflowWrap: "break-word", // Ensures better handling of long strings
                        }}
                      >
                        {compliance.compliance_name}
                      </a>
                    </td>

                    <td className="py-3 px-2 border-b text-center border-x-2 border-y-2">
                      {new Date(compliance.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="py-3 px-2 border-b text-center border-x-2 border-y-2">
                      {new Date(compliance.due_date).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>
                    <td className="py-3 px-4 border-b text-center border-x-2 border-y-2">
                      {compliance.completed_at
                        ? new Date(compliance.completed_at).toLocaleString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="py-3 px-2 border-b text-center border-x-2 border-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                          compliance.status
                        )}`}
                      >
                        {compliance.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 border-b text-center border-x-2 border-y-2">
                      <button
                        onClick={() =>
                          handleStatusClick(
                            compliance.compliance_id,
                            student.student_id,
                            compliance.compliance_name,
                            student.student_email,
                            student,
                            compliance
                          )
                        }
                        className="text-blue-500 hover:underline"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Main Status Update Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                Update Compliance Status
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Rejection Note Popup with Student Details */}
        {showRejectionNotePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Rejection Details</h2>

              {/* Student and Compliance Information */}
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="font-semibold text-gray-700">
                      Student ID:
                    </span>
                    <p className="text-gray-800">{selectedStudentID}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email:</span>
                    <p className="text-gray-800 break-words">
                      {selectedStudentEmail}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    Compliance:
                  </span>
                  <p className="text-gray-800">{selectedComplianceName}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Reason for Rejection:
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 border rounded-lg h-28 focus:border-red-500 focus:ring focus:ring-red-200 focus:outline-none"
                  placeholder="Enter detailed reason for rejection..."
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowRejectionNotePopup(false);
                    setStatus("");
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectionSubmit}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center min-w-[140px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
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

export default StudentCompliancesWarden;

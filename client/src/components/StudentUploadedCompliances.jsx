import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import WardenDashboardSidebar from "./Sidebars/WardenDashboardSidebar";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const StudentUploadedCompliance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedComplianceId, setSelectedComplianceId] = useState(null);
  const [selectedStudentID, setSelectedStudentID] = useState(null);
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [studentCompliance, setStudentCompliance] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectionNotePopup, setShowRejectionNotePopup] = useState(false);
  const [note, setNote] = useState("");
  const [selectedComplianceName, setSelectedComplianceName] = useState("");
  const [selectedStudentEmail, setSelectedStudentEmail] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCompliance, setSelectedCompliance] = useState(null);

  useEffect(() => {
    const getAllStudentsCompliances = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/student/getAllSubmissions`
        );

        if (response.status === 200 && response.data) {
          // The API returns an array of student objects with nested compliances
          // console.log("Fetched student compliances:", response.data[0]);

          setStudentCompliance(response.data);
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
      setShowRejectionNotePopup(true);
      setShowPopup(false);
      return;
    }

    await submitStatusUpdate(status, "");
  };

  const handleRejectionSubmit = async () => {
    if (!note.trim()) {
      toast.error("Please enter a rejection note.");
      return;
    }

    setIsSubmitting(true);
    await submitStatusUpdate("Rejected", note);
    setIsSubmitting(false);
    setShowRejectionNotePopup(false);
  };

  const submitStatusUpdate = async (status, note) => {
    try {
      const response = await axios.put(
        `${serverUrl}/api/warden/files/update-status`,
        {
          status: status,
          studentId: selectedStudentID,
          compliance_id: selectedComplianceId,
          complianceName: selectedComplianceName,
          studentEmail: selectedStudentEmail,
          note: note,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Status updated successfully!");
        setShowPopup(false);
        setStatus("");
        setNote("");

        // Refresh the data
        const refreshResponse = await axios.get(
          `${serverUrl}/api/student/getAllSubmissions`
        );
        setStudentCompliance(refreshResponse.data);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
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
      <WardenDashboardSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Student Compliances</h1>
        </nav>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4 mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 border-b text-left">Student ID</th>
                  <th className="py-3 px-4 border-b text-left">Student Name</th>
                  <th className="py-3 px-4 border-b text-left">Email</th>
                  <th className="py-3 px-4 border-b text-left">Compliance</th>
                  <th className="py-3 px-4 border-b text-left">Uploaded Date</th>
                  <th className="py-3 px-4 border-b text-left">PDF</th>
                </tr>
              </thead>
              <tbody>
                {studentCompliance.map((student) =>
                  student.compliances.map((compliance, index) => (
                    <tr key={compliance.id} className="hover:bg-gray-50">
                      {/* Show student details only in the first row of each student */}
                      {index === 0 ? (
                        <>
                          <td
                            className="py-3 px-4 border-b"
                            rowSpan={student.compliances.length}
                          >
                            {student.studentId}
                          </td>
                          <td
                            className="py-3 px-4 border-b"
                            rowSpan={student.compliances.length}
                          >
                            {student.studentName}
                          </td>
                          <td
                            className="py-3 px-4 border-b"
                            rowSpan={student.compliances.length}
                          >
                            {student.studentEmail}
                          </td>
                        </>
                      ) : null}

                      <td className="py-3 px-4 border-b">
                        {compliance.complianceName}
                      </td>
                      {/* <td className="py-3 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            compliance.status
                          )}`}
                        >
                          {compliance.status}
                        </span>
                      </td> */}
                      <td className="py-3 px-4 border-b">
                        {new Date(compliance.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <a
                          href={compliance.compliance_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View PDF
                        </a>
                      </td>
                      {/* <td className="py-3 px-4 border-b">
                        <button
                          onClick={() =>
                            handleStatusClick(
                              compliance.id,
                              student.studentId,
                              compliance.complianceName,
                              student.studentEmail,
                              student,
                              compliance
                            )
                          }
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Change Status
                        </button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Status Update Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Update Status</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">New Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Note Popup */}
        {showRejectionNotePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Rejection Details</h2>
                <button
                  onClick={() => setShowRejectionNotePopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Student</p>
                    <p className="font-medium">
                      {selectedStudent?.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Compliance</p>
                    <p className="font-medium">{selectedComplianceName}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Reason for Rejection:
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter detailed reason..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectionNotePopup(false);
                    setStatus("");
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectionSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 ${
                    isSubmitting ? "opacity-70" : ""
                  }`}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentUploadedCompliance;

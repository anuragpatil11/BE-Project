import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu, X, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaClipboardCheck } from "react-icons/fa";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const StudentComplianceUploadTeacher = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUpload, setSelectedFileUpload] = useState(null);
  const [selectedComplianceId, setSelectedComplianceId] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = async (event) => {
    event.preventDefault(); // Prevent form reload if inside a form
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    try {
      const response = await fetch(
        // "http://localhost:3000/api/warden/upload/pdf",
        `${serverUrl}/api/warden/upload/pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("File uploaded:", data);

      toast.success("✅ File uploaded successfully!", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(
        // "http://localhost:3000/api/student/getAllFiles"
        `${serverUrl}/api/student/getAllFiles`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      setUploadedFiles(data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to fetch files", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleFileClick = (file) => {
    setSelectedComplianceId(file.id);
    setSelectedFileUpload(file);
    setShowPopup(true);
    setShowUploadForm(false);
  };

  const handleDeleteCompliance = async () => {
    try {
      if (!selectedComplianceId) {
        toast.error("Please select a file to delete", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      setIsLoadingDelete(true);
      const response = await fetch(
        // `http://localhost:3000/api/warden/delete/pdf/${selectedComplianceId}`,
        `${serverUrl}/api/warden/delete/pdf/${selectedComplianceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      toast.success("Compliance deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setSelectedComplianceId(null);
      setShowPopup(false);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error deleting compliance:", error);
      toast.error(
        error.message || "Failed to delete compliance. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const handleSendCompliance = async () => {
    if (!selectedComplianceId || !dueDate) {
      toast.error("Please select a file and due date", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoadingUpload(true);
    try {
      const [year, month, day] = dueDate.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      const response = await fetch(
        // "http://localhost:3000/api/warden/create-compliance",
        `${serverUrl}/api/warden/create-compliance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complianceId: selectedComplianceId,
            due_date: formattedDate,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send compliance");
      }

      toast.success("Compliance sent successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setSelectedComplianceId(null);
      setDueDate("");
      setShowPopup(false);
      setShowUploadForm(false);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to send compliance: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoadingUpload(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowUploadForm(false);
    setDueDate("");
  };

  return (
    <div className="flex min-h-screen overflow-auto">
      {/* Sidebar */}
      <aside
        className={`bg-[#1A2A4F] text-white w-64 p-5 space-y-6 transition-transform duration-300 fixed md:relative z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Teacher Dashboard</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-4">
          <Link
            to="/teacher-dashboard"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <FaClipboardCheck className="w-5 h-5" />
            My Compliances
          </Link>
          <Link
            to="/teacher-dashboard/student-compliances"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <FaClipboardList className="w-5 h-5" />
            Student Compliances Status
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden bg-gray-800 text-white p-2 rounded-lg mb-4"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-4">Upload Student Compliance</h1>
        {/* Upload Section */}
        <div className="flex justify-center p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-green-500 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <UploadCloud className="w-5 h-5" />
              {isLoading ? "Uploading..." : "Upload Students Compliance PDF"}
            </label>
            {selectedFile && (
              <p className="text-sm text-gray-700 font-medium">
                Selected File:{" "}
                <span className="text-blue-500">{selectedFile.name}</span>
              </p>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Uploaded Files</h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          {uploadedFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {file.name}
                    </a>
                  </div>
                  <div className="text-sm text-gray-600">
                    Uploaded on:{" "}
                    {new Date(file.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No files uploaded yet.</p>
          )}
        </div>

        {/* Popup Modal */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Selected File</h2>
              {selectedFileUpload && (
                <p className="mb-4 text-gray-700">{selectedFileUpload.name}</p>
              )}

              {!showUploadForm ? (
                <div className="flex justify-end gap-4 mb-4">
                  <button
                    onClick={handleClosePopup}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCompliance}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    disabled={isLoadingDelete}
                  >
                    {isLoadingDelete ? "Deleting..." : "Delete Compliance"}
                  </button>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={isLoadingUpload}
                  >
                    Upload Compliance
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Select Due Date:
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleClosePopup}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendCompliance}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoadingUpload}
                    >
                      {isLoadingUpload ? "Sending..." : "Send Compliance"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default StudentComplianceUploadTeacher;

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClipboardList, FaClipboardCheck } from "react-icons/fa";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const StudentComplianceUploadWarden = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUpload, setSelectedFileUpload] = useState(null);
  const [selectedComplianceId, setSelectedComplianceId] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [uploadedFiles]);

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
            icon={<FaClipboardList className="w-5 h-5" />}
            label="Students Compliances Status"
            to="/warden-dashboard/student-compliances"
            isSidebarOpen={sidebarOpen}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </nav>
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
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border w-auto border-gray-200 cursor-pointer transform hover:scale-105 hover:shadow-lg transition-transform  duration-300 ease-in-out"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline font-medium break-words"
                      style={{ maxWidth: "100%" }}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h2
                  className="text-2xl font-bold text-gray-800 break-words truncate max-w-full"
                  style={{
                    maxWidth: "80%", // Ensures the file name doesn't take too much width
                    whiteSpace: "nowrap", // Prevents wrapping
                    overflow: "hidden", // Hides overflowing text
                    textOverflow: "ellipsis", // Adds ellipsis for long names
                  }}
                >
                  {selectedFileUpload?.name}
                </h2>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {!showUploadForm ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      Select an action for this file
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowUploadForm(true)}
                      className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="bg-blue-100 p-3 rounded-full mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">
                        Upload Compliance
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeleteCompliance}
                      disabled={isLoadingDelete}
                      className={`flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg transition-all duration-200 ${
                        isLoadingDelete
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:border-red-300 hover:bg-red-50"
                      }`}
                    >
                      <div className="bg-red-100 p-3 rounded-full mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">
                        {isLoadingDelete ? "Deleting..." : "Delete Compliance"}
                      </span>
                    </motion.button>
                  </div>

                  <button
                    onClick={handleClosePopup}
                    className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSendCompliance}
                      disabled={isLoadingUpload}
                      className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all ${
                        isLoadingUpload ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoadingUpload ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Compliance"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        <ToastContainer />
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

export default StudentComplianceUploadWarden;

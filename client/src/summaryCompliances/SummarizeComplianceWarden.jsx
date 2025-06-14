import { useState } from "react";
// import StudentDashboardSidebar from "../components/Sidebars/StudentDashboardSidebar";
import WardenDashboardSidebar from "../components/Sidebars/WardenDashboardSidebar";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const SummarizeComplianceWarden = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    setIsLoading(true); // 🔹 Set loading state before request

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${serverUrl}/api/summarize`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPdfName(data.originalFileName);
        setSummary(data.summary);
        setShowModal(true);
        setSelectedFile(null); // 🔹 Clear file selection after upload
      } else {
        alert("Failed to summarize the PDF.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while summarizing.");
    } finally {
      setIsLoading(false); // 🔹 Reset loading state after request
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <StudentDashboardSidebar /> */}
      <WardenDashboardSidebar/>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upload Compliance PDF for Summarization
        </h2>

        {/* Upload Section */}
        <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
          <div className="w-full">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Summarizing..." : "Upload PDF to Summarize"}
          </button>
        </div>
      </div>

      {/* Summarized Text Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              {pdfName} - Summarized Text
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              {summary}
            </p>
            <button
              className="mt-6 bg-red-500 text-white py-3 px-6 rounded-lg w-full hover:bg-red-600 transition-all font-semibold"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarizeComplianceWarden;

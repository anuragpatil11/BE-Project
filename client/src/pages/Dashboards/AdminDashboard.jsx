import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion} from "framer-motion";
// import { useInView } from "react-intersection-observer";
import { Bell, User, Upload, Mail, X, Menu ,Pencil,Trash2,Plus,Download,Loader2} from "lucide-react";
import {
  FaChalkboardTeacher,
  FaUserShield,
  FaUserGraduate,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("students");
  const [isUploading, setIsUploading] = useState(false);
  const [addSingleData, setAddSingleDataOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // for adding single data
  const [selectedRoleList, setSelectedRoleList] = useState(""); // For displaying lists
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [data, setData] = useState([]); // Data fetched from API
  const [loading, setLoading] = useState(false); // Loading state for API call

  // Define categories for upload modal
  const categories = [
    { value: "students", label: "Students" },
    { value: "teachers", label: "Teachers" },
    { value: "wardens", label: "Wardens" },
  ];

  // API endpoints for fetching data
  const getApiEndpoints = {
    student: `${serverUrl}/api/student/getStudent`,
    teacher: `${serverUrl}/api/admin/get-all-teachers`,
    // warden: "http://localhost:3000/api/warden/getWarden",
  };

  // Fetch data based on selected role
  useEffect(() => {
    if (selectedRoleList) {
      fetchData();
    }
  }, [selectedRoleList]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = getApiEndpoints[selectedRoleList];
      if (!endpoint) {
        setLoading(false);
        return;
      }

      const response = await axios.get(endpoint);

      if (selectedRoleList === "student") {
        setData(response.data.students || []); // Extract students array
      } else if (selectedRoleList === "teacher") {
        setData(response.data.teachers || []); // Extract teachers array
      } else if (selectedRoleList === "warden") {
        setData(response.data.wardens || []); // Extract wardens array
      } else {
        setData([]); // Handle unexpected cases
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  };
  // API endpoints for different roles
  const apiEndpoints = {
    student: `${serverUrl}/api/admin/upload/studentExcelFile`,
    teacher: `${serverUrl}/api/admin/upload/teacherExcelFile`,
    warden: `${serverUrl}/api/admin/upload/wardenExcelFile`,
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select a role first!");
      return;
    }

    try {
      const endpoint = apiEndpoints[selectedRole];
      if (!endpoint) {
        toast.error("Invalid role selected!");
        return;
      }

      const response = await axios.post(endpoint, formData);
      if (response.status === 200) {
        toast.success(`${selectedRole} data added successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        setAddSingleDataOpen(false);
        setSelectedRole("");
        setFormData({ name: "", email: "", password: "" });
        fetchData(); // Refresh the data after adding
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select an Excel file.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    let apiEndpoint = "";
    if (selectedCategory === "students") {
      apiEndpoint = `${serverUrl}/api/admin/upload/studentExcelFile`;
    } else if (selectedCategory === "teachers") {
      apiEndpoint = `${serverUrl}/api/admin/upload/teacherExcelFile`;
    } else if (selectedCategory === "wardens") {
      apiEndpoint = `${serverUrl}/api/admin/upload/wardenExcelFile`;
    }

    try {
      setIsUploading(true);
      await axios.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ File uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setUploadModalOpen(false);
      setSelectedFile(null);
      fetchData(); // Refresh the data after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("File upload failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    // Define role-specific request body parameters
    const roleConfigs = {
      student: {
        tableName: "Student",
        columns: ["id", "name", "email"],
        fileName: "student_contacts.xlsx",
      },
      teacher: {
        tableName: "Teacher",
        columns: ["id", "name", "email"],
        fileName: "teacher_contacts.xlsx",
      },
      warden: {
        tableName: "Warden",
        columns: ["id", "name", "email"],
        fileName: "warden_contacts.xlsx",
      },
    };

    // Get the appropriate config based on the selected role
    const requestBody = roleConfigs[selectedRoleList];

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

        toast.success(
          `${requestBody.tableName} data downloaded successfully!`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
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
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#1A2A4F] text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Portal</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#2C3E6D] rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-3 px-3">
          <NavItem
            icon={<FaChalkboardTeacher className="w-5 h-5" />}
            label="Teachers Compliances"
            isSidebarOpen={isSidebarOpen}
            to="/admin-dashboard/teacher-compliance"
          />
          <NavItem
            icon={<FaUserShield className="w-5 h-5" />}
            label="Wardens Compliances"
            isSidebarOpen={isSidebarOpen}
            to="/admin-dashboard/warden-compliance"
          />
          <NavItem
            icon={<FaUserGraduate className="w-5 h-5" />}
            label="Students Compliances"
            isSidebarOpen={isSidebarOpen}
            to="/admin-dashboard/student-compliance"
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto bg-gray-50">
        {/* Header */}
        <nav className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            Admin Compliance Overview
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Mail className="w-6 h-6 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
              <div className="absolute hidden group-hover:block bg-white p-2 rounded-md shadow-lg border border-gray-100 w-48 right-0">
                <p className="text-sm text-gray-600">Messages (3)</p>
              </div>
            </div>
            <div className="relative group">
              <Bell className="w-6 h-6 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                5
              </span> */}
            </div>
            {/* <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  A
                </div>
              </div>
            </div> */}
          </div>
        </nav>

        {/* Main Content */}
        <div className="p-6">
          {/* Upload Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Upload Excel File Role Wise And Add Single Data
            </h2>
            <div className="flex justify-center gap-5">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload className="w-5 h-5" />
                <span>Upload Excel File</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                onClick={() => setAddSingleDataOpen(true)}
              >
                <Plus className="w-5 h-5" />
                <span>Add Single Data</span>
              </motion.button>
            </div>
          </section>

          {/* Role Selection Modal */}
          {addSingleData && !selectedRole && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white p-6 rounded-xl shadow-xl w-96 border border-gray-100"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Select Role
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      role: "student",
                      label: "Student",
                      icon: User,
                      color: "bg-blue-500",
                    },
                    {
                      role: "teacher",
                      label: "Teacher",
                      icon: FaChalkboardTeacher,
                      color: "bg-yellow-500",
                    },
                    {
                      role: "warden",
                      label: "Warden",
                      icon: FaUserShield,
                      color: "bg-red-500",
                    },
                  ].map((item) => (
                    <motion.button
                      key={item.role}
                      whileHover={{ x: 5 }}
                      className={`${item.color} text-white py-2.5 rounded-lg flex items-center justify-center gap-2 w-full`}
                      onClick={() => setSelectedRole(item.role)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </motion.button>
                  ))}
                </div>
                <button
                  className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg w-full transition-colors"
                  onClick={() => setAddSingleDataOpen(false)}
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Data Entry Form Modal */}
          {selectedRole && addSingleData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white p-6 rounded-xl shadow-xl w-96 border border-gray-100"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Add{" "}
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}{" "}
                  Data
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-between gap-4 pt-2">
                    <button
                      type="button"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg w-full transition-colors"
                      onClick={() => {
                        setSelectedRole("");
                        setAddSingleDataOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg w-full transition-colors"
                    >
                      Add Data
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Upload Modal */}
          {uploadModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white p-6 rounded-xl shadow-xl w-96 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Upload Excel File
                  </h2>
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Category:
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Excel File:
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                          </p>
                          <p className="text-xs text-gray-500">XLSX or XLS</p>
                        </div>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`w-full mt-4 px-4 py-2.5 rounded-lg text-white transition-colors ${
                      isUploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Role Selection Cards */}
          <section className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              List of Selected Role
            </h2>
            <div className="flex justify-center gap-6">
              {[
                {
                  role: "student",
                  label: "Students",
                  icon: FaUserGraduate,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  role: "teacher",
                  label: "Teachers",
                  icon: FaChalkboardTeacher,
                  color: "from-yellow-500 to-yellow-600",
                },
                // { role: "warden", label: "Wardens", icon: FaUserShield, color: "from-red-500 to-red-600" }
              ].map((item) => (
                <motion.div
                  key={item.role}
                  whileHover={{ y: -5 }}
                  className={`cursor-pointer p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-3 w-32 h-32 transition-all ${
                    selectedRoleList === item.role
                      ? `bg-gradient-to-r ${item.color} text-white`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedRoleList(item.role)}
                >
                  <item.icon className="w-8 h-8" />
                  <span className="font-semibold">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Data Table Section */}
          {selectedRoleList && (
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRoleList.charAt(0).toUpperCase() +
                    selectedRoleList.slice(1)}{" "}
                  List
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className={`bg-gradient-to-r text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${
                    selectedRoleList === "student"
                      ? "from-blue-500 to-blue-600"
                      : selectedRoleList === "teacher"
                      ? "from-yellow-500 to-yellow-600"
                      : "from-red-500 to-red-600"
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Download{" "}
                  {selectedRoleList === "student"
                    ? "Students"
                    : selectedRoleList === "teacher"
                    ? "Teachers"
                    : "Wardens"}{" "}
                  Data
                </motion.button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="overflow-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((item, index) => (
                        <tr
                          key={item._id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.email}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isSidebarOpen, to }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-3 hover:bg-[#2C3E6D] rounded-md cursor-pointer transition-colors"
  >
    {icon}
    {isSidebarOpen && <span className="text-lg">{label}</span>}
  </Link>
);

export default AdminDashboard;

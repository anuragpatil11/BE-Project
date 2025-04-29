import React from "react";
import { Link } from "react-router-dom";
import { FaFileUpload, FaClipboardCheck } from "react-icons/fa";
const StudentCompliancesTeacher = () => {
  // Dummy data for teachers assigning compliance to students
  const teachers = [
    {
      id: 1,
      name: "Dr. Sharma",
      assignedCompliances: [
        {
          id: 1,
          student: "John Doe",
          compliance: "Project Report",
          status: "Approved",
        },
        {
          id: 2,
          student: "Alice Johnson",
          compliance: "Lab Records",
          status: "Pending",
        },
      ],
    },
    {
      id: 2,
      name: "Ms. Verma",
      assignedCompliances: [
        {
          id: 3,
          student: "Jane Smith",
          compliance: "Assignment Submission",
          status: "Rejected",
        },
        {
          id: 4,
          student: "John Doe",
          compliance: "Attendance Record",
          status: "Approved",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="bg-[#1A2A4F] text-white w-64 p-4 space-y-6">
        <h2 className="text-xl font-semibold">Teacher Dashboard</h2>
        <nav className="space-y-4">
          <Link
            to="/teacher-dashboard"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <FaClipboardCheck className="w-5 h-5" /> My Compliance
          </Link>
          <Link
            to="/teacher-dashboard/upload-student-compliances"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <FaFileUpload className="w-5 h-5" /> Upload Student Compliance
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">
          Student Compliances Assigned by Teacher
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Teacher Name</th>
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Compliance</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <React.Fragment key={teacher.id}>
                  {teacher.assignedCompliances.map((compliance, index) => (
                    <tr key={compliance.id} className="hover:bg-gray-50">
                      {index === 0 && (
                        <td
                          rowSpan={teacher.assignedCompliances.length}
                          className="py-2 px-4 border-b text-center font-medium"
                        >
                          {teacher.name}
                        </td>
                      )}
                      <td className="py-2 px-4 border-b">
                        {compliance.student}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {compliance.compliance}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            compliance.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : compliance.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {compliance.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentCompliancesTeacher;

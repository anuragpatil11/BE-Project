const Student = require('../models/Student');
const CommonCompliancePdfForStudent = require('../models/CommonCompliancePdfForStudent');
const bcrypt = require('bcrypt');
const StudentComplianceStatus = require('../models/StudentComplianceStatus');
const getAllFiles = async (req, res) => {
    try {
        const [files] = await CommonCompliancePdfForStudent.getAllFiles();
        res.status(200).json({ success: true, files });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: "Failed to fetch files" });
    }
};
const toggleFileStatus = async (req, res) => {
    const { studentId, complianceId } = req.body;

    try {
        // Fetch the current status of the file
        const [file] = await StudentComplianceStatus.getStudentComplianceStatusID(studentId, complianceId);

        if (file.length === 0) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        // console.log(file);
        const currentStatus = file.status;
        // console.log(currentStatus);
        // Check if the current status is "Completed"
        if (currentStatus === 'Completed') {
            return res.status(400).json({ success: false, message: "Cannot toggle status of a completed file" });
        }

        // Determine the new status
        let newStatus;
        if (currentStatus === 'Pending' || currentStatus === 'Rejected') {
            newStatus = 'Waiting For Approve';
        }
        else if (currentStatus === 'Waiting For Approve') {
            newStatus = 'Pending';
        } else {
            return res.status(400).json({ success: false, message: "Invalid current status" });
        }

        // Update the status in the database
        await StudentComplianceStatus.updateStatus(studentId, complianceId, newStatus);

        res.status(200).json({ success: true, message: "Status toggled successfully", newStatus });
    } catch (error) {
        console.error("Error toggling file status:", error);
        res.status(500).json({ success: false, message: "Failed to toggle file status" });
    }
};

const getStudentComplianceByStudentId = async (req, res) => {
    const { studentId } = req.params;

    try {
        const compliances = await StudentComplianceStatus.getStatusByStudent(studentId);
        res.status(200).json({ success: true, compliances });
    } catch (error) {
        console.error("Error fetching student compliances:", error);
        res.status(500).json({ error: "Failed to fetch student compliances" });
    }
}

const getStudent = async (req, res) => {
    try {
        const [students] = await Student.getAllStudents();
        res.status(200).json({ success: true, students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
}
module.exports = { getAllFiles, toggleFileStatus, getStudent, getStudentComplianceByStudentId };
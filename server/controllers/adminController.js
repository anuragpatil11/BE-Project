const uploadExcelFile = require('../utils/uploadExcelFile');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Warden = require('../models/Warden');

// Create specific controllers using the reusable function
const uploadStudentExcelFile = uploadExcelFile(Student);
const uploadTeacherExcelFile = uploadExcelFile(Teacher);
const uploadWardenExcelFile = uploadExcelFile(Warden);

const getAllTeachers = async (req, res) => {
    try {
        const [teachers] = await Teacher.getAllTeachers();
        res.status(200).json({ success: true, teachers });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
}

const getAllWarden = async (req, res) => {
    try {
        const [warden] = await Warden.getAllWardens();
        res.status(200).json({ success: true, warden });
    } catch (error) {
        console.error("Error fetching warden:", error);
        res.status(500).json({ error: "Failed to fetch warden" });
    }
}

module.exports = { uploadStudentExcelFile, uploadTeacherExcelFile, uploadWardenExcelFile ,getAllTeachers,getAllWarden};
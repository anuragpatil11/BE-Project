const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const CommonCompliancePdfForStudent = require('../models/CommonCompliancePdfForStudent');
const StudentComplianceStatus = require('../models/StudentComplianceStatus');
const Student = require('../models/Student');
const nodemailer = require('nodemailer');
const { sendRejectionEmail, sendCompletionEmail } = require('../services/emailService');
const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const filePath = path.join(__dirname, '..', req.file.path);

        // Upload PDF to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw",
            folder: "pdf_uploads"
        });

        // Save file info in the database
        await CommonCompliancePdfForStudent.saveFile(req.file.originalname.replace(/\.pdf$/i, ''), result.secure_url);
        // Delete the local file after upload
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            } else {
                console.log("Local file deleted:", filePath);
            }
        });

        res.status(201).json({ message: 'File uploaded successfully', url: result.secure_url });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

const deleteFile = async (req, res) => {
    try {
        const { compliance_id } = req.params;
        if (!compliance_id) {
            return res.status(400).json({ error: "File ID is required" });
        }

        // Fetch file from DB
        const [files] = await CommonCompliancePdfForStudent.getFileById(compliance_id);
        if (files.length === 0) {
            return res.status(404).json({ error: "File not found" });
        }

        const fileUrl = files[0].url;
        const urlParts = fileUrl.split('/');
        const fileNameWithExt = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params

        // Extract public ID by removing the extension (.pdf)
        let publicId = `pdf_uploads/${fileNameWithExt.replace(/\.pdf$/, '')}`; // Ensure the .pdf extension is removed
        publicId = `${publicId}.pdf`;

        // Delete from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
            type: "upload"
        });

        if (cloudinaryResponse.result !== "ok") {
            return res.status(500).json({ error: "Cloudinary deletion failed" });
        }

        try {
            // Delete records in sequence to maintain referential integrity
            // First delete from StudentComplianceStatus
            await StudentComplianceStatus.deleteByComplianceId(compliance_id);

            // Then delete from CommonCompliancePdfForStudent
            await CommonCompliancePdfForStudent.deleteFile(compliance_id);

            res.status(200).json({
                success: true,
                message: "File and associated compliance statuses deleted successfully"
            });
        } catch (dbError) {
            console.error("Database deletion error:", dbError);
            // Since Cloudinary deletion succeeded but database deletion failed,
            // we should inform the user of the partial success
            res.status(500).json({
                error: "File deleted from storage but database cleanup failed",
                details: dbError.message
            });
        }

    } catch (error) {
        console.error("Error in deletion process:", error);
        res.status(500).json({
            error: "Failed to delete file and associated compliance statuses",
            details: error.message
        });
    }
};

/* 
const updateFileStatus = async (req, res) => {
    const { status, studentId, compliance_id, note } = req.body;
    
    // Validate the status
    const allowedStatuses = ['Pending', 'Completed', 'Waiting For Approve', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status provided" });
    }
  
    try {
      // Fetch the file to ensure it exists
      const [file] = await StudentComplianceStatus.getStudentComplianceStatusID(studentId, compliance_id);
  
      if (file.length === 0) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
  
      // Update the status in the database
      await StudentComplianceStatus.updateStudentComplianceStatus(studentId, compliance_id, status);
  
      // Get student email from database (assuming you have a method for this)
      const [student] = await Student.getStudentById(studentId);
      const studentEmail = student.email;
      
      // Get compliance name (assuming you have this method)
      const [compliance] = await Compliance.getComplianceById(compliance_id);
      const complianceName = compliance.name;
  
      // Send email based on status
      if (status === 'Rejected') {
        await sendRejectionEmail(studentEmail, complianceName, note);
      } else if (status === 'Completed') {
        await sendCompletionEmail(studentEmail, complianceName);
      }
  
      res.status(200).json({ success: true, message: "Status updated successfully", newStatus: status });
    } catch (error) {
      console.error("Error updating file status:", error);
      res.status(500).json({ success: false, message: "Failed to update file status" });
    }
}; 

*/

const updateFileStatus = async (req, res) => {
    // const { studentId } = req.params;
    const { status, studentId, compliance_id, complianceName, studentEmail, note } = req.body;
    // console.log(studentId, status);
    // Validate the status
    const allowedStatuses = ['Pending', 'Completed', 'Waiting For Approve', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status provided" });
    }

    try {
        // Fetch the file to ensure it exists
        const [file] = await StudentComplianceStatus.getStudentComplianceStatusID(studentId, compliance_id);

        if (file.length === 0) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        if (status === 'Rejected') {
            await StudentComplianceStatus.updateStudentComplianceStatus(studentId, compliance_id, status);
            await sendRejectionEmail(studentEmail, complianceName, note);
            // Update the status in the database
        }
        else if (status === 'Completed') {
            await StudentComplianceStatus.updateStudentComplianceStatus(studentId, compliance_id, status);
            await sendCompletionEmail(studentEmail, complianceName);
        }
        res.status(200).json({ success: true, message: "Status updated successfully", newStatus: status });
    } catch (error) {
        console.error("Error updating file status:", error);
        res.status(500).json({ success: false, message: "Failed to update file status" });
    }
};
const createCompliance = async (req, res) => {
    try {
        // Extract data from request body
        const { complianceId, due_date, emailSubject, emailText } = req.body;

        // Validate input
        if (!complianceId || !due_date) {
            return res.status(400).json({
                error: 'Both complianceId and due_date are required'
            });
        }

        // Validate date format (DD-MM-YYYY)
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        if (!dateRegex.test(due_date)) {
            return res.status(400).json({
                error: 'Invalid date format. Please use DD-MM-YYYY format (e.g., 03-03-2025)'
            });
        }

        // Convert date from DD-MM-YYYY to YYYY-MM-DD for database
        const [day, month, year] = due_date.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        // Fetch name and URL for the compliance
        const data = await CommonCompliancePdfForStudent.getNameAndUrl(complianceId);
        if (!data?.[0]?.[0]) {
            return res.status(404).json({
                error: `Compliance with ID ${complianceId} not found`
            });
        }
        const { name, url } = data[0][0];

        // Fetch all student IDs
        const studentIds = await Student.getAllStudentIds();
        console.log("Student ID", studentIds)
        if (!studentIds?.length) {
            return res.status(404).json({
                error: 'No students found in the system'
            });
        }
        // Fetch all students with their emails
        const students = await Student.getAllStudents();
        console.log("Students fetched from DB:", students); // Debugging

        // Extract the first array (actual student data)
        const studentList = students[0] || [];

        if (!studentList.length) {
            return res.status(404).json({ error: 'No students found in the system' });
        }

        // Ensure valid emails are extracted
        const studentEmails = studentList
            .map(student => student?.email?.trim())  // Ensure email exists and trim whitespace
            .filter(email => email && email.includes('@')); // Validate email format

        console.log("Students email", studentEmails);

        if (studentEmails.length === 0) {
            return res.status(500).json({ error: "No valid student emails found." });
        }


        // Initialize status for all students
        await StudentComplianceStatus.initializeStatusForAllStudents(
            complianceId,
            studentIds,
            url,
            name,
            formattedDate
        );

        await sendEmailsToStudents(studentEmails, name, due_date, url, emailSubject, emailText);
        return res.status(201).json({
            success: true,
            complianceId: complianceId,
            message: "Compliance created and email notifications sent."
        });
    } catch (error) {
        console.error("Error in createCompliance:", error);
        return res.status(500).json({
            error: 'Failed to create compliance',
            details: error.message
        });
    }
};
// Function to send emails with dynamic/default content
const sendEmailsToStudents = async (emails, complianceName, dueDate, complianceUrl, emailSubject, emailText) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const defaultSubject = `New Compliance Assigned: ${complianceName}`;

    // HTML email template with inline CSS for better email client compatibility
    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${complianceName} Compliance Assignment</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
                <!-- Header -->
                <div style="background-color: #0066cc; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Compliance Assignment</h1>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        Dear Student,
                    </p>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        A new compliance document has been assigned to you:
                    </p>
                    
                    <!-- Compliance Details Box -->
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0066cc; padding: 15px; margin-bottom: 20px;">
                        <p style="margin: 0 0 10px 0; color: #333333;">
                            <strong>Document:</strong> ${complianceName}
                        </p>
                        <p style="margin: 0 0 10px 0; color: #333333;">
                            <strong>Due Date:</strong> ${dueDate}
                        </p>
                    </div>
                    
                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${complianceUrl}" style="background-color: #0066cc; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Access Document
                        </a>
                    </div>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        Please ensure that you complete this compliance document before the deadline.
                    </p>
                    
                    <!-- Footer -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                        <p style="color: #666666; font-size: 14px; margin: 0;">
                            Best Regards,<br>
                            <strong>KL Rahul</strong>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emails.join(','),
        subject: emailSubject || defaultSubject,
        html: emailText || htmlTemplate, // Use provided HTML or default template
        // Including a text version for email clients that don't support HTML
        text: `New Compliance Assignment: ${complianceName}
              Due Date: ${dueDate}
              Access Document: ${complianceUrl}
              
              Please complete this compliance document before the deadline.
              
              Best Regards,
              KL Rahul`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Emails sent successfully!");
    } catch (error) {
        console.error("Error sending emails:", error);
    }
};

const getAllStudentCompliances = async (req, res) => {
    try {
        const students = await StudentComplianceStatus.getAllStudentCompliances();
        res.status(200).json({
            success: true,
            students,
            total_students: students.length,
            total_compliances: students.reduce((sum, student) =>
                sum + student.compliances.length, 0
            )
        });
    } catch (error) {
        console.error("Error fetching student compliances:", error);
        res.status(500).json({ error: "Failed to fetch student compliances" });
    }
}
module.exports = { uploadFile, deleteFile, updateFileStatus, createCompliance, getAllStudentCompliances };
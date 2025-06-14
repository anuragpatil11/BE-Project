const db = require("../config/db");
const { deleteStudent } = require("./Student");

// Create table if not exists
const createTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS StudentSubmittedCompliance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        complianceName VARCHAR(255) NOT NULL,
        student_id INT NOT NULL,
        warden_id INT DEFAULT NULL,
        compliance_pdf_url VARCHAR(2083) NOT NULL,
        status ENUM('Pending', 'Completed', 'Rejected') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (warden_id) REFERENCES Warden(id) ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    // console.log("StudentSubmittedCompliance table ensured");
  } catch (error) {
    console.error("Error creating StudentSubmittedCompliance table:", error);
  }
};

createTable();

module.exports = {
  // Create a new submission
  submitCompliance: async (complianceName, studentId, compliancePdfUrl) => {
    if (!studentId || !compliancePdfUrl || !complianceName) {
      throw new Error(
        "Student ID, Compliance PDF URL, and Compliance Name are required."
      );
    }
    await db.execute(
      `INSERT INTO StudentSubmittedCompliance (complianceName, student_id, compliance_pdf_url) VALUES (?, ?, ?)`,
      [complianceName, studentId, compliancePdfUrl]
    );
  },

  // Update status and optionally assign a warden
  updateStatusAndWarden: async (submissionId, status, wardenId = null) => {
    const allowedStatuses = ["Pending", "Completed", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      throw new Error(
        `Invalid status: ${status}. Allowed statuses are ${allowedStatuses.join(", ")}.`
      );
    }
  
    if (status === "Completed") {
      // Set completed_at to current timestamp when completed
      await db.execute(
        `UPDATE StudentSubmittedCompliance 
         SET status = ?, warden_id = ?, updated_at = CURRENT_TIMESTAMP, completed_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [status, wardenId, submissionId]
      );
    } else {
      // Clear completed_at if not completed
      await db.execute(
        `UPDATE StudentSubmittedCompliance 
         SET status = ?, warden_id = ?, updated_at = CURRENT_TIMESTAMP, completed_at = NULL 
         WHERE id = ?`,
        [status, wardenId, submissionId]
      );
    }
  },
  

  // Get all submissions by a student
  getSubmissionsByStudent: async (studentId) => {
    const [rows] = await db.execute(
      `SELECT * FROM StudentSubmittedCompliance WHERE student_id = ? ORDER BY created_at DESC`,
      [studentId]
    );
    return rows;
  },
  // Delete a submission
  deleteSubmission: async (submissionId) => {
    await db.execute(`DELETE FROM StudentSubmittedCompliance WHERE id = ?`, [
      submissionId,
    ]);
  },
  getFileById: async (id) => {
    return await db.execute(
      `SELECT * FROM StudentSubmittedCompliance WHERE id = ?`,
      [id]
    );
  },
getAllSubmissionsWithStudentAndWardenName: async () => {
  const [rows] = await db.execute(
    `SELECT
       S.id AS studentId,
       SSC.id,
       SSC.complianceName,
       SSC.compliance_pdf_url,
       SSC.status,
       SSC.created_at,
       SSC.completed_at,
       S.name AS studentName,
       S.email AS studentEmail,
       W.name AS wardenName
     FROM StudentSubmittedCompliance SSC
     JOIN Student S ON SSC.student_id = S.id
     LEFT JOIN Warden W ON SSC.warden_id = W.id
     ORDER BY SSC.created_at DESC`
  );

  const studentMap = new Map();

  for (const entry of rows) {
    const {
      studentId,
      studentName,
      studentEmail,
      id,
      complianceName,
      compliance_pdf_url,
      status,
      created_at,
      completed_at,
      wardenName
    } = entry;

    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        studentId,
        studentName,
        studentEmail,
        compliances: []
      });
    }

    studentMap.get(studentId).compliances.push({
      id,
      complianceName,
      compliance_pdf_url,
      status,
      created_at,
      completed_at,
      wardenName
    });
  }

  return Array.from(studentMap.values());
},
  deleteStudentSubmissions: async (studentId) => {
    if (!studentId) {
      throw new Error("Student ID is required.");
    }
    // Delete all submissions for the student
    await db.execute(
      `DELETE FROM StudentSubmittedCompliance WHERE student_id = ?`,
      [studentId]
    );
    
    // Optionally, delete the student record itself
    await deleteStudent(studentId);
  }  
};

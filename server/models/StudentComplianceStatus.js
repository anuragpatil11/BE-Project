const db = require('../config/db');

// Function to create the table if it does not exist
const createTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS StudentComplianceStatus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        compliance_id INT NOT NULL,
        urlOfCompliance VARCHAR(2083) NOT NULL,
        name VARCHAR(255) NOT NULL,
        status ENUM('Pending', 'Completed', 'Waiting For Approve', 'Rejected') DEFAULT 'Pending',
        completed_at TIMESTAMP NULL,
        due_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (compliance_id) REFERENCES CommonCompliancePdfForStudent(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
  } catch (error) {
    console.error("❌ Error creating table:", error);
  }
};

createTable();

// Student Compliance Status (Individual tracking)
module.exports = {
  // Initialize status for all students when a new compliance is added
  initializeStatusForAllStudents: async (complianceId, studentIds, urlOfCompliance, name, due_date) => {
    if (!complianceId || !studentIds || !urlOfCompliance || !name || !due_date) {
      throw new Error("All parameters are required.");
    }
    if (studentIds.length === 0) {
      console.log("No students to initialize.");
      return;
    }
    const values = studentIds.map((studentId) => [studentId, complianceId, urlOfCompliance, name, due_date]);
    await db.query(
      'INSERT INTO StudentComplianceStatus (student_id, compliance_id, urlOfCompliance, name, due_date) VALUES ?',
      [values]
    );
  },

  // Update a student's compliance status
  updateStatus: async (studentId, complianceId, status) => {
    const allowedStatuses = ['Pending', 'Completed', 'Waiting For Approve', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Allowed values are ${allowedStatuses.join(', ')}.`);
    }
    const completedAt = status === 'Completed' ? new Date() : null;
    await db.execute(
      'UPDATE StudentComplianceStatus SET status = ?, completed_at = ? WHERE student_id = ? AND compliance_id = ?',
      [status, completedAt, studentId, complianceId]
    );
  },

  // Get compliance status for a student
  getStatusByStudent: async (studentId) => {
    if (!studentId) {
      throw new Error("Student ID is required.");
    }
    const [rows] = await db.execute(
      `SELECT 
        c.id AS compliance_id,
        c.name,
        c.url,
        s.status,
        s.completed_at,
        s.due_date,
        s.created_at
      FROM StudentComplianceStatus s
      INNER JOIN CommonCompliancePdfForStudent c 
        ON c.id = s.compliance_id
      WHERE s.student_id = ?`,
      [studentId]
    );
    return rows;
  },
  getAllStudentCompliances: async () => {
    const [rows] = await db.execute(
      `SELECT 
        s.id AS StudentComplianceStatus_ID,
        s.student_id,
        s.compliance_id,
        s.urlOfCompliance,
        s.name AS compliance_name,
        s.status,
        s.completed_at,
        s.due_date,
        s.created_at,
        st.name AS student_name,
        st.email AS student_email
      FROM StudentComplianceStatus s
      LEFT JOIN Student st 
        ON s.student_id = st.id
      ORDER BY s.created_at DESC`
    );

    // Group by student
    const groupedByStudent = rows.reduce((acc, curr) => {
      // Create a unique key for each student
      const studentKey = curr.student_id;

      if (!acc[studentKey]) {
        // Initialize student object if it doesn't exist
        acc[studentKey] = {
          student_id: curr.student_id,
          student_name: curr.student_name,
          student_email: curr.student_email,
          compliances: []
        };
      }

      // Add compliance data
      acc[studentKey].compliances.push({
        compliance_id: curr.compliance_id,
        StudentComplianceStatus_ID: curr.StudentComplianceStatus_ID,
        urlOfCompliance: curr.urlOfCompliance,
        compliance_name: curr.compliance_name,
        status: curr.status,
        completed_at: curr.completed_at,
        due_date: curr.due_date,
        created_at: curr.created_at
      });

      return acc;
    }, {});

    // Convert to array format
    return Object.values(groupedByStudent);
  },
  getStudentComplianceStatusID: async (studentId, complianceId) => {
    if (!studentId || !complianceId) {
      throw new Error("Student ID and Compliance ID are required.");
    }
    const [rows] = await db.execute(
      `SELECT * FROM StudentComplianceStatus WHERE student_id = ? AND compliance_id = ?`,
      [studentId, complianceId]
    );
    return rows;
  },

  updateStudentComplianceStatus: async (studentId, complianceId, status) => {
    const allowedStatuses = ['Pending', 'Completed', 'Waiting For Approve', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Allowed values are ${allowedStatuses.join(', ')}.`);
    }
    const completedAt = status === 'Completed' ? new Date() : null;
    await db.execute(
      'UPDATE StudentComplianceStatus SET status = ?, completed_at = ? WHERE student_id = ? AND compliance_id = ?',
      [status, completedAt, studentId, complianceId]
    );
  },
  deleteByComplianceId: async (complianceId) => {
    try {
      const query = 'DELETE FROM StudentComplianceStatus WHERE compliance_id = ?';
      const [result] = await db.execute(query, [complianceId]);
      return result;
    } catch (error) {
      console.error('Error in deleteByComplianceId:', error);
      throw error;
    }
  }
};

const db = require('../config/db');

// Function to create the table if it does not exist
const createTable = async () => {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS CommonCompliancePdfForStudent (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url VARCHAR(2083) NOT NULL,
                status ENUM('Pending', 'Completed', 'Waiting For Approve', 'Rejected') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (error) {
        console.error("❌ Error creating table:", error);
    }
};


createTable();

// Exported functions for database operations
module.exports = {
    saveFile: async (name, url, status = 'Pending') => {
        try {
            const [rows] = await db.execute(
                `INSERT INTO CommonCompliancePdfForStudent (name, url, status) VALUES (?, ?, ?)`,
                [name, url, status]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    },
    getFileById: async (id) => {
        return await db.execute(`SELECT * FROM CommonCompliancePdfForStudent WHERE id = ?`, [id]);
    },
    getAllFiles: async () => {
        return await db.execute(`SELECT * FROM CommonCompliancePdfForStudent`);
    },
    deleteFile: async (id) => {
        return await db.execute(`DELETE FROM CommonCompliancePdfForStudent WHERE id = ?`, [id]);
    },
    updateFileStatus: async (id, status) => {
        try {
            const [rows] = await db.execute(
                `UPDATE CommonCompliancePdfForStudent SET status = ? WHERE id = ?`,
                [status, id]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    },
    getNameAndUrl : async (id) => {
        return await db.execute(`SELECT name,url FROM CommonCompliancePdfForStudent WHERE id = ?`, [id]);
    }
};




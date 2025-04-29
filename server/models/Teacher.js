const db = require('../config/db');
const bcrypt = require('bcrypt');

class Teacher {
    static async ensureTableExists() {
            // Create Student table if it doesn't exist
            await db.query(`
                CREATE TABLE IF NOT EXISTS Teacher (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL
                )
            `);
    }

    static async create(Teacher) {
        await this.ensureTableExists();
        const { name, email, password } = Teacher;

        // Hash the password
        const saltRounds = 10; // Number of salt rounds for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the Teacher with the hashed password
        const [result] = await db.query(
            'INSERT INTO Teacher (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    }

    static async bulkCreate(Teachers) {
        await this.ensureTableExists();
        const query = 'INSERT INTO Teacher (name, email, password) VALUES ?';

        // Hash passwords for all Teachers
        const hashedTeachers = await Promise.all(
            Teachers.map(async (Teacher) => {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(Teacher.password, saltRounds);
                return [Teacher.name, Teacher.email, hashedPassword];
            })
        );

        // Insert all Teachers with hashed passwords
        const [result] = await db.query(query, [hashedTeachers]);
        return result.affectedRows;
    }

    // New method: Find a Teacher by email
    static async findByEmail(email) {
        await this.ensureTableExists();
        const [rows] = await db.query('SELECT * FROM Teacher WHERE email = ?', [email]);
        return rows[0]; // Return the first matching Teacher
    }
    static async getAllTeachers() {
        return await db.query('SELECT id, name, email FROM Teacher');
    }
}

module.exports = Teacher;
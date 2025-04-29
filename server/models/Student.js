const db = require('../config/db');
const bcrypt = require('bcrypt');

class Student {
    static async ensureTableExists() {
        // Create Student table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS Student (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
    }

    static async create(student) {
        await this.ensureTableExists();
        const { name, email, password } = student;
        // Hash the password
        const saltRounds = 10; // Number of salt rounds for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the student with the hashed password
        const [result] = await db.query(
            'INSERT INTO Student (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    }

    static async bulkCreate(students) {
        await this.ensureTableExists();
        const query = 'INSERT INTO Student (name, email, password) VALUES ?';

        // Hash passwords for all students
        const hashedStudents = await Promise.all(
            students.map(async (student) => {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(student.password, saltRounds);
                return [student.name, student.email, hashedPassword];
            })
        );

        // Insert all students with hashed passwords
        const [result] = await db.query(query, [hashedStudents]);
        return result.affectedRows;
    }

    // New method: Find a student by email
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM Student WHERE email = ?', [email]);
        return rows[0]; // Return the first matching student
    }

    static async getAllStudents() {
        return await db.query('SELECT id, name, email FROM Student');
    }

    static async getAllStudentIds() {
        const [rows] = await db.query('SELECT id FROM Student');
        return rows.map((row) => row.id);
    }
}

module.exports = Student;
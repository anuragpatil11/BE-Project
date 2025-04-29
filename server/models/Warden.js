const db = require('../config/db');
const bcrypt = require('bcrypt');

class Warden {
     static async ensureTableExists() {
                // Create Student table if it doesn't exist
                await db.query(`
                    CREATE TABLE IF NOT EXISTS Warden (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL
                    )
                `);
        }
    static async create(Warden) {
        await this.ensureTableExists();
        const { name, email, password } = Warden;

        // Hash the password
        const saltRounds = 10; // Number of salt rounds for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the Warden with the hashed password
        const [result] = await db.query(
            'INSERT INTO Warden (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    }

    static async bulkCreate(Wardens) {
        await this.ensureTableExists();
        const query = 'INSERT INTO Warden (name, email, password) VALUES ?';

        // Hash passwords for all Wardens
        const hashedWardens = await Promise.all(
            Wardens.map(async (Warden) => {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(Warden.password, saltRounds);
                return [Warden.name, Warden.email, hashedPassword];
            })
        );

        // Insert all Wardens with hashed passwords
        const [result] = await db.query(query, [hashedWardens]);
        return result.affectedRows;
    }

    // New method: Find a Warden by email
    static async findByEmail(email) {
        await this.ensureTableExists();
        const [rows] = await db.query('SELECT * FROM Warden WHERE email = ?', [email]);
        return rows[0]; // Return the first matching Warden
    }
    static async getAllWardens() {
        return await db.query('SELECT id, name, email FROM Warden');
    }
}

module.exports = Warden;
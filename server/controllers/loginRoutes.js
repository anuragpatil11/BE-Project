const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Warden = require('../models/Warden');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const student = await Student.findByEmail(email);
        const teacher = await Teacher.findByEmail(email);
        const warden = await Warden.findByEmail(email);

        let user = null;
        let table = null;

        if (student && (await bcrypt.compare(password, student.password))) {
            user = student;
            table = 'Student';
        } else if (teacher && (await bcrypt.compare(password, teacher.password))) {
            user = teacher;
            table = 'Teacher';
        } else if (warden && (await bcrypt.compare(password, warden.password))) {
            user = warden;
            table = 'Warden';
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: table }, // Payload
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' } // Token expiration
        );

        // Exclude password from response
        const { password: _, ...userData } = user;

        res.status(200).json({ table, user: userData, token });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { loginUser };

const express = require('express');
const { loginUser } = require('../controllers/loginRoutes');
const router = express.Router();

// Student login route
router.post('/login', loginUser);

module.exports = router;
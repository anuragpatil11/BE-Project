const express = require('express');
const upload = require('../config/multerConfig');
const { summarizePDF } = require('../controllers/summarizeController');

const router = express.Router();

router.post('/', upload.single('file'), summarizePDF);


module.exports = router;

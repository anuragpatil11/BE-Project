const {convertTableIntoExcel} = require('../controllers/downloadExelFile');
const express = require('express');
const router = express.Router();

router.post('/convertTableIntoExcel',convertTableIntoExcel);

module.exports = router;
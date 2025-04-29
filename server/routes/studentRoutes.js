const express = require('express');
const { getAllFiles,toggleFileStatus,getStudent ,getStudentComplianceByStudentId} = require('../controllers/studentController');
const router = express.Router();


router.get('/getAllFiles', getAllFiles);
router.post('/toggleFileStatus', toggleFileStatus);
router.get('/getStudent', getStudent);
router.get('/getStudentComplianceByStudentId/:studentId', getStudentComplianceByStudentId);

module.exports = router;
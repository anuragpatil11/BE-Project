const express = require('express');
const upload = require('../middleware/upload');
const { uploadFile,deleteFile,updateFileStatus ,createCompliance,getAllStudentCompliances} = require('../controllers/wardenController');

const router = express.Router();

router.post('/upload/pdf', upload.single('file'), uploadFile);

router.delete('/delete/pdf/:compliance_id', deleteFile);
router.put('/files/update-status', updateFileStatus);

router.post('/create-compliance', createCompliance);

router.get('/get-all-student-compliances', getAllStudentCompliances);
module.exports = router;

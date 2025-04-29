const multer = require('multer');

module.exports = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ success: false, error: 'File upload error: ' + error.message });
    }
    res.status(500).json({ success: false, error: error.message });
};
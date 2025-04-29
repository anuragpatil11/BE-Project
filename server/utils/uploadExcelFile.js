const xlsx = require('xlsx');
const fs = require('fs');

const uploadExcelFile = (Model) => async (req, res) => {
    try {
        if (!req.file) {
            // console.log("student")
            const { name, email, password } = req.body;
            await Model.create({ name, email, password });
            return res.status(200).json({ message: `Record inserted successfully` });
        }

        // Read the uploaded Excel file
        // console.log("file aa gya gru")
        const workbook = xlsx.readFile(req.file.path);
        // console.log(workbook)
        const sheetName = workbook.SheetNames[0];
        // console.log(sheetName)
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        // console.log(data)

        // Insert data into the database
        const result = await Model.bulkCreate(data);

        // Delete the uploaded file after successful insertion
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Failed to delete file:', err.message);
            } else {
                console.log('File deleted successfully:', req.file.path);
            }
        });

        res.status(200).json({ message: `${result} records inserted successfully` });
    } catch (error) {
        // Delete the uploaded file if an error occurs
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Failed to delete file:', err.message);
                } else {
                    console.log('File deleted successfully:', req.file.path);
                }
            });
        }

        res.status(500).json({ error: error.message });
    }
};

module.exports = uploadExcelFile;
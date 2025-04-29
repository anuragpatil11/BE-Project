const pool = require('../config/db'); // Adjust the path as needed
const ExcelJS = require('exceljs');

const convertTableIntoExcel = async (req, res) => {
  try {
    const { query, tableName, fileName, columns } = req.body;

    if (!query && !tableName) {
      return res.status(400).json({ error: 'Either SQL query or table name is required' });
    }

    // Get a connection from the pool
    const connection = await pool.getConnection();

    let sqlQuery = query;
    if (!query && tableName) {
      sqlQuery = columns && Array.isArray(columns) && columns.length > 0
        ? `SELECT ${columns.join(', ')} FROM ${tableName}`
        : `SELECT * FROM ${tableName}`;
    }

    const [rows] = await connection.execute(sqlQuery);
    connection.release(); // Release the connection back to the pool

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    if (rows.length === 0) {
      worksheet.addRow(['No data found']);
    } else {
      const headers = Object.keys(rows[0]);
      worksheet.addRow(headers).font = { bold: true };
      
      rows.forEach(row => worksheet.addRow(headers.map(header => row[header])));
      
      worksheet.columns.forEach(column => {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, cell => {
          if (cell.value) {
            maxLength = Math.max(maxLength, cell.value.toString().length);
          }
        });
        column.width = maxLength + 2;
      });
    }

    const excelFileName = fileName || `${tableName || 'data'}_export.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${excelFileName}`);

    await workbook.xlsx.write(res);
    res.end(); // Ensure the response is properly finished
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during conversion', details: error.message });
  }
};

module.exports = { convertTableIntoExcel };

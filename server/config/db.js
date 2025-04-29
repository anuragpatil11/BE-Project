const mysql = require('mysql2');
require('dotenv').config();

const createDatabaseIfNotExists = async () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.message);
      return;
    }

    console.log('Connected to MySQL server.');

    // Create database if it does not exist
    connection.query(`CREATE DATABASE IF NOT EXISTS BEProject`, (err) => {
      if (err) {
        console.error('Error creating database:', err.message);
      } else {
        console.log('Database "BEProject" is ready.');
      }
      connection.end(); // Close the connection after executing the query
    });
  });
};

// Ensure the database exists before creating a pool
createDatabaseIfNotExists();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'BEProject', // Use the created database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Listen for the 'connection' event (successful connection)
pool.on('connection', (connection) => {
  console.log('Database connected successfully!');
});

// Listen for the 'error' event (connection error)
pool.on('error', (err) => {
  console.error('Failed to connect to the database:', err.message);
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting connection from pool:', err.message);
  } else {
    console.log('Successfully acquired connection from pool.');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise(); // Use promises for async/await

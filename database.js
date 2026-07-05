require("dotenv").config();
const mysql = require('mysql');

const con = mysql.createConnection({
    connectionLimit: 10, // Maximum number of connections in the pool
    host: process.env.DB_HOST,   // MySQL database host
    user: process.env.DB_USER,    // MySQL database username
    password: process.env.DB_PASSWORD, // MySQL database password
    database: process.env.DB_NAME // MySQL database name
});

con.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
        return;
    }
    console.log('Connected to MySQL database');
});

/*con.query("SELECT * FROM login_details", (error, results, fields) => {
    if (error) {
        console.error('Error executing query:', error);
        return;
    }
    console.log('Query results:', results);
});*/


module.exports = con;
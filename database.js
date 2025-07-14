const mysql = require('mysql');

const con = mysql.createConnection({
    connectionLimit: 10, // Maximum number of connections in the pool
    host: 'localhost',   // MySQL database host
    user: 'zufshan',    // MySQL database username
    password: 'mealbookapp', // MySQL database password
    database: 'mealbook' // MySQL database name
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
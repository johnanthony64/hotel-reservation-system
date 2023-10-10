const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your-username',
  password: 'your-password',
  database: 'hotel_database'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});

module.exports = connection;

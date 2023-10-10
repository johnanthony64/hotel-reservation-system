const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

// Middleware for parsing POST requests
app.use(bodyParser.json());

app.post('/search', (req, res) => {
  const { checkInDate, checkOutDate, roomType, occupancy } = req.body;

  // Data validation can be done here. For example:
  if (!checkInDate || !checkOutDate || !roomType || !occupancy) {
    return res.status(400).send({ error: 'Invalid input' });
  }

  const query = `
    SELECT * FROM rooms 
    WHERE room_type = ? 
    AND occupancy = ?
    AND id NOT IN (
      SELECT room_id FROM reservations 
      WHERE (check_in_date BETWEEN ? AND ?) 
      OR (check_out_date BETWEEN ? AND ?)
    )
  `;

  // Using prepared statements to prevent SQL injection
  db.query(query, [roomType, occupancy, checkInDate, checkOutDate, checkInDate, checkOutDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'Database error' });
    }

    res.send(results);
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

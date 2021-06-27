const express = require('express');
const router = express();

// database connection =============================
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Get a list of all time entries
router.get('/time-entry', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
  }
  catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

// Get a time entry by unique id
router.get('/time-entry/:id', (req, res) => {

});

// Create a new time entry
router.post('/time-entry', (req, res) => {

});

module.exports = router;

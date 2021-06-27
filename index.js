const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

// database connection =============================
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

// routes =============================================
app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => res.render('pages/index'));
// app.get('/db', async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM test_table');
//     const results = { 'results': (result) ? result.rows : null};
//     res.render('pages/db', results );
//     client.release();
//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// });


// app.use('/api', require('./server/routes'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

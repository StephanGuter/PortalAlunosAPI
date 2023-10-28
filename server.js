import express from 'express'
import pg  from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express();

const { Pool } = pg

const pool = new Pool({
    user: process.env.RDS_USER,
    host: process.env.RDS_HOST,
    database: process.env.RDS_SCHEMA,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    ssl: {
        rejectUnauthorized: false
    },
})

app.get('/courses', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM course');
      client.release();
  
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

const { SERVER_PORT: port = 80 } = process.env;

app.listen({ port }, () => {
  console.log(`🚀 Server ready on port ${port}`);
});
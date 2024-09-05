const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,  // Allows self-signed certificates
    }
});
pool.connect()
    .then(client => {
        console.log('Database connected successfully');
        client.release();
    })
    .catch(err => console.error('Database connection error:', err.message));

module.exports = pool;
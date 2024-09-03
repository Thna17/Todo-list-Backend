const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5001;  // Use the PORT provided by Render

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Pool Setup
const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DATABASE || 'todos',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'Mybirthday17072004'
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
})();

// Route to fetch all todos
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos');
        console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle POST request to create a new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const result = await pool.query(
            'INSERT INTO todos (title, description, status) VALUES ($1, $2, $3) RETURNING *',
            [title, description, status]
        );

        res.status(201).json({
            status: 'success',
            data: {
                result: result.rows[0]
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch a single todo by ID
app.get('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM todos WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                result: result.rows[0]
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle PATCH request to update a todo
app.patch('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const result = await pool.query(
            'UPDATE todos SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
            [title, description, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                result: result.rows[0]
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle DELETE request to delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

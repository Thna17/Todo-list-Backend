const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Pool Setup
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'todos',
    user: 'postgres',
    password: 'Mybirthday17072004'
});

// Route to fetch all users
app.get('/api/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos');
        console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
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

app.get('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const result = await pool.query(
        'SELECT * FROM todos WHERE id = $1',
        [id]
    );
    console.log(result);
    res.status(200).json({
        status: 'success',
        data: {
            result: result.rows[0]
        }
    })

})

// Route to handle PUT request to update a todo
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
        })
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle DELETE request to delete a todo
app.delete('/api/todos/:id', (req, res) => {
    try {
        const { id } = req.params;
        pool.query(
            'DELETE FROM todos WHERE id = $1',
            [id]
        )
        res.status(204).json({
            status: 'success',
            data: {
                result: null
            }
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


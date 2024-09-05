const pool = require('../config/db');

const getAllTodos = async () => {
    const result = await pool.query('SELECT * FROM todos');
    return result.rows;
};

const createTodos = async (title, description, status) => {
    const result = await pool.query(
        'INSERT INTO todos (title, description, status) VALUES ($1, $2, $3) RETURNING *',
        [title, description, status]
    )
    return result.rows[0];
}

const deleteTodo = async (id) => {
    await pool.query("DELETE FROM todos WHERE id = $1", [id])
}

module.exports = { getAllTodos, createTodos, deleteTodo }
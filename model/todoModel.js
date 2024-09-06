const pool = require('../config/db');

const getAllTodos = async () => {
    // In your backend controller for fetching todos
    const { userId } = req.params; // Get userId from token payload

    const result = await pool.query(
        'SELECT * FROM todos WHERE user_id = $1',
        [userId]
    );
    return result.rows;
};

const createTodos = async (title, description, status, userId) => {
    const result = await pool.query(
        'INSERT INTO todos (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, status, userId]
    );
    return result.rows[0];
}

const deleteTodo = async (id) => {
    await pool.query("DELETE FROM todos WHERE id = $1", [id])
}

module.exports = { getAllTodos, createTodos, deleteTodo }
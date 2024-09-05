const pool = require('../config/db'); 
const todo = require('../model/todoModel')
// Route to fetch all todos
exports.getAllTodos = async (req, res, next) => {
    try {
        const result = await todo.getAllTodos();
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.createTodos = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        const result = await todo.createTodos(title, description, status)
        res.status(201).json(result[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// // Route to handle POST request to create a new todo
// app.post('/api/todos', async (req, res) => {
//     try {
//         const { title, description, status } = req.body;

//         const result = await pool.query(
//             'INSERT INTO todos (title, description, status) VALUES ($1, $2, $3) RETURNING *',
//             [title, description, status]
//         );

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 result: result.rows[0]
//             }
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Route to fetch a single todo by ID
// app.get('/api/todos/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const result = await pool.query(
//             'SELECT * FROM todos WHERE id = $1',
//             [id]
//         );
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Todo not found' });
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 result: result.rows[0]
//             }
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Route to handle PATCH request to update a todo
// app.patch('/api/todos/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, description, status } = req.body;
//         const result = await pool.query(
//             'UPDATE todos SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
//             [title, description, status, id]
//         );
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Todo not found' });
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 result: result.rows[0]
//             }
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

exports.deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        await todo.deleteTodo(id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// // Route to handle DELETE request to delete a todo
// app.delete('/api/todos/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await pool.query('DELETE FROM todos WHERE id = $1', [id]);
//         res.status(204).json({
//             status: 'success',
//             data: null
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
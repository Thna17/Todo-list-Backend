const express = require('express');
const todoControllers = require('../controller/todoController.js');
const { getAllTodos, createTodos,deleteTodo } = todoControllers;
const { authMiddleware } = require('../middleware/Auth');

const router = express.Router();

router.route('/').get(authMiddleware, getAllTodos).post(authMiddleware, createTodos);
router.route('/:id').delete(deleteTodo);

module.exports = router;
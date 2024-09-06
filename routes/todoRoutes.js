const express = require('express');
const todoControllers = require('../controller/todoController.js');
const { getAllTodos, createTodo ,deleteTodo } = todoControllers;
const authenticateToken = require('../middleware/authenticateToken');


const router = express.Router();

router.route('/').get(authenticateToken, getAllTodos);
router.route('/').post(authenticateToken, createTodo);
router.route('/:id').delete(deleteTodo);

module.exports = router;
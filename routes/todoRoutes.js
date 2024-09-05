const express = require('express');
const todoControllers = require('../controller/todoController.js');
const { getAllTodos, createTodos,deleteTodo } = todoControllers;

const router = express.Router();

router.route('/').get(getAllTodos).post(createTodos);
router.route('/:id').delete(deleteTodo);

module.exports = router;
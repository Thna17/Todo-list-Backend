//Application Setup 
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const todoRoute = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
// Middleware
app.use(cors());
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); 
}
app.use(morgan('dev'))
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next();
})

app.use('/api/todos', todoRoute);
app.use('/api/auth', authRoutes);
app.use(errorHandler)

module.exports = app;
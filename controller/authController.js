const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Signup controller to create a user
exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into the database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: newUser.rows[0],  // Exclude password from response in real apps
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userQuery.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Verify password (assuming passwords are hashed)
        const isMatch = await bcrypt.compare(password, user.password); // Use bcrypt for hashed passwords

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, // Payload
            process.env.JWT_SECRET,                // Secret key from .env
            { expiresIn: '1h' }                    // Token expiry time
        );

        // Send token back to the client
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

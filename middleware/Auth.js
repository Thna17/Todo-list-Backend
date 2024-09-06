const jwt = require('jsonwebtoken');

// Middleware to verify JWT
exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        next();
    });
};

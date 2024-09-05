
const app = require('./app');

 // Import the database connection pool from db.js
const port = process.env.PORT || 5001;  // Use the PORT provided by Render



// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

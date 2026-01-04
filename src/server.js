require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

/**
 * Server Entry Point
 * Connects to database and starts Express server
 */

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


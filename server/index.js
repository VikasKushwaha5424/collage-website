const connectDB = require('./config/db');
connectDB(); // Call the connection function

const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Register Routes
app.use('/', authRoutes);
app.use('/', requestRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running modularly on port ${PORT}`);
});
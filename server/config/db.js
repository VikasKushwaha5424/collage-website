const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // You will replace this string with your own connection string later
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/collage-website');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
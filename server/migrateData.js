const mongoose = require('mongoose');
const connectDB = require('./config/db');
const db = require('./config/excelDb'); // Your old Excel reader
const User = require('./models/User'); // Your new User model
const { FILES } = require('./utils/constants');

const migrate = async () => {
    await connectDB();

    // 1. Read Users from Excel
    const excelUsers = db.read(FILES.USERS);

    // 2. Insert them into MongoDB
    try {
        await User.deleteMany(); // Clear existing data to avoid duplicates
        await User.insertMany(excelUsers);
        console.log('Users Migrated Successfully!');
    } catch (error) {
        console.error('Error migrating users:', error);
    }

    process.exit();
};

migrate();
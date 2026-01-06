// server/controllers/authController.js
const User = require('../models/User'); // Import the new Model

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find one user in the database matching these details
        const user = await User.findOne({ username, password });

        if (user) {
            res.json({ success: true, role: user.role });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
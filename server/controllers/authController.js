const db = require('../config/excelDb');
const { FILES } = require('../utils/constants');

exports.login = (req, res) => {
    const { username, password } = req.body;
    const users = db.read(FILES.USERS);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid Credentials' });
    }
};
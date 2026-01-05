const path = require('path');

// Points to the 'server/data' folder
const DATA_DIR = path.join(__dirname, '../data');

module.exports = {
    DATA_DIR,
    FILES: {
        USERS: 'users.xlsx',
        REQUESTS: 'requests.xlsx',
        APPROVALS: 'approvals.xlsx'
    },
    // The approval flow configuration
    WORKFLOW: {
        'OFFICE': 'TEACHER',
        'TEACHER': 'MENTOR',
        'MENTOR': 'HOD',
        'HOD': 'PRINCIPAL',
        'PRINCIPAL': 'DONE'
    }
};
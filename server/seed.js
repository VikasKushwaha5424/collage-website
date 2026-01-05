const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// 1. USERS
const users = [
    { userId: '21CSE045', username: 'vikas', password: '1234', role: 'STUDENT' },
    { userId: 'office01', username: 'admin',    password: '1234', role: 'OFFICE' },
    { userId: 'teach01',  username: 'teacher',  password: '1234', role: 'TEACHER' },
    { userId: 'ment01',   username: 'mentor',   password: '1234', role: 'MENTOR' },
    { userId: 'hod01',    username: 'hod',      password: '1234', role: 'HOD' },
    { userId: 'prin01',   username: 'principal',password: '1234', role: 'PRINCIPAL' }
];

// 2. REQUESTS (Updated with a valid certificate name)
const requests = [
    { 
        requestId: 'REQ001', 
        rollNumber: '21CSE045', 
        certificateType: 'Bonafide Certificate', 
        currentStage: 'OFFICE', 
        finalStatus: 'IN_PROGRESS' 
    }
];

// 3. APPROVALS
const approvals = [
    { requestId: 'REQ001', OFFICE: 'PENDING', TEACHER: 'PENDING', MENTOR: 'PENDING', HOD: 'PENDING', PRINCIPAL: 'PENDING' }
];

// WRITE FUNCTION
const writeExcel = (filename, data) => {
    const filePath = path.join(dataDir, filename);
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    xlsx.writeFile(workbook, filePath);
    console.log(`✅ Created: ${filename}`);
};

// RUN
writeExcel('users.xlsx', users);
writeExcel('requests.xlsx', requests);
writeExcel('approvals.xlsx', approvals);
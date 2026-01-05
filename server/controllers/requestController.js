const db = require('../config/excelDb');
const { FILES, WORKFLOW } = require('../utils/constants');

exports.raiseRequest = (req, res) => {
    const { rollNumber, certificateType } = req.body;
    const reqs = db.read(FILES.REQUESTS);
    const approvals = db.read(FILES.APPROVALS);

    const newId = `REQ${reqs.length + 1}`;

    // 1. Add Request
    reqs.push({ 
        requestId: newId, 
        rollNumber, 
        certificateType, 
        currentStage: 'OFFICE', 
        finalStatus: 'IN_PROGRESS' 
    });

    // 2. Add Empty Approval Chain
    approvals.push({ 
        requestId: newId, 
        OFFICE: 'PENDING', TEACHER: 'PENDING', MENTOR: 'PENDING', 
        HOD: 'PENDING', PRINCIPAL: 'PENDING' 
    });

    db.write(FILES.REQUESTS, reqs);
    db.write(FILES.APPROVALS, approvals);
    
    res.json({ message: 'Request Raised Successfully!', requestId: newId });
};

exports.getDashboardData = (req, res) => {
    const { role, userId } = req.query;
    const allReqs = db.read(FILES.REQUESTS);
    
    if (role === 'STUDENT') {
        res.json(allReqs.filter(r => r.rollNumber === userId));
    } else {
        res.json(allReqs.filter(r => r.currentStage === role));
    }
};

exports.approveRequest = (req, res) => {
    const { requestId, role } = req.body;
    const reqs = db.read(FILES.REQUESTS);
    const approvals = db.read(FILES.APPROVALS);

    // Update Approvals Sheet
    const approvalRow = approvals.find(a => a.requestId === requestId);
    if (approvalRow) approvalRow[role] = 'APPROVED';

    // Update Request Stage
    const reqRow = reqs.find(r => r.requestId === requestId);
    if (reqRow) {
        const nextRole = WORKFLOW[role];
        if (nextRole === 'DONE') {
            reqRow.finalStatus = 'COMPLETED';
            reqRow.currentStage = 'DONE';
        } else {
            reqRow.currentStage = nextRole;
        }
    }

    db.write(FILES.REQUESTS, reqs);
    db.write(FILES.APPROVALS, approvals);
    
    res.json({ message: 'Approved Successfully!' });
};
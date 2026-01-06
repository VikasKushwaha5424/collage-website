const Request = require('../models/Request');
const { v4: uuidv4 } = require('uuid'); // You might need to install this: npm install uuid

// 1. Get all requests (for Admin/HOD) or specific student's requests
exports.getRequests = async (req, res) => {
    try {
        const { role, username } = req.query; // Assuming you send these from frontend

        let query = {};

        // If student, only show their own requests
        if (role === 'student') {
            query = { studentUsername: username };
        } 
        // If HOD, show things pending for HOD
        else if (role === 'hod') {
            query = { status: 'pending_hod' };
        }
        // If Principal, show things pending for Principal
        else if (role === 'principal') {
            query = { status: 'pending_principal' };
        }

        const requests = await Request.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Create a new Request
exports.createRequest = async (req, res) => {
    try {
        const { studentUsername, certificateType, reason } = req.body;

        const newRequest = new Request({
            requestId: uuidv4().slice(0, 6).toUpperCase(), // Generate short ID
            studentUsername,
            certificateType,
            reason
        });

        await newRequest.save();
        res.json({ success: true, message: 'Request submitted successfully!', request: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Approve or Reject a Request
exports.updateStatus = async (req, res) => {
    try {
        const { requestId, role, action, comment } = req.body; // action = 'approve' or 'reject'

        const request = await Request.findOne({ requestId });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        // Add to approval history
        request.approvals.push({ role, status: action, comment });

        // Logic to move to next stage
        if (action === 'reject') {
            request.status = 'rejected';
        } else if (action === 'approve') {
            if (role === 'hod') {
                request.status = 'pending_principal'; // Move to next level
            } else if (role === 'principal') {
                request.status = 'approved'; // Final approval
            }
        }

        await request.save();
        res.json({ success: true, message: 'Request updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const Request = require('../models/Request');
const { v4: uuidv4 } = require('uuid');

// 1. Get Requests
exports.getRequests = async (req, res) => {
    try {
        const { role, username } = req.query;
        let query = {};

        // Filter based on who is logged in
        if (role === 'student') {
            query = { studentUsername: username };
        } else if (role === 'hod') {
            query = { status: 'pending_hod' };
        } else if (role === 'principal') {
            query = { status: 'pending_principal' };
        }

        const requests = await Request.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Create Request
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

// 3. Update Status (Approve/Reject)
exports.updateStatus = async (req, res) => {
    try {
        const { requestId, role, action, comment } = req.body;

        const request = await Request.findOne({ requestId });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        // Add approval record
        request.approvals.push({ role, status: action, comment });

        // Move to next stage
        if (action === 'reject') {
            request.status = 'rejected';
        } else if (action === 'approve') {
            if (role === 'hod') {
                request.status = 'pending_principal';
            } else if (role === 'principal') {
                request.status = 'approved';
            }
        }

        await request.save();
        res.json({ success: true, message: 'Request updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    studentUsername: { 
        type: String, 
        required: true 
    },
    certificateType: { 
        type: String, 
        required: true 
    },
    reason: { 
        type: String 
    },
    status: { 
        type: String, 
        default: 'pending_hod', // Start at the first step
        enum: ['pending_hod', 'pending_principal', 'approved', 'rejected'] 
    },
    // We can store approval history directly inside the request now!
    approvals: [{
        role: String, // e.g., 'hod', 'principal'
        status: String, // 'approved' or 'rejected'
        date: { type: Date, default: Date.now },
        comment: String
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Request', requestSchema);
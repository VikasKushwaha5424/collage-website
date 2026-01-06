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
        default: 'pending_hod', 
        enum: ['pending_hod', 'pending_principal', 'approved', 'rejected'] 
    },
    // We store approvals inside the Request itself (No need for a separate Approval model)
    approvals: [{
        role: String, // 'hod' or 'principal'
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
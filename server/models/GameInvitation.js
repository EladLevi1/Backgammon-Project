const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        default: 'pending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GameInvitation', invitationSchema);

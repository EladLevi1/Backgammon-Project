const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    content: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
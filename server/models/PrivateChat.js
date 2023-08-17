const mongoose = require('mongoose');

const privateChatSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('PrivateChat', privateChatSchema);

const mongoose = require('mongoose');

const publicChatSchema = new mongoose.Schema({
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('PublicChat', publicChatSchema);

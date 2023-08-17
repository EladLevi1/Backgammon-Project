const mongoose = require('mongoose');

const gameChatSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('gameChatSchema', gameChatSchema);

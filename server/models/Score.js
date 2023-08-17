const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    gamesWon: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Score', scoreSchema);

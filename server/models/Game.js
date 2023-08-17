const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    state: {
        type: String,
        enum: ['ongoing', 'finished', 'waiting'],
        default: 'waiting'
    },
    boardState: Object
});

module.exports = mongoose.model('Game', gameSchema);
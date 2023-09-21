const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    players: {
        white: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },
        black: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        }
    },
    winner: {
        type: String,
        enum: ['white', 'black', null],
        default: null
    },
});

module.exports = mongoose.model('Game', gameSchema);
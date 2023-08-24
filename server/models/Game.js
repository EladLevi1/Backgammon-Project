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
    board: {
        type: Array,
        default: Array(24).fill(null).map(() => ({ color: null, pieces: 0 }))
    },
    bar: {
        white: { type: Number, default: 0 },
        black: { type: Number, default: 0 }
    },
    bearOff: {
        white: { type: Number, default: 0 },
        black: { type: Number, default: 0 }
    },
    currentPlayer: {
        type: String,
        enum: ['white', 'black'],
        default: 'white'
    },
    diceRoll: {
        type: [Number]
    },
    gameState: {
        type: String,
        enum: ['ongoing', 'finished'],
        default: 'ongoing'
    },
    winner: {
        type: String,
        enum: ['white', 'black', 'draw', null],
        default: null
    },
    doublingCube: {
        type: Number,
        default: 1
    },
    movesHistory: {
        type: Array,
        default: []
    },
    diceUsed: {
        type: [Boolean],
        default: [false, false]
    }
});

module.exports = mongoose.model('Game', gameSchema);
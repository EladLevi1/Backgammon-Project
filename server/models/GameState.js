const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    currentPlayer: {
        type: String,
        enum: ['white', 'black'],
        default: 'white'
    },
    board: {
        type: Array,
        default: Array(26).fill(null).map(() => ({ color: null, amount: 0 }))
    },
    bar: {
        white: { type: Number, default: 0 },
        black: { type: Number, default: 0 }
    },
    bearOff: {
        white: { type: Number, default: 0 },
        black: { type: Number, default: 0 }
    },
    diceRoll: {
        type: [Number]
    },
    diceUsed: {
        type: [Boolean],
        default: [false, false]
    }
});

module.exports = mongoose.model('GameState', gameStateSchema);
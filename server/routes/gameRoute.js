const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const BackgammonGame = require('../logic/backgammonLogic');

// Route to start a new game
router.post('/create', async (req, res) => {
    const { player1Id, player2Id } = req.body;

    if (!player1Id || !player2Id) {
        return res.status(400).send('Both player IDs are required');
    }

    const gameLogic = new BackgammonGame(player1Id, player2Id);
    
    const newGame = new Game({
        players: {
            white: player1Id,
            black: player2Id
        },
        board: gameLogic.board.slice(1), // Removing the first element, as it was an extra slot in the game logic
        currentPlayer: gameLogic.currentPlayer
    });

    try {
        const savedGame = await newGame.save();
        res.status(200).send(savedGame);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to roll dice for a specific game
router.post('/:gameId/rollDice', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).send('Game not found');
        }

        const gameLogic = new BackgammonGame();
        Object.assign(gameLogic, game._doc);

        gameLogic.rollDice();
        
        game.diceRoll = gameLogic.dice;
        game.currentPlayer = gameLogic.currentPlayer;

        await game.save();
        res.status(200).send({ diceRoll: game.diceRoll, currentPlayer: game.currentPlayer });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to make a move
router.post('/:gameId/move', async (req, res) => {
    const { startPoint, endPoint } = req.body;

    if (startPoint === undefined || endPoint === undefined) {
        return res.status(400).send('Both startPoint and endPoint are required');
    }

    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).send('Game not found');
        }

        const gameLogic = new BackgammonGame();
        Object.assign(gameLogic, game._doc);
        
        gameLogic.moveChecker(startPoint, endPoint);

        game.board = gameLogic.board.slice(1);
        game.diceUsed = gameLogic.diceUsed;
        game.currentPlayer = gameLogic.currentPlayer;
        game.movesHistory.push({ startPoint, endPoint });

        await game.save();
        res.status(200).send(game);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).send('Game not found');
        }
        res.status(200).send(game);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
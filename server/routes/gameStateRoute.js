const express = require('express');
const router = express.Router();
const GameState = require('../models/GameState');
const Backgammon = require('../logic/BackgammonLogic');

// Create a new game state
router.post('/', async (req, res) => {
    try {
        let gameState = new GameState();
        gameState.game = req.body.game;
        const backgammon = new Backgammon();
        gameState.board = backgammon.firstCheckersPosition(gameState.board);
        gameState.currentPlayer = backgammon.whoIsStarting();
        await gameState.save();
        res.status(201).send(gameState);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get a specific game state by ID
router.get('/:id', async (req, res) => {
    try {
        const gameState = await GameState.findById(req.params.id);
        if (!gameState) {
            return res.status(404).send("Game state not found");
        }
        res.send(gameState);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/game/:id', async (req, res) => {
    try {
        const gameState = await GameState.findOne({game: req.params.id})
        if (!gameState) {
            return res.status(404).send("Game state not found");
        }
        res.send(gameState);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/makemove/:id', async (req, res) => {
    try {
        let gameState = await GameState.findById(req.params.id);
    
        if (!gameState) {
            return res.status(404).send("Game state not found");
        }

        const from = req.body.from;
        const to = req.body.to;

        const backgammon = new Backgammon();

        backgammon.makeMove(gameState, from, to);

        await GameState.updateOne({ _id: req.params.id }, gameState.toObject());

        res.send(gameState);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/rolldice/:id', async (req, res) => {
    try{
        let gameState = await GameState.findById(req.params.id);
    
        if (!gameState) {
            return res.status(404).send("Game state not found");
        }

        const backgammon = new Backgammon();

        backgammon.rollDice(gameState);

        await GameState.updateOne({ _id: req.params.id }, gameState.toObject());

        res.send(gameState);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports = router;

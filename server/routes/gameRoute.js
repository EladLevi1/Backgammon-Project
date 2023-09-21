const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Create a new game
router.post('/', async (req, res) => {
    try {
        let game = new Game();
        game.players.white = req.body.players.white;
        game.players.black = req.body.players.black;
        await game.save();
        res.status(201).send(game);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all games
router.get('/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.send(games);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific game by ID
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).send();
        }
        res.send(game);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a specific game by ID
router.put('/games/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['players', 'winner'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!game) {
            return res.status(404).send();
        }

        res.send(game);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
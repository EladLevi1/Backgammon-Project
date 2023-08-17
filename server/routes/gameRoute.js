const express = require('express');
const Game = require('../models/Game');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const games = await Game.find()
            .populate('player1', 'nickname')
            .populate('player2', 'nickname');

        if (games.length > 0) {
            res.status(200).send(games);
        } else {
            res.status(404).send("No games found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id })
            .populate('player1', 'nickname')
            .populate('player2', 'nickname');

        if (game) {
            res.status(200).send(game);
        } else {
            res.status(404).send("Game not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const game = new Game({
            player1: req.body.player1,
            player2: req.body.player2,
            boardState: req.body.boardState
        });

        await game.save();
        res.status(200).send(game);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id });

        if (!game) {
            return res.status(404).send("Game not found");
        }

        game.player1 = req.body.player1;
        game.player2 = req.body.player2;
        game.state = req.body.state;
        game.boardState = req.body.boardState;

        await game.save();
        res.status(200).send(game);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedGame = await Game.deleteOne({ _id: req.params.id });

        if (deletedGame.deletedCount > 0) {
            const remainingGames = await Game.find()
                .populate('player1', 'nickname')
                .populate('player2', 'nickname');
            res.status(200).send(remainingGames);

        } else {
            res.status(404).send("Game not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
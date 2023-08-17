const express = require('express');
const Score = require('../models/Score');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const scores = await Score.find().populate('userId', 'email');

        if (scores.length > 0) {
            res.status(200).send(scores);
        } else {
            res.status(404).send("No scores found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const score = await Score.findOne({ userId: req.params.userId }).populate('userId', 'email');

        if (score) {
            res.status(200).send(score);
        } else {
            res.status(404).send("Score not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:userId', async (req, res) => {
    try {
        const score = new Score({
            userId: req.params.userId,
            gamesPlayed: req.body.gamesPlayed,
            gamesWon: req.body.gamesWon
        });

        await score.save();
        res.status(200).send(score);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const score = await Score.findOne({ userId: req.params.userId });

        if (!score) {
            return res.status(404).send("Score not found");
        }

        score.gamesPlayed = req.body.gamesPlayed;
        score.gamesWon = req.body.gamesWon;

        await score.save();
        res.status(200).send(score);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

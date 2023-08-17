const express = require('express');
const GameChat = require('../models/GameChat');
const router = express.Router();

router.get('/:gameId', async (req, res) => {
    try {
        const chat = await GameChat.findOne({ gameId: req.params.gameId })
            .populate('messages.sender', 'nickname')
            .populate('gameId', 'player1 player2 state');

        if (chat) {
            res.status(200).send(chat);
        } else {
            res.status(404).send("Chat not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:gameId', async (req, res) => {
    try {
        const chat = await GameChat.findOne({ gameId: req.params.gameId });

        if (!chat) {
            return res.status(404).send("Chat not found");
        }

        const newMessage = {
            sender: req.body.sender,
            content: req.body.content
        };

        chat.messages.push(newMessage);

        await chat.save();
        res.status(200).send(chat);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

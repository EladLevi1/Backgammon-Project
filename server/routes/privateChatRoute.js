const express = require('express');
const PrivateChat = require('../models/PrivateChat');
const router = express.Router();

router.get('/:user1/:user2', async (req, res) => {
    try {
        const chat = await PrivateChat.findOne({
            $or: [
                { user1: req.params.user1, user2: req.params.user2 },
                { user1: req.params.user2, user2: req.params.user1 }
            ]
        }).populate('messages.sender', 'nickname');

        if (chat) {
            res.status(200).send(chat);
        } else {
            res.status(404).send("Private chat not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:user1/:user2', async (req, res) => {
    try {
        const chat = await PrivateChat.findOne({
            $or: [
                { user1: req.params.user1, user2: req.params.user2 },
                { user1: req.params.user2, user2: req.params.user1 }
            ]
        });

        if (!chat) {
            return res.status(404).send("Private chat not found");
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
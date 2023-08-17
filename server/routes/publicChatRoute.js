const express = require('express');
const PublicChat = require('../models/PublicChat');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const publicChat = await PublicChat.findOne()
            .populate('messages.sender', 'nickname');

        if (publicChat) {
            res.status(200).send(publicChat);
        } else {
            res.status(404).send("Public chat not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const publicChat = await PublicChat.findOne();

        if (!publicChat) {
            return res.status(404).send("Public chat not found");
        }

        const newMessage = {
            sender: req.body.sender,
            content: req.body.content
        };

        publicChat.messages.push(newMessage);

        await publicChat.save();
        res.status(200).send(publicChat);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
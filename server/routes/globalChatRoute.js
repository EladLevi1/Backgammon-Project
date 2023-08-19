const express = require('express');
const GlobalChat = require('../models/GlobalChat');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const globalChat = await GlobalChat.findOne()
            .populate('messages.sender', 'nickname');

        if (globalChat) {
            res.status(200).send(globalChat);
        } else {
            res.status(404).send("Global chat not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/messages', async (req, res) => {
    try {
        const globalChat = await GlobalChat.findOne()
            .populate('messages.sender', 'nickname');

        if (globalChat) {
            res.status(200).send(globalChat.messages);
        } else {
            res.status(404).send("Global chat not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        let globalChat = await GlobalChat.findOne();

        if (!globalChat) {
            globalChat = new GlobalChat();
        }

        const newMessage = {
            sender: req.body.sender,
            content: req.body.content
        };

        globalChat.messages.push(newMessage);

        await globalChat.save();
        res.status(200).send(newMessage);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
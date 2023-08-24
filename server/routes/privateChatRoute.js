const express = require('express');
const PrivateChat = require('../models/PrivateChat');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await PrivateChat.findById(chatId)
            .populate('profile1', 'nickname')
            .populate('profile2', 'nickname')
            .populate('messages.sender', 'nickname');

        if (chat) {
            res.status(200).send(chat);
        } else {
            res.status(404).send("Private chat not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:profile1/:profile2', async (req, res) => {
    try {
        let chat = await PrivateChat.findOne({
            $or: [
                { profile1: req.params.profile1, profile2: req.params.profile2 },
                { profile1: req.params.profile2, profile2: req.params.profile1 }
            ]
        }).populate('messages.sender', 'nickname');

        if (!chat) {
            chat = new PrivateChat({
                profile1: req.params.profile1,
                profile2: req.params.profile2,
                messages: []
            });
            await chat.save();
        }

        res.status(200).send(chat);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:id', async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await PrivateChat.findById(chatId)
            .populate('profile1', 'nickname')
            .populate('profile2', 'nickname')
            .populate('messages.sender', 'nickname');

        if (!chat) {
            return res.status(404).send("Private chat not found");
        }

        const newMessage = {
            sender: req.body.sender,
            content: req.body.content
        };

        chat.messages.push(newMessage);

        await chat.save();
        res.status(200).send(newMessage);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

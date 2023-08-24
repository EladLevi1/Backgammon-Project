const express = require('express');
const GameInvitation = require('../models/GameInvitation');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const gameInvitations = await GameInvitation.find()
            .populate('sender', 'nickname')
            .populate('recipient', 'nickname');

        if (gameInvitations.length > 0) {
            res.status(200).send(gameInvitations);
        } else {
            res.status(404).send("No game invitations found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const invitationId = req.params.id;
        const gameInvitation = await GameInvitation.findById(invitationId)
            .populate('sender', 'nickname')
            .populate('recipient', 'nickname');

        if (gameInvitation) {
            res.status(200).send(gameInvitation);
        } else {
            res.status(404).send("Game invitation not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/profile/:profileId', async (req, res) => {
    try {
        const profileId = req.params.profileId;
        const gameInvitations = await GameInvitation.find({
            $or: [
                { sender: profileId },
                { recipient: profileId }
            ],
            status: 'pending'
        })
        .populate('sender', 'nickname')
        .populate('recipient', 'nickname');

        if (gameInvitations.length > 0) {
            res.status(200).send(gameInvitations);
        } else {
            res.status(404).send("No game invitations found for the user");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { sender, recipient } = req.body;

        if (sender === recipient) {
            return res.status(400).send("You cannot send a game invitation to yourself.");
        }

        const existingInvitation = await GameInvitation.findOne({
            $or: [
                { sender, recipient },
                { sender: recipient, recipient: sender }
            ],
            status: 'pending'
        });

        if (existingInvitation) {
            return res.status(400).send("A pending game invitation already exists between these users.");
        }

        const gameInvitation = new GameInvitation({ sender, recipient });
        await gameInvitation.save();
        res.status(200).send(gameInvitation);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const invitationId = req.params.id;
        const status = req.body.status;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).send("Invalid status");
        }

        const invitation = await GameInvitation.findById(invitationId);

        if (!invitation) {
            return res.status(404).send("Game invitation not found");
        }

        invitation.status = status;
        await invitation.save();

        res.status(200).send(invitation);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedGameInvitation = await GameInvitation.deleteOne({ _id: req.params.id });

        if (deletedGameInvitation.deletedCount > 0) {
            const remainingGameInvitations = await GameInvitation.find()
                .populate('sender', 'nickname')
                .populate('recipient', 'nickname');
            res.status(200).send(remainingGameInvitations);

        } else {
            res.status(404).send("Game invitation not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
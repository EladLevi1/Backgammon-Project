const express = require('express');
const FriendRequest = require('../models/FriendRequest');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const friendRequests = await FriendRequest.find()
            .populate('sender', 'nickname')
            .populate('recipient', 'nickname');

        if (friendRequests.length > 0) {
            res.status(200).send(friendRequests);
        } else {
            res.status(404).send("No friend requests found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/profile/:profileId', async (req, res) => {
    try {
        const profileId = req.params.profileId;
        const friendRequests = await FriendRequest.find({
            $or: [
                { sender: profileId },
                { recipient: profileId }
            ]
        })
        .populate('sender', 'nickname')
        .populate('recipient', 'nickname');

        if (friendRequests.length > 0) {
            res.status(200).send(friendRequests);
        } else {
            res.status(404).send("No friend requests found for the user");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { sender, recipient } = req.body;

        // Check if they're trying to add themselves
        if (sender === recipient) {
            return res.status(400).send("You cannot send a friend request to yourself.");
        }

        // Check for an existing request
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender, recipient },
                { sender: recipient, recipient: sender }
            ],
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).send("A pending friend request already exists between these users.");
        }

        const friendRequest = new FriendRequest({ sender, recipient });
        await friendRequest.save();
        res.status(200).send(friendRequest);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedFriendRequest = await FriendRequest.deleteOne({ _id: req.params.id });

        if (deletedFriendRequest.deletedCount > 0) {
            const remainingFriendRequests = await FriendRequest.find()
                .populate('sender', 'nickname')
                .populate('recipient', 'nickname');
            res.status(200).send(remainingFriendRequests);

        } else {
            res.status(404).send("Friend request not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
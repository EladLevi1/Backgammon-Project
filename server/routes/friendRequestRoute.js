const express = require('express');
const FriendRequest = require('../models/FriendRequest');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const friendRequests = await FriendRequest.find()
            .populate('sender')
            .populate('recipient');

        if (friendRequests.length > 0) {
            res.status(200).send(friendRequests);
        } else {
            res.status(404).send("No friend requests found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const requestId = req.params.id;
        const friendRequest = await FriendRequest.findById(requestId)
            .populate('sender')
            .populate('recipient');

        if (friendRequest) {
            res.status(200).send(friendRequest);
        } else {
            res.status(404).send("Friend request not found");
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
            ],
            status: 'pending'
        })
        .populate('sender')
        .populate('recipient');

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

router.put('/:id', async (req, res) => {
    try {
        const requestId = req.params.id;

        const status = req.body.status; // Get the status from request body
        // const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).send("Invalid status");
        }

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).send("Friend request not found");
        }

        request.status = status;
        await request.save();

        res.status(200).send(request);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedFriendRequest = await FriendRequest.deleteOne({ _id: req.params.id });

        if (deletedFriendRequest.deletedCount > 0) {
            const remainingFriendRequests = await FriendRequest.find()
                .populate('sender')
                .populate('recipient');
            res.status(200).send(remainingFriendRequests);

        } else {
            res.status(404).send("Friend request not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
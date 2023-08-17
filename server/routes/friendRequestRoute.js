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

router.post('/', async (req, res) => {
    try {
        const friendRequest = new FriendRequest({
            sender: req.body.sender,
            recipient: req.body.recipient
        });

        await friendRequest.save();
        res.status(200).send(friendRequest);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const friendRequest = await FriendRequest.findOne({ _id: req.params.id });

        if (!friendRequest) {
            return res.status(404).send("Friend request not found");
        }

        friendRequest.status = req.body.status;

        await friendRequest.save();
        res.status(200).send(friendRequest);

    } catch (err) {
        res.status(500).send(err.message);
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
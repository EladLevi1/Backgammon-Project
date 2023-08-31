const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().populate('profile', 'nickname _id');

        if (notifications.length > 0) {
            res.status(200).send(notifications);
        } else {
            res.status(404).send("No notifications found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/profile/:profileId', async (req, res) => {
    try {
        const profileId = req.params.profileId;
        const notifications = await Notification.find({
            profile: profileId
        }).populate('profile', 'nickname _id');

        if (notifications.length > 0) {
            res.status(200).send(notifications);
        } else {
            res.status(404).send("No notifications found for the user");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const notification = new Notification({
            profile: req.body.profile,
            content: req.body.content,
            type: req.body.type
        });

        await notification.save();
        res.status(200).send(notification);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id });

        if (!notification) {
            return res.status(404).send("Notification not found");
        }

        notification.status = req.body.status;

        await notification.save();
        res.status(200).send(notification);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/read/:profileId', async (req, res) => {
    try {
        const profileId = req.params.profileId;

        const userNotifications = await Notification.find({ profile: profileId });

        if (userNotifications.length === 0) {
            return res.status(404).send("No notifications found for the user");
        }

        await Notification.updateMany({ profile: profileId }, { status: 'read' });

        // res.status(200).send("Notifications set to read for the user");

        res.status(200).json({ message: "Notifications set to read for the user" });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedNotification = await Notification.deleteOne({ _id: req.params.id });

        if (deletedNotification.deletedCount > 0) {
            const remainingNotifications = await Notification.find().populate('profile', 'nickname _id');
            res.status(200).send(remainingNotifications);

        } else {
            res.status(404).send("Notification not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/deleteAll/:profileId', async (req, res) => {
    try {
        const profileId = req.params.profileId;
        const result = await Notification.deleteMany({ profile: profileId });

        if (result.deletedCount > 0) {
            res.status(200).send("All notifications deleted successfully.");
        } else {
            res.status(404).send("No notifications found for the specified profile.");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

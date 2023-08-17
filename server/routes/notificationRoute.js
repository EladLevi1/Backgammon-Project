const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().populate('userId', 'email');

        if (notifications.length > 0) {
            res.status(200).send(notifications);
        } else {
            res.status(404).send("No notifications found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const notification = new Notification({
            userId: req.body.userId,
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

router.delete('/:id', async (req, res) => {
    try {
        const deletedNotification = await Notification.deleteOne({ _id: req.params.id });

        if (deletedNotification.deletedCount > 0) {
            const remainingNotifications = await Notification.find().populate('userId', 'email');
            res.status(200).send(remainingNotifications);

        } else {
            res.status(404).send("Notification not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

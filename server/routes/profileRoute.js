const express = require('express');
const Profile = require('../models/Profile');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', 'email');

        if (profiles.length > 0) {
            res.status(200).send(profiles);
        } else {
            res.status(404).send("No profiles found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ _id: req.params.id }).populate('user', 'email');

        if (profile) {
            res.status(200).send(profile);
        } else {
            res.status(404).send("Profile not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const profile = new Profile({
            nickname: req.body.nickname,
            image: req.body.image,
            user: req.body.user
        });

        await profile.save();
        res.status(200).send(profile);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ _id: req.params.id });

        if (!profile) {
            return res.status(404).send("Profile not found");
        }

        profile.nickname = req.body.nickname;
        profile.image = req.body.image;

        await profile.save();
        res.status(200).send(profile);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProfile = await Profile.deleteOne({ _id: req.params.id });

        if (deletedProfile.deletedCount > 0) {
            const remainingProfiles = await Profile.find().populate('user', 'email');
            res.status(200).send(remainingProfiles);

        } else {
            res.status(404).send("Profile not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

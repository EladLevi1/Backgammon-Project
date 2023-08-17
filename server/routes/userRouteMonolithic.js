const express = require('express');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/UserMonolithic');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find();

        if (tasks.length > 0){
            res.status(200).send(users);
        } else {
            res.status(404).send("No users found");
        }

    } catch(err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send("User not found");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const latestUser = await User.findOne({}, {}, { sort: { id: -1 } });

        const newId = latestUser ? parseInt(latestUser.id, 10) + 1 : 1;

        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        const user = new User({
            id: newId,
            email: req.body.email,
            password: hashedPassword,
            nickname: req.body.nickname,
            image: req.body.image
        });

        await user.save();
        res.status(200).send(user);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(404).send("Incorrect email or password");
        }
        
        const passwordsMatch = await bcryptjs.compare(req.body.password, user.password);
        
        if (!passwordsMatch) {
            return res.status(404).send("Incorrect email or password");
        }

        const secret = crypto.randomBytes(64).toString('hex');

        const token = jwt.sign({
            id: user.id
        }, secret, {
            expiresIn: '7d'
        });

        res.status(200).send({token: token});

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.deleteOne({
            id: req.params.id
        });

        if (deletedUser.deletedCount > 0) {
            const remainingUsers = await User.find();
            res.status(200).send(remainingUsers);

        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findOne({
            id: req.params.id
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.email = req.body.email;
        user.password = req.body.password;
        user.nickname = req.body.nickname;
        user.image = req.body.image

        await user.save();
        res.status(200).send(user);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
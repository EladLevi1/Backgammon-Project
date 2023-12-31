const express = require('express');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const users = await User.find();

        if (users.length > 0){
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
        const user = await User.findOne({ _id: req.params.id });

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
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        const user = new User({
            email: req.body.email,
            password: hashedPassword,
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

        // const secret = crypto.randomBytes(64).toString('hex');

        const secret = process.env.JWT_SECRET;

        const token = jwt.sign({
            _id: user._id
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
            _id: req.params.id
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
            _id: req.params.id
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.email = req.body.email;
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);
        user.password = hashedPassword;
        
        await user.save();
        res.status(200).send(user);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
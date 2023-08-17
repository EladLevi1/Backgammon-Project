const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }]
});

module.exports = mongoose.model("Profile", profileSchema);
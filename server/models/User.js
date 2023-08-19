const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/.test(value);
            },
            message: "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
        }
    }
});

module.exports = mongoose.model("User", userSchema);
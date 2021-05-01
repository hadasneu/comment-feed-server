const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserScheme = Schema({
    email: {
        type: String, required: true
    },
    imageURL: {
        type: String
    },
    lastActiveAt: {
        type: Date
    }
});

module.exports = mongoose.model("User", UserScheme);

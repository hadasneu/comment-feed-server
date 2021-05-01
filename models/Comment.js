const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentScheme = Schema({
  user: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    content: {
        type: String, required: true
    }
});

module.exports = mongoose.model("Comment", CommentScheme);

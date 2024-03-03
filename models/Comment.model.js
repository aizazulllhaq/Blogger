const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

exports.Comment = model("Comment", commentSchema);
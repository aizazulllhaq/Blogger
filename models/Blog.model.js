const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

exports.Blog = model("Blog", blogSchema);
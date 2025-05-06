import mongoose from 'mongoose';

const commentsSchema = new mongoose.Schema({
    body: { type: String, required: true},
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authors",
        required: true
    }
}, { timestamps: true })

const commentsModel = mongoose.model("Comments", commentsSchema)

export default commentsModel
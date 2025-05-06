import mongoose from 'mongoose';

const postsSchema = new mongoose.Schema({
    category: {type: String, required: true},
    title: {type: String, required: true},
    cover: {type: String, required: true},
    readTime: {
        value: {type: Number, required: true},
        unit: {type: String, required: true}
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: "Authors", required: true},
    content: {type: String, required: true}
}, {timestamps: true})

const postsModel = mongoose.model("Posts", postsSchema)

export default postsModel
import mongoose from 'mongoose';

const postsSchema = new mongoose.Schema({
    category: {type: String, required: true},
    title: {type: String, required: true},
    cover: {type: String, required: true},
    readTime: {
        value: {type: Number, required: true},
        unit: {type: String, required: true}
    },
    author: {type: String, required: true},
    content: {type: String, required: true}
})

const postsModel = mongoose.model("Posts", postsSchema)

export default postsModel
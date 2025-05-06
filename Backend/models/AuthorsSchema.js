import mongoose from 'mongoose';

const authorsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    born: { type: String, required: true},
    avatar: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
})

const authorsModel = mongoose.model("Authors", authorsSchema)

export default authorsModel
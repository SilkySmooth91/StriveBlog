import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    verified: {type: String, required: true, default: false}
})

const usersModel = mongoose.model("Users", usersSchema)
export default usersModel
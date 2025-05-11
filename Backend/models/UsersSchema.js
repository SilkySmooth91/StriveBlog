import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullname: { type: String },
    email: { type: String, required: true },
    password: { 
        type: String, 
        required: function() {
            // La password è richiesta solo se non è un utente Google
            return !this.googleId;
        } 
    },
    googleId: { type: String }, // Aggiungi questo campo
    avatar: { type: String },
    verified: { type: Boolean, default: false }
}, { timestamps: true });

const usersModel = mongoose.model("Users", usersSchema);
export default usersModel;
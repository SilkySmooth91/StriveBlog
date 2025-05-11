import express from "express"
import "dotenv/config"
import usersModel from "../models/UsersSchema.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import { uploadAvatar } from "../middlewares/multer.js"

const router = express.Router()

router.get("/", authMiddleware, async (req, res) => {
    try {
        const users = await usersModel.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: "Errore del server" })
    }   
})

router.get("/:id", authMiddleware, async (req, res) => {
    const id = req.params.id
    try {
        const user = await usersModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" })
        }
        return res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ message: "ID non valido" })
    }
})

router.patch("/:id/avatar", authMiddleware, uploadAvatar, async (req, res) => {
    const id = req.params.id;
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nessun file caricato" });
        }
        const userUpdated = await usersModel.findByIdAndUpdate(
            id,
            { avatar: req.file.path },
            { new: true }
        ).select("-password"); // Serve ad escludere la password dalla risposta
        res.status(200).json(userUpdated);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Errore durante il caricamento del file" });
    }
});

export default router


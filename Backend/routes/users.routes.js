import express from "express"
import "dotenv/config"
import usersModel from "../models/UsersSchema.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await usersModel.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: "Errore del server" })
    }   
})

router.get("/users/:id", authMiddleware, async (req, res) => {
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

export default router


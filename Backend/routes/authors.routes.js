import express from "express"
import authorsModel from "../models/AuthorsSchema.js" 
import { uploadAvatar } from "../middlewares/multer.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const authors = await authorsModel.find()
        res.status(200).json(authors)
    } catch (err) {
        res.status(500).json({ error: "errore nel recupero dati degli autori" })
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const author = await authorsModel.findById(id)
        res.status(200).json(author)
    } catch (err) {
        res.status(500).json({error: "errore nel recupero dati dell'autore"})
    }
})

router.post("/", async (req, res) => {
    const obj = req.body
    const author = new authorsModel(obj)
    const dbAuthors = await author.save()
    res.status(201).json(dbAuthors)
})

router.put("/:id", async (req, res) => {
    const id = req.params.id
    const obj = req.body
    try {
        const authorsEdit = await authorsModel.findByIdAndUpdate(id, obj)
        res.status(200).json(authorsEdit)
    } catch (err) {
        res.status(500).json({error: "errore nella modifica dell'autore"})
    }
})

router.patch("/:id/avatar", uploadAvatar, async (req, res) => {
    const id = req.params.id
    try {
        const authorUpdated = await authorsModel.findByIdAndUpdate(
            id, 
            {avatar: req.file.path},
            {new: true}
        )
        res.status(200).json(authorUpdated)
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Errore duranante il caricamento del file"})
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        await authorsModel.findByIdAndDelete(id)
        res.status(200).json({message: "deleted!"})
    } catch (err) {
        res.status(500).json({error: "errore nella cancellazione dell'autore"})
    }
})

export default router
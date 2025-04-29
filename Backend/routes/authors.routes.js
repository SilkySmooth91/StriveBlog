import express from "express"
import authorsModel from "../models/AuthorsSchema.js" 
import multer from "multer"

const router = express.Router()

// Configurazione multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "avatars/")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

// Middleware di filtro formato img
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false)
        return cb(new error("formato immagine non consentito"))
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter})


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

router.patch("/:id/avatar", upload.single("avatar"), async (req, res) => {
    const id = req.params.id
    try {
        const avatarUrl = `/avatars/${req.file.filename}`
        const authorUpdated = await authorsModel.findByIdAndUpdate(
            id, 
            {avatar: avatarUrl},
            {new: true}
        )
        res.status(200).json(authorUpdated)
    } catch (err) {
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
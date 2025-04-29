import express from "express"
import postsModel from "../models/PostsSchema.js"
import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router()


// Middleware di filtro formato img
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false)
        return cb(new error("formato immagine non consentito"))
    }
}

// Configurazione Coudinary

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "epicode",
       // format: async (req, file) => "png" -> posso evitare di specificare format se voglio preservare il formato originale delf ile caricato.
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname)
        }
    }
})

const upload = multer({storage: cloudStorage, fileFilter: fileFilter})


router.get("/params", async (req, res) => {
    
    const size = req.query.size;
    const skip = (req.query.page-1) * size; 
    const prop = req.query.order;

    try {
        const filterPosts = await userModel.find().sort({[prop]:1}).limit(size).skip(skip)
        return res.status(200).json(filterPosts)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }

})

router.get("/", async (req, res) => {
    try {
        const posts = await postsModel.find()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ error: "errore nel caricamento dei post" })
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const post = await postsModel.findById(id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ error: "errore nel caricamento del post" })
    }
})

router.post("/", async (req, res) => {
    const obj = req.body
    const post = new postsModel(obj)
    const dbPosts = await post.save()
    res.status(201).json(dbPosts)
})

router.put("/:id", async (req, res) => {
    const id = req.params.id
    const obj = req.body
    try {
        const postEdit = await postsModel.findByIdAndUpdate(id, obj)
        res.status(200).json(postEdit)
    } catch (err) {
        res.status(500).json({ error: "errore nella modifica del post" })
    }
})

router.patch("/:id/cover", upload.single("cover"), async (req, res) => {
    const id = req.params.id
    try {
        const coverUrl = `/covers/${req.file.filename}`
        const postEdit = await postsModel.findByIdAndUpdate(
            id,
            {cover: coverUrl},
            {new: true}
        )
        res.status(200).json(postEdit)
    } catch (err) {
        res.status(500).json({error: "errore durante il caricamento del file"})
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        await postsModel.findByIdAndDelete(id)
        res.status(200).json({ message: "deleted!" })
    } catch (err) {
        res.status(500).json({ error: "errore nella cancellazione del post" })
    }
})

export default router
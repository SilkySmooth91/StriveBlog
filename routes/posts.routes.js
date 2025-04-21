import express from "express"
import postsModel from "../models/PostsSchema.js"

const router = express.Router()

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
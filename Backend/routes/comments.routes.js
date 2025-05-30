import express from "express"
import commentsModel from "../models/CommentsSchema.js" 
import postsModel from "../models/PostsSchema.js"
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router()

router.get("/:id/comments", async (req, res) => {
    const postId = req.params.id

    try {
        const post = await postsModel.findById(postId)

        if(!post) {
            return res.status(404).json({ error: "Post non trovato"})
        }

        const comments = await commentsModel.find({ postId: postId })
          .populate("author", "username avatar") // Dovrebbe popolare i commenti con i dati dell'autore
          .sort({ createdAt: -1 });

        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json({ error: "errore nel caricamento dei commenti" })
    }
})

router.get("/:id/comments/:commentId", async (req, res) => {
    const {id, commentId} = req.params

    try {
        const post = await postsModel.findById(id)

        if (!post) {
            return res.status(404).json({ error: "Post non trovato" })
        }

        const comment = await commentsModel.findById(commentId)
        res.status(200).json(comment)
    } catch (err) {
        res.status(500).json({error: "Errore nel caricamento del commento"})
    }
})

router.post("/:id/comments", authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { body } = req.body;
    const author = req.user._id; // Prendi l'id dell'utente autenticato

    try {
        const post = await postsModel.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post non trovato" });
        }

        const newComment = new commentsModel({ body, author, postId: id });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore nella creazione del commento" });
    }
});

router.put("/:id/comments/:commentId", async (req, res) => {
    const {id, commentId} = req.params
    const updatedBody = req.body

    try {
        const post = await postsModel.findById(id)

        if (!post) {
            return res.status(404).json({error: "Post non trovato"})
        }

        const comment = await commentsModel.findById(commentId)

        if (!comment) {
            return res.status(404).json({error: "Commento non trovato"})
        }

        const updatedComment = await commentsModel.findByIdAndUpdate(
            commentId, updatedBody, {new: true}
        )
        res.status(200).json(updatedComment)
    } catch (err) {
        res.status(500).json({ error: "Errore nella modifica del commento" })
    }
})

router.delete("/:id/comments/:commentId", async (req, res) => {
    const {id, commentId} = req.params

    try {
        const post = await postsModel.findById(id)

        if (!post) {
            res.status(404).json({error: "Post non trovato"})
        }

        const comment = await commentsModel.findByIdAndDelete(commentId)
        res.status(200).json({message: "commento eliminato"})
    } catch (err) {
        res.status(500).json({error: "errore nell'eliminazione del commento"})
    }
})

export default router
import express from 'express';
import cors from "cors";
import "dotenv/config";
import db from './db.js';
import authorsRoutes from "./routes/authors.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import commentsRoutes from "./routes/comments.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/authors", authorsRoutes);
app.use("/posts", postsRoutes);
app.use("/posts", commentsRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Pagina non trovata" });
});

db();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});


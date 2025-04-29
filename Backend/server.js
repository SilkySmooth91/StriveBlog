// const express = require('express');
import express from 'express';
import cors from "cors";
import "dotenv/config";
import db from './db.js';
import authorsRoutes from "./routes/authors.routes.js"
import postsRoutes from "./routes/posts.routes.js"

const app = express();
app.use(express.json());
app.use(cors())

app.use("/authors", authorsRoutes)
app.use("/posts", postsRoutes)


db();
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT)
})


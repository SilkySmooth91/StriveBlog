// const express = require('express');
import express from 'express';
import "dotenv/config";
import db from './db.js';
import authorsRoutes from "./routes/authors.routes.js"

const app = express();
app.use(express.json());

app.use("/authors", authorsRoutes)

db();
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT)
})


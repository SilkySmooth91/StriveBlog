import express from "express"
import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import usersModel from "../models/UsersSchema.js"

const router = express.Router()
const saltRounds = +process.env.SALT_ROUNDS
const jwtSecretKey = process.env.JWT_SECRET_KEY

router.post("/auth/register", async (req, res) => {
    const psw = req.body.password
    const user = new usersModel({
        ...req.body,
        passord: await bcrypt.hash(psw, saltRounds) 
    })
    const userSave = await user.save()
    return res.status(201).json(userSave)
})

router.post("/auth/login", async (req, res) => {
    const email = req.body.email
    const psw = req.body.password

    const userLogin = await usersModel.findOne({email: email})
    console.log(userLogin)

    if (userLogin) {
        //se l'utente con quella mail è stato trovato, controllo la psw
        const log = await bcrypt.compare(psw, userLogin.password)

        if (log) {
            //se la password è corretta, genero un token JWT

            const token = await generateToken({
                id: userLogin.id,
                username: userLogin.username,
                fullname: userLogin.fullname,
                email: userLogin.email
            })
            return res.status(200).json(token)
        } else {
            //se la password è errata
            return res.status(400).json({message: "invalid password"})
        }
    } else {
        //se la mail non è stata trovata nel DB
        return res.status(400).json({message: "la mail usata non è associata ad alcun account"})
    }
})

//funzione di creazione del token

const generateToken = (payload) => {
    return new Promise((res, rej) => {
        jwt.sign(payload, jwtSecretKey, {expiresIn: "1d"}, (err, token) => {
            if(err) rej(err)
                else res(token)
        })
    })
}

export default router
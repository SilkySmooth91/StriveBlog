import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import usersModel from "../models/UsersSchema.js"

const router = express.Router()
const saltRounds = +process.env.SALT_ROUNDS
const jwtSecretKey = process.env.JWT_SECRET_KEY

router.post("/register", async (req, res) => {
    const { email, password, username, fullname } = req.body;

    // Validazione manuale dei dati
    if (
        // queste verifiche servono a evitare la vulnerabilità SQL-injection
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof username !== "string" ||
        typeof fullname !== "string" ||
        // Questa è una regex che serve a verificare se la stringa "email" ha un formato valido
        // in questo caso, una mail è valida se:
        // - è presente almeno un carattere prima della @ (escludendo spazi e @)
        // - è presente una @
        // - è presente almeno un carattere dopo la @ e prima del . (escludendo spazi e @) 
        // - è presente un .
        // - è presente almeno un carattere dopo il . (escludendo spazi e @)
        !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
        password.length < 6
    ) {
        return res.status(400).json({ message: "Dati non validi" });
    }

    // Controllo se l'email è già registrata
    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email già registrata" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new usersModel({
        email,
        password: hashedPassword,
        username,
        fullname
    });
    const userSave = await user.save();
    return res.status(201).json(userSave);
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validazione manuale dei dati
    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
        return res.status(400).json({ message: "Dati non validi" });
    }

    const userLogin = await usersModel.findOne({ email });

    if (userLogin) {
        //se l'utente con quella mail è stato trovato, controllo la psw
        const log = await bcrypt.compare(password, userLogin.password);

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
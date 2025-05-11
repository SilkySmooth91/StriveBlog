import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import "dotenv/config";
import usersModel from '../models/UsersSchema.js';
import jwt from 'jsonwebtoken';

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/googlelogin/callback",
    passReqToCallback: true
},
    async function(req, accessToken, refreshToken, profile, done) {
        try {
            const { email, name, given_name, family_name, email_verified } = profile._json;
            const user = await usersModel.findOne({ email });
            if (user) {
                const accessToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email
                }, jwtSecretKey, { expiresIn: "1d" });
                return done(null, { accessToken }); 
            } else {
                const newUser = new usersModel({
                    username: `${given_name} ${family_name}` || name || email,
                    fullname: name,
                    email: email,
                    password: "-",
                    verified: email_verified,
                    googleId: profile.id
                });
                const createUser = await newUser.save();
                const accessToken = jwt.sign({
                    id: createUser.id,
                    username: createUser.username,
                    fullname: createUser.fullname,
                    email: createUser.email
                }, jwtSecretKey, { expiresIn: "1d" });
                return done(null, { accessToken });
            }
        } catch (err) {
            console.log(err);
            return done(err, null);
        }
    }
)

export default googleStrategy
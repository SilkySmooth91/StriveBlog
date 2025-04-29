import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer" 


// Configurazione di Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

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

const postStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "covers",
       // format: async (req, file) => "png" -> posso evitare di specificare format se voglio preservare il formato originale delf ile caricato.
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            return uniqueSuffix + '-' + file.originalname
        }
    }
})

const authorStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatars",
       // format: async (req, file) => "png" -> posso evitare di specificare format se voglio preservare il formato originale delf ile caricato.
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            return uniqueSuffix + '-' + file.originalname
        }
    }
})

const uploadPosts = multer({storage: postStorage, fileFilter: fileFilter})
const uploadAuthors = multer({storage: authorStorage, fileFilter: fileFilter})

export const uploadAvatar = uploadAuthors.single("avatar")
export const uploadCover = uploadPosts.single("cover")
import express from 'express'
import { upload } from '../config/cloudinary.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

router.post('/avatar', upload.single('avatar'), async (req, res) => {
    try {
        res.json({ url: req.file.path })
    } catch (error) {
        res.status(500).json({ message: 'Errore upload', error: error.message })
    }
})

export default router
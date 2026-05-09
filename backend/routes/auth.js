import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { firstname, surname, email, password, role } = req.body

        // controlla se l'email esiste già
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: 'Email già registrata' })
        }

        const user = new User({ firstname, surname, email, password, role })
        await user.save()

        res.status(201).json({ message: 'Utente registrato con successo' })

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // trova l'utente
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Credenziali non valide' })
        }

        // confronta la password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenziali non valide' })
        }

        // genera il token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({ token, user: { id: user._id, firstname: user.firstname, email: user.email, role: user.role } })

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

export default router
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { firstname, surname, email, password, role, avatar } = req.body

        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: 'Email già registrata' })
        }

        const user = new User({ firstname, surname, email, password, role, avatar: avatar || '' })
        await user.save()

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: 'Registrazione completata',
            token,
            user: { id: user._id, firstname: user.firstname, surname: user.surname, email: user.email, role: user.role, avatar: user.avatar }
        })

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Credenziali non valide' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenziali non valide' })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: { id: user._id, firstname: user.firstname, surname: user.surname, email: user.email, role: user.role, avatar: user.avatar }
        })

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { firstname, surname, email, avatar } = req.body

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { firstname, surname, email, avatar },
            { new: true }
        ).select('-password')

        res.json({
            user: { id: user._id, firstname: user.firstname, surname: user.surname, email: user.email, role: user.role, avatar: user.avatar }
        })

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

export default router
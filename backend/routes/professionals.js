import express from 'express';
import Professional from '../models/Professional.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router()

// GET - lista con filtri
router.get('/', async (req, res) => {
    try {
        const {category, city, minRate, maxRate} = req.query
        const filter = {}
        if (category) filter.category = category
        if (city) filter.city = { $regex: city, $options: 'i'}
        if (minRate || maxRate) {
            filter.hourlyRate = {}
            if (minRate) filter.hourlyRate.$gte = Number(minRate)
            if (maxRate) filter.hourlyRate.$lte = Number(maxRate)
        }
        const professionals = await Professional.find(filter).populate('userId', 'firstname surname email avatar')
        res.json(professionals)
    } catch (error) {
        res.status(500).json({message: 'Errore del server', error: error.message})
    }
})

// GET /me - profilo del professionista loggato
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const professional = await Professional.findOne({ userId: req.user.id })
        if (!professional) return res.status(404).json({ message: 'Profilo non trovato' })
        res.json(professional)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// PUT /me - modifica profilo professionista loggato
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { category, bio, city, hourlyRate } = req.body
        const professional = await Professional.findOneAndUpdate(
            { userId: req.user.id },
            { category, bio, city, hourlyRate },
            { new: true }
        )
        if (!professional) return res.status(404).json({ message: 'Profilo non trovato' })
        res.json(professional)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// GET /:id - singola pagina di dettaglio
router.get('/:id', async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id).populate('userId', 'firstname surname email avatar')
        if (!professional) return res.status(400).json({ message: 'Professionista non trovato'})
        res.json(professional)
    } catch (error) {
        res.status(500).json({message: 'Errore del server', error: error.message})
    }
})

// POST - crea profilo professionista
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { category, bio, city, hourlyRate, avatar } = req.body
        const existing = await Professional.findOne({ userId: req.user.id })
        if (existing) return res.status(400).json({ message: 'Profilo già esistente' })
        const professional = new Professional({
            userId: req.user.id,
            category, bio, city, hourlyRate,
            avatar: avatar || '',
            rating: 0, reviewsCount: 0, availability: []
        })
        await professional.save()
        res.status(201).json(professional)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

export default router
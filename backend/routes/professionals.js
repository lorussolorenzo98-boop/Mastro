import express from 'express'
import Professional from '../models/Professional.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

// GET - lista con filtri
router.get('/', async (req, res) => {
    try {
        const { category, city, minRate, maxRate } = req.query
        const filter = {}
        if (category) filter.category = category
        if (city) filter.city = { $regex: city, $options: 'i' }
        if (minRate || maxRate) {
            filter.hourlyRate = {}
            if (minRate) filter.hourlyRate.$gte = Number(minRate)
            if (maxRate) filter.hourlyRate.$lte = Number(maxRate)
        }
        const professionals = await Professional.find(filter).populate('userId', 'firstname surname email avatar')
        res.json(professionals)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// GET /me - tutti gli annunci del professionista loggato
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const professionals = await Professional.find({ userId: req.user.id })
        if (!professionals.length) {
            return res.status(404).json({ message: 'Nessun profilo trovato' })
        }
        res.json(professionals)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// GET /:id - dettaglio singolo annuncio
router.get('/:id', async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id).populate('userId', 'firstname surname email avatar')
        if (!professional) return res.status(404).json({ message: 'Professionista non trovato' })
        res.json(professional)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// POST - crea nuovo annuncio (rimosso check duplicato)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { category, bio, city, hourlyRate } = req.body
        const professional = new Professional({
            userId: req.user.id,
            category, bio, city, hourlyRate,
            rating: 0, reviewsCount: 0, availability: []
        })
        await professional.save()
        res.status(201).json(professional)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// PUT /:id - modifica annuncio specifico
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { category, bio, city, hourlyRate } = req.body
        const professional = await Professional.findOne({ _id: req.params.id, userId: req.user.id })
        if (!professional) return res.status(404).json({ message: 'Annuncio non trovato o non autorizzato' })
        const updated = await Professional.findByIdAndUpdate(
            req.params.id,
            { category, bio, city, hourlyRate },
            { new: true }
        )
        res.json(updated)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// DELETE /:id - elimina annuncio specifico
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const professional = await Professional.findOne({ _id: req.params.id, userId: req.user.id })
        if (!professional) return res.status(404).json({ message: 'Annuncio non trovato o non autorizzato' })
        await Professional.findByIdAndDelete(req.params.id)
        res.json({ message: 'Annuncio eliminato' })
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

export default router
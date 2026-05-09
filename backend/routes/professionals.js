import express from 'express';
import Professional from '../models/Professional.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router()

//GET - lista con filtri
router.get('/', async (req, res) => {
    try {
        const {category, city, minRate, maxRate} = req.query

        //costruzione filtro dinamico
        const filter = {}
        if (category) filter.category = category
        if (city) filter.city = { $regex: city, $options: 'i'}
        if (minRate || maxRate) {
            filter.hourlyRate = {}
            if (minRate) filter.hourlyRate.$gte = Number (minRate)
            if (maxRate) filter.hourlyRate.$gte = Number (maxRate)
        }
        
        const professionals = await Professional.find(filter).populate('userId', 'firstname surname email')
        res.json(professionals)
    } catch (error) {
        res.status(500).json({message: 'Errore del server', error: error.message})
    }
})

// GET /api/professionals/me - profilo del professionista loggato
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const professional = await Professional.findOne({ userId: req.user.id })
        if (!professional) {
            return res.status(404).json({ message: 'Profilo non trovato' })
        }
        res.json(professional)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

//GET - singola pagina di dettaglio di un professionista
router.get('/:id', async (req, res)=> {
    try {
        const professional = await Professional.findById(req.params.id).populate('userId', 'firstname surname email')
        if (!professional) {
            return res.status(400).json({ message: 'Professionista non trovato'})
        } 
        res.json(professional)
    } catch (error) {
        res.status(500).json({message: 'Errore del server', error: error.message})
    }
})

// POST /api/professionals - crea profilo professionista
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { category, bio, city, hourlyRate } = req.body

        const existing = await Professional.findOne({ userId: req.user.id })
        if (existing) {
            return res.status(400).json({ message: 'Profilo già esistente' })
        }

        const professional = new Professional({
            userId: req.user.id,
            category,
            bio,
            city,
            hourlyRate,
            rating: 0,
            reviewsCount: 0,
            avatar: '',
            availability: []
        })

        await professional.save()
        res.status(201).json(professional)

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})



export default router

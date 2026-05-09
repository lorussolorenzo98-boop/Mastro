import express from 'express'
import Booking from '../models/Booking.js'
import authMiddleware from '../middlewares/auth.js'
import Professional from '../models/Professional.js'
import { sendBookingConfirmation, sendBookingConfirmed, sendBookingCancelled } from '../services/emailService.js'


const router = express.Router()

// POST /api/bookings - crea prenotazione (protetta)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { professionalId, date, timeSlot, description, address, amount } = req.body

        const booking = new Booking({
            clientId: req.user.id,
            professionalId,
            date,
            timeSlot,
            description,
            address,
            amount
        })

        await booking.save()

        // invia email di conferma
        try {
            await sendBookingConfirmation(req.user.email, {
                date: new Date(date).toLocaleDateString('it-IT'),
                timeSlot,
                address,
                amount
            })
        } catch (emailError) {
            console.error('Errore invio email:', emailError)
        }

        res.status(201).json({ message: 'Prenotazione creata con successo', booking })

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// GET /api/bookings/me - prenotazioni dell'utente loggato (protetta)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ clientId: req.user.id })
            .populate('professionalId')
            .sort({ createdAt: -1 })

        res.json(bookings)

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// GET /api/bookings/professional - prenotazioni ricevute dal professionista
router.get('/professional', authMiddleware, async (req, res) => {
    try {
        const professional = await Professional.findOne({ userId: req.user.id })
        if (!professional) {
            return res.status(404).json({ message: 'Profilo professionista non trovato' })
        }

        const bookings = await Booking.find({ professionalId: professional._id })
            .populate('clientId', 'firstname surname email')
            .sort({ createdAt: -1 })

        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// PUT /api/bookings/:id/status - aggiorna stato prenotazione
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('clientId', 'firstname surname email')

        // invia email in base allo stato
        try {
            if (status === 'confirmed') {
                await sendBookingConfirmed(booking.clientId.email, {
                    date: new Date(booking.date).toLocaleDateString('it-IT'),
                    timeSlot: booking.timeSlot,
                    address: booking.address,
                    amount: booking.amount
                })
            } else if (status === 'cancelled') {
                await sendBookingCancelled(booking.clientId.email, {
                    date: new Date(booking.date).toLocaleDateString('it-IT'),
                    timeSlot: booking.timeSlot,
                    amount: booking.amount
                })
            }
        } catch (emailError) {
            console.error('Errore invio email:', emailError)
        }

        res.json(booking)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

export default router
import express from 'express'
import Booking from '../models/Booking.js'
import authMiddleware from '../middlewares/auth.js'
import Professional from '../models/Professional.js'
import { sendBookingConfirmation, sendBookingConfirmed, sendBookingCancelled } from '../services/emailService.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { professionalId, date, timeSlot, description, address, amount } = req.body
        const booking = new Booking({
            clientId: req.user.id,
            professionalId, date, timeSlot, description, address, amount
        })
        await booking.save()
        try {
            await sendBookingConfirmation(req.user.email, {
                date: new Date(date).toLocaleDateString('it-IT'),
                timeSlot, address, amount
            })
        } catch (emailError) {
            console.error('Errore invio email:', emailError)
        }
        res.status(201).json({ message: 'Prenotazione creata con successo', booking })
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// GET /api/bookings/me
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ clientId: req.user.id })
            .populate({
                path: 'professionalId',
                populate: { path: 'userId', select: 'firstname surname avatar' }
            })
            .sort({ createdAt: -1 })
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

// GET /api/bookings/professional
router.get('/professional', authMiddleware, async (req, res) => {
    try {
        const professionals = await Professional.find({ userId: req.user.id })
        if (!professionals.length) {
            return res.status(404).json({ message: 'Profilo professionista non trovato' })
        }
        const professionalIds = professionals.map(p => p._id)
        const bookings = await Booking.find({ professionalId: { $in: professionalIds } })
            .populate('clientId', 'firstname surname email avatar')
            .sort({ createdAt: -1 })
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message })
    }
})

router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('clientId', 'firstname surname email')
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
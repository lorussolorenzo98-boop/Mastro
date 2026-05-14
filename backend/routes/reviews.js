import express from 'express'
import Review from '../models/Review.js'
import Booking from '../models/Booking.js'
import Professional from '../models/Professional.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

// POST - crea recensione
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body

    // verifica che la prenotazione esista, sia completata e appartenga al cliente
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Prenotazione non trovata' })
    if (booking.clientId.toString() !== req.user.id) return res.status(403).json({ message: 'Non autorizzato' })
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Puoi recensire solo prenotazioni completate' })

    // verifica che non esista già una recensione per questa prenotazione
    const existing = await Review.findOne({ bookingId })
    if (existing) return res.status(400).json({ message: 'Hai già recensito questa prenotazione' })

    const review = new Review({
      clientId: req.user.id,
      professionalId: booking.professionalId,
      bookingId,
      rating,
      comment,
    })
    await review.save()

    // aggiorna rating e reviewsCount sul professionista
    const allReviews = await Review.find({ professionalId: booking.professionalId })
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await Professional.findByIdAndUpdate(booking.professionalId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: allReviews.length,
    })

    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: 'Errore del server', error: error.message })
  }
})

// GET - recensioni di un professionista
router.get('/professional/:professionalId', async (req, res) => {
  try {
    const reviews = await Review.find({ professionalId: req.params.professionalId })
      .populate('clientId', 'firstname surname avatar')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Errore del server', error: error.message })
  }
})

// GET - recensioni già lasciate dal cliente (per sapere quali booking ha già recensito)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ clientId: req.user.id })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Errore del server', error: error.message })
  }
})

export default router
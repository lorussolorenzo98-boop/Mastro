import express from 'express';
import Stripe from 'stripe';
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()
const stripe = new Stripe (process.env.STRIPE_SECRET_KEY)

//CREAZIONE DEL PAYMENT INTENT
router.post('/create-intent', authMiddleware, async (req, res) => {
    try {
        const {amount} = req.body
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, //moltiplichiamo per 100 perché Stripe lavora in centesimi
            currency: 'eur',
            metadata: {userId: req.user.id}
        })
        res.json({ clientSecret: paymentIntent.client_secret})
    } catch (error) {
        res.status(500).json({message: 'Errore Stripe', error: error.message})
    }
})

export default router
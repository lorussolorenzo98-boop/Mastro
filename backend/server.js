import express from "express";
import dotenv from "dotenv";
import {connect} from "./db.js";
import cors from "cors";
import authRoutes from './routes/auth.js'
import professionalRoutes from './routes/professionals.js'
import bookingRoutes from './routes/bookings.js'
import paymentRoutes from './routes/payments.js'
import uploadRoutes from './routes/upload.js'


dotenv.config();
connect();

const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/professionals', professionalRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/upload', uploadRoutes)



app.get('/', (req, res) => {
  res.json({ message: 'Mastro API funziona' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`)
})
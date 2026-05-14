import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  clientId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',         required: true },
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional', required: true },
  bookingId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Booking',      required: true, unique: true },
  rating:         { type: Number, required: true, min: 1, max: 5 },
  comment:        { type: String, default: '' },
}, { timestamps: true })

const Review = mongoose.model('Review', ReviewSchema)
export default Review
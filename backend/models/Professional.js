import mongoose from "mongoose";

const ProfessionalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['idraulico', 'elettricista', 'muratore', 'pulizie', 'giardinaggio']
    },
    bio: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    availability: [{
        day: String,
        slots: [String]
    }],
    avatar: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Professional = mongoose.model('Professional', ProfessionalSchema)

export default Professional
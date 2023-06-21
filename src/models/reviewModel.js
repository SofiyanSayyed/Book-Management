const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    bookId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        value: {
            type: String,
        }
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps: true})


module.exports = mongoose.model('Review', reviewSchema)
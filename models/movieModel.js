import mongoose from 'mongoose'

const movieSchema = mongoose.Schema({
    user: { // NOT REALLY NEEDED, but for future potential other Admin users being added!
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Movie = mongoose.model('Movie', movieSchema)

export default Movie
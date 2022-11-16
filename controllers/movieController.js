import expressAsyncHandler from 'express-async-handler'
import Movie from '../models/movieModel.js'

// @desc Fetch all movies
// @route GET /api/movies
// @access Public
export const getMovies = expressAsyncHandler(async(req, res) => {
    const movies = await Movie.find({})

    res.json(movies)
})
import express from 'express'
import newMovie from '../models/UploadMovie.js'
import { pagination } from '../../functions/functions.js'

const movies = express.Router()



movies.get('/', async (req, res) => {
    const { page = 1 } = req.query
    const limit = 4
    const allMovies = await newMovie.countDocuments(); // Total count of movies
    const totalPage = Math.ceil(allMovies / limit) // Total pages
    const movie = await newMovie.find({})
                                .skip((page - 1) * limit)
                                .limit(limit)
    const pagi = pagination(page, totalPage)
    res.render('allMovies', { movie,  pagi})
})


movies.get('/:id', async (req, res) => {
    const movie = await newMovie.findById(req.params.id)
    res.render('movieDetails', { movie })
})

export default movies
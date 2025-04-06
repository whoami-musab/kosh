import express from 'express'
import newMovie from '../models/UploadMovie.js'

const movies = express.Router()

movies.get('/', async (req, res)=>{
    const movie = await newMovie.find({})
    res.render('allMovies', {movie})
})


movies.get('/:id', async (req, res)=>{
    const movie = await newMovie.findById(req.params.id)
    res.render('movieDetails', {movie})
})

export default movies
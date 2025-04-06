import express from 'express'
import newMovie from '../models/UploadMovie.js'

const watchRouter = express.Router()

watchRouter.get('/:id', async (req, res)=>{
    const movie = await newMovie.findById(req.params.id)
    res.render('watchMovie', {movie : movie})
})

export default watchRouter
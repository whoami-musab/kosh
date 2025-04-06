import mongoose from "mongoose";

const movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    imgPath: {type: String, required: true}
})

const newMovie = mongoose.model('Movie', movieSchema)

export default newMovie
import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import session from 'express-session'
import connectDB from './config/conn.js'

import Register from './src/models/Register.js'

import { notFound, errHandler } from './src/controllers/errors.js'
import { pagination } from './functions/functions.js'

import loginRouter from './src/controllers/login.js'
import profileRouter from './src/controllers/profile.js'
import logoutRouter from './src/controllers/logout.js'
import users from './src/controllers/users.js'
import registerRouter from './src/controllers/register.js'
import uploadMovie from './src/controllers/upload-movie.js'
import newMovie from './src/models/UploadMovie.js'
import movies from './src/controllers/movies.js'
import watchRouter from './src/controllers/watch.js'
import forgetPass from './src/controllers/forgotPassword.js'
import multer from 'multer'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config()

const app = express()
connectDB()

app.set('views', path.join(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(async (req, res, next) => {
    if (req.session && req.session.user) {
        const userData = await Register.findById({ _id: req.session.user.id })
        if (userData) {
            res.locals.user = userData
        } else {
            res.locals.user = null
        }
    } else {
        res.locals.user = null
    }
    next()
})

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', async (req, res) => {
    const { page = 1 } = req.query
    const limit = 5
    const allMovie = await newMovie.countDocuments()
    const totalPage = Math.ceil(allMovie / limit)
    const movie = await newMovie.find({}).skip((page - 1) * limit).limit(limit)
    const pagi = pagination(page, totalPage)
    res.render('index', { movie, currentPage: Number(page), pagi })
})

app.use('/profile', profileRouter)
app.use('/users', users)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/logout', logoutRouter)
app.use('/upload-movie', uploadMovie)
app.use('/movies', movies)
app.use('/watch', watchRouter)
app.use('/reset-password', forgetPass)

app.use(notFound)
app.use(errHandler)

app.use((err, req, res, next)=>{
    if(err instanceof multer.MulterError || err.message.includes('Only')){
        return res.status(400).json({message: err.message})
    }
    next(err)
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.CLIENT_URL}`)
})
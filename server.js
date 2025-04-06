import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import session from 'express-session'

import Register from './src/models/Register.js'

import { notFound } from './src/controllers/errors.js'

import loginRouter from './src/controllers/login.js'
import profileRouter from './src/controllers/profile.js'
import logoutRouter from './src/controllers/logout.js'
import registerRouter from './src/controllers/register.js'
import uploadMovie from './src/controllers/upload-movie.js'
import newMovie from './src/models/UploadMovie.js'
import movies from './src/controllers/movies.js'
import watchRouter from './src/controllers/watch.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config()

const app = express()

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected successfully!!!...'))
    .catch((err) => console.log('Error connecting to DB: ', err))

app.set('views', path.join(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(async (req, res, next)=>{
    if(req.session && req.session.user){
        const userData = await Register.findById({_id: req.session.user.id})
        if(userData){
            res.locals.user = userData
        }else{
            res.locals.user = null
        }
    }else{
        res.locals.user = null
    }
    next()
})

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', async (req, res) => {
    res.render('index', { redirect: '/movies' })
})

app.use('/profile', profileRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/logout', logoutRouter)
app.use('/upload-movie', uploadMovie)
app.use('/movies', movies)
app.use('/watch', watchRouter)

// app.all('*', app.use(notFound))

app.use(notFound)
app.listen(process.env.PORT, () => {
    console.log('Server running on http://localhost:3000')
})

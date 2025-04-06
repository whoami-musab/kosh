import express from 'express';
import multer from 'multer';
import path from 'path';
import newMovie from '../models/UploadMovie.js';

const uploadMovie = express.Router();

// Render upload page if user is logged in
uploadMovie.get('/', (req, res) => {
    if (req.session.user) {
        res.render('upload-movie');
    } else {
        return res.redirect('/login');
    }
});

// Setup multer to upload image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs/'); // Specify directory for storing images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique file name
    },
});

const upload = multer({ storage: storage });

// Handle movie upload
uploadMovie.post('/', upload.single('image'), async (req, res) => {
    const { title, desc } = req.body;
    const imagePath = req.file ? `/imgs/${req.file.filename}` : null;

    try {
        // Ensure all required fields are present
        if (!title || !desc || !imagePath) {
            return res.status(400).json({ message: 'Please fill all fields and upload an image!' });
        }

        const movie = await newMovie.findOne({title})

        if(movie){
            return res.status(400).json({message: 'Movie already in database!.'})
        }

        // Create new movie entry
        const newArticle = new newMovie({
            title: title,
            description: desc,
            imgPath: imagePath,
        });

        await newArticle.save();
        return res.status(201).json({ message: 'Movie uploaded successfully!', redirect: '/movies' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading the movie!' });
    }
});

export default uploadMovie;
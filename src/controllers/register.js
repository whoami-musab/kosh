import express from 'express';
import Register from '../models/Register.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import multer from 'multer';
import path from 'path'

const registerRouter = express.Router();
dotenv.config()

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '/imgs/')
    },
    filename: (req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

registerRouter.get('/', (req, res) => {
    res.render('register')
});

registerRouter.post('/', async (req, res) => {
    const { name, email, address, phone, password } = req.body;

    // Check if email and password are provided
    if (!name || !email || !password || !address || !phone) {
        return res.status(400).json({ message: 'Please fill all fields!!...' });  // return here
    }

    try {
        // Find the user by email
        const user = await Register.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already registered in KOSH!!...' });  // return here
        }

        // Hashed the password
        const hashedPass = await bcrypt.hash(password, 10);

        // Generate a JWT token with an expiration time of 1 hour
        const token = jwt.sign(
            { name: name, email: email }, // Payload
            process.env.SECRET,                      // Secret key
            { expiresIn: '1h' }
        );

        const newUser = new Register({
            name: name,
            email: email,
            address: address,
            phone: phone,
            password: hashedPass,
            token: token
        })

        await newUser.save()

        // Return to login page if successfully registered
        return res.status(201).json({ message: 'Registered successfully', token, redirect: '/login' })


    } catch (err) {
        console.error("Registration error:", err);  // Log the error for debugging
        return res.status(500).json({ message: 'Error Registration, please try again!!...' });  // return here
    }
});

export default registerRouter;

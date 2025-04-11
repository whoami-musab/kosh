import express from 'express';
import Register from '../models/Register.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const loginRouter = express.Router();

loginRouter.get('/', (req, res) => {
    if(req.session.user){
        res.redirect('/profile');
    }else{
        res.render('login');
    }
});

loginRouter.post('/', async (req, res) => {
    const { email, password, name } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields!!...' });  // return here
    }

    try {
        // Find the user by email
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials!!. User not found' });  // return here
        }

        // Compare the entered password with the stored hashed password
        const passMatch = await bcrypt.compare(password, user.password);

        if (!passMatch) {
            return res.status(400).json({ message: 'Invalid credentials!!. Username or password is incorrect' });  // return here
        }
        // Generate a JWT token with an expiration time of 1 hour
        const token = jwt.sign(
            { userID: user._id, name: user.name }, // Payload
            process.env.SECRET,                      // Secret key
            { expiresIn: '1h' }                     // Token expiration
        );

        // Register user session
        req.session.user = {
            id: user._id,
            username: email,
            token: token,
            isAdmin: user.isAdmin
        }

        // Send the token back to the client
        return res.status(200).json({message: 'Login successfully', token, redirect: '/profile'})


    } catch (err) {
        console.error("Login error:", err);  // Log the error for debugging
        return res.status(500).json({ message: 'Error Login, please try again!!...' });  // return here
    }
});

export default loginRouter;

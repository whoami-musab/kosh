import Register from "../models/Register.js";
import express from 'express'

const profileRouter = express.Router()

profileRouter.get('/', async (req, res)=>{
    try{
        if(req.session && req.session.user){
            const user = await Register.findById(req.session.user.id)
            // if(!user){
            //     res.status(400).json({message: 'User not found.'})
            // }
            res.render('profile', {user: req.session.user})
            // console.log(userData)
        }else{
            res.redirect('/login')
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Server error'})
    }
})

export default profileRouter
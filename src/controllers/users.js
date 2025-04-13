import express from 'express'
import Register from '../models/Register.js'
const users = express.Router()

users.get('/', async (req, res) => {
    if (req.session.user && req.session.user?.isAdmin === true) {
        const users = await Register.find({})
        return res.render('users', { users })
    } else {
        return res.status(401).json({ message: 'Unauthorized please try again.', redirect: req.originalUrl })
    }
})

// users.post('/delete/:id', async (req, res)=>{
//     const {id} = req.body
//     const user = await Register.findById(id)
//     if(user){
//         user = await Register.findByIdAndDelete(id)
//         return res.status(200).json({message: 'User Deleted successfully.'})
//     }else{
//         return res.status(500).json({message: 'Something went wronge.'})
//     }
// })

export default users
import express from 'express'

const logoutRouter = express.Router()

logoutRouter.get('/', (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(400).json({message: 'Error logout.'})
        }
        // return res.status(200).json({message: 'Logged out seccessfully.', redirect: '/login'})
        return res.redirect('/login')
    })
})

export default logoutRouter
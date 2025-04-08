import Register from "../models/Register.js";
import express from 'express'
import bcrypt from "bcryptjs";
import multer from "multer";
import path from 'path'

const profileRouter = express.Router()

profileRouter.get('/', async (req, res) => {
    try {
        if (req.session && req.session.user) {
            const user = await Register.findById(req.session.user.id)
            res.render('profile', { user })
        } else {
            res.redirect('/login')
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/avatars')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    },
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed.'));
    }
})


profileRouter.put('/', upload.single('profileImg'), async (req, res) => {
    const id = req.session.user?.id
    if (!id) {
        return res.status(401).json({ message: 'Unauthorized please try again!...', redirect: '/login' })
    }
    try {
        const user = await Register.findById(id)
        if (!user) {
            return res.status(401).json({ message: 'You can\'t edit please try again!...', redirect: '/login' })
        }
        const { name, email, address, phone, password } = req.body
        const updateFields = {}
        if (email && email.toLowerCase() !== user.email.toLowerCase()) {
            // const isExistEmail = await Register.findOne({email})
            // if(isExistEmail){
            //     return res.status(400).json({message: 'This email already exists. Please try again!...'})
            // }
            updateFields.email = email
        }
        if (name && user.name !== name) {
            updateFields.name = req.body.name
        }
        if (password && password.trim() !== '') {
            const isSamePass = await bcrypt.compare(password, user.password)
            if (isSamePass) {
                return res.status(400).json({ message: 'Your updated password is the same. Please try again!...' })
            }
            updateFields.password = await bcrypt.hash(password, 10)
        }
        if (address && user.address !== address) {
            updateFields.address = req.body.address
        }
        if (phone && user.phone !== phone) {
            updateFields.phone = req.body.phone
        } if (req.file) {
            updateFields.profileImg = `/avatars/${req.file.filename}`
        }
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No changes detected in your profile. Please try again!...' })
        }
        const updatedUserData = await Register.findByIdAndUpdate(id, {
            $set: updateFields
        }, { new: true })
        return res.status(200).json({
            message: 'User updated successfully!..', redirect: '/profile', user: {
                profileImg: updatedUserData.profileImg
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred while updating the profile!..', err: err.message })
    }
})

export default profileRouter





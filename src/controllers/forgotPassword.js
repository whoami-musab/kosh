import express from 'express'
import dotenv from 'dotenv'
import Register from '../models/Register.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
dotenv.config()


const forgetPass = express.Router()

/**
 * @method GET
 * @route '/reset-password'
 * @access public
 */

forgetPass.get('/', (req, res) => {
    return res.render('reset-password')
})

/**
 * @method POST
 * @route '/reset-password'
 * @access public
 */

forgetPass.post('/', async (req, res) => {

    const { email } = req.body
    console.log(email)
    try {

        const user = await Register.findOne({email})

        if (!user) {
            return res.status(200).json({ message: 'If that email exists, we sent a reset link.' })
        }

        const secret = process.env.SECRET + user.password

        const token = jwt.sign({ id: user._id, email: user.email }, secret, {
            expiresIn: '10m'
        })

        const link = `${process.env.CLIENT_URL}/reset-password/reset/${user._id}/${token}`

        const sendMail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        })


        const options = {
            from: "KOSH Support",
            to: user.email,
            subject: 'Reset your KOSH Password',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
                            <h2 style="color: #4F46E5;">Reset Your Password</h2>
                            <p>Hello,</p>
                            <p>You requested to reset your password for your <strong>KOSH</strong> account.</p>
                            <p>Please click the button below to reset your password. This link will expire in 10 minutes.</p>
                            <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
                            Reset Password
                            </a>
                            <p>If you didn’t request this, you can safely ignore this email.</p>
                            <p style="margin-top: 40px;">Best regards,<br />KOSH Team</p>
                        </div>`
        }

        console.log("📤 Attempting to send email to:", user.email)
        // await sendMail.sendMail(options)
        const info = await sendMail.sendMail(options)
            .then(info => console.log('✅ Email sent to: ', info.response))
            .catch(err => console.log('❌ Email error: ', err))

        console.log(info.response)

        return res.render('email-sent', { message: 'Email sent successfully.' })

    } catch (err) {
        console.error('Server error:', err)
        return res.status(500).json({ message: 'Internal Server error. Please try again.' })
    }
})

/**
 * @method GET
 * @route '/reset/:id/:token'
 * @access public
 */

forgetPass.get('/reset/:id/:token', async (req, res) => {

    const { id, token } = req.params
    try {
        const user = await Register.findById(id)

        if (!user) {
            return res.status(200).json({ message: 'If that email exists, we sent a reset link.' })
        }

        const secret = process.env.SECRET + user.password
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid or expired token' })
            }
        })

        return res.render('reset', { email: user.email, id, token })

    } catch (err) {
        return res.status(500).json({ message: 'Internal Server error. Please try again.' })

    }
})

/**
 * @method POST
 * @route '/reset'
 * @access public
 */

forgetPass.post('/reset', async (req, res) => {
    const { password, email, token, id } = req.body

    const user = await Register.findById(id)
    if (!user) {
        return res.status(200).json({ message: 'If that email exists, we sent a reset link.' })
    }
    const secret = process.env.SECRET + user.password

    try {

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid or expired token. Please try again' })
            }
        })
        const isPass = await bcrypt.compare(password, user.password)

        if (isPass) {
            return res.status(400).json({ message: 'You can\'t use an old password' })
        }

        const hashedPass = await bcrypt.hash(password, 10)
        user.password = hashedPass

        await user.save()

        return res.status(200).json({
            message: 'Password reset successfully. Please Login again',
            redirect: '/login'
        })

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error. Please try again' })
    }
})

export default forgetPass
import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true, minlength: 4},
    isAdmin: {type: Boolean, required: false, default: false},
    token: {type: String, required: false}
})

const Register = mongoose.model('Register', registerSchema)

export default Register
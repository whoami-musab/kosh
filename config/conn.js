import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => )
//     .catch((err) => )


    function connectDB(){
        try{
            mongoose.connect(process.env.MONGO_URI)
            console.log('Connected successfully!!!...')
        }catch(err){
            console.log('Error connecting to DB: ', err)
        }
    }

export default connectDB
import Register from "../models/Register.js"

export const notFound = (req, res, next)=>{
    const statusCode = res.statusCode === 200 ? 404 : res.statusCode
    if(statusCode){
        return res.status(statusCode).render('not-found')
    }
    next()
}

export const errHandler = async (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let user = null
    try{
        if(req.session.user?.id){

            user = await Register.findById(req.session.user?.id)
        }
    }catch(fetchErr){
        console.error('Error fetching user in errHandler: ', fetchErr.message)
    }
    return res.status(statusCode).render('502', {message: err.message, user})
    // res.status(statusCode).json({message: err.message})
}
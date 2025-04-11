export const notFound = (req, res, next)=>{
    const statusCode = res.statusCode === 200 ? 404 : res.statusCode
    if(statusCode){
        return res.render('not-found')
    }
    next()
}

export const errHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.render('502', {message: err.message})
    // res.status(statusCode).json({message: err.message})
}
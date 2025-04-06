export const notFound = (req, res, next)=>{
    const statusCode = res.statusCode === 200 ? 404 : res.statusCode
    if(statusCode){
        return res.render('not-found')
    }
    next()
}
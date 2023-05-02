const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authentication = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')) throw new UnauthenticatedError('you are not authorized')
    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {name:payload.name,userId:payload.userId}
        next()
    }catch(err){
        throw new UnauthenticatedError('you are not authorized')
    }
    
}

module.exports = authentication


const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const register = async(req,res)=>{
    const {name,password,email} = req.body
    console.log(req.body)
    if(!name || !password || !email)
        return res.status(StatusCodes.BAD_REQUEST).json({'msg':'username password and email must be provided'})
    const user =  await User.create(req.body) 
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({
        user:{
            name,
        
        },
        token
    })
}

const login = async(req,res)=>{

    const {email,password} = req.body

    if(!email || !password) throw new BadRequestError('username and password must be provided')

    const foundUser = await User.findOne({email})
    const match = await foundUser.comparePassword(password)
    if(!match) throw new UnauthenticatedError('invalid password')
    
    const token = foundUser.createJWT()

    res.status(StatusCodes.OK).json({
        name:foundUser.name,
        token
    })

}

module.exports = {
    register,
    login
}
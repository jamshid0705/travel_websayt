const User=require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const catchAsync = require('../utility/catchAsync')
const AppError=require('./../utility/appError')

const signToken=(id)=>{
  return jwt.sign({id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXPIRES_IN})
}
///////////// sign up //////////////
exports.signup=catchAsync(async(req,res)=>{
  const user=await User.create(req.body)

  const token=signToken(user._id)
  res.status(200).json({
    status:'seccess',
    jwt:token,
    data:{
      user
    }
  })
})

///////////// sign in ///////////////
exports.login=catchAsync(async(req,res,next)=>{
  const {email,password}=req.body
  // 1 email va password bor yo'qligini ni tekshirish
  if(!email || !password){
    return next(new AppError('Email yoki password yoq !',400))
  }
  // 2 passwordni tekshirish 
  const user=await User.findOne({email}).select('+password')
  if(!(user) || !(await bcrypt.compare(password,user.password))){
    return next(new AppError('Email yoki password xato !',401))
  }
  // 3 new token jo'natish
  const token=signToken(user._id)

  res.status(200).json({
    status:'success',
    jwt:token
  })
})
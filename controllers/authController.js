const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const catchAsync = require('../utility/catchAsync')
const AppError=require('./../utility/appError')
const User=require('../models/userModel')

const signToken=(id)=>{
  return jwt.sign({id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXPIRES_IN})
}
///////////// sign up //////////////
exports.signup=catchAsync(async(req,res)=>{
  const user=await User.create(req.body)

  const token=signToken(user._id)
  res.status(200).json({
    status:'seccess',
    token:token,
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
    token:token
  })
})

///////////////////// protect middleware //////////////////
exports.protect=catchAsync(async(req,res,next)=>{
  // 1 token bor yo'qligini tekshirish
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }
  if(!token || token==='null'){
    return next(new AppError('Token y\`oq! Iltimos tekshirib ko\`ring !',401))
  }
  console.log(token)
  // 2 token ni tekshirish
  const verifyToken=await jwt.verify(token,process.env.JSON_SECRET)
  // 3 tokendan id ni olib o'sha id lik userni topish
  
  const newUser=await User.findById(verifyToken.id)
  if(!newUser){
    return next(new AppError('Bunday user mavjud emas. Iltimos tokenni tekshiring !',401))
  }
  // 4 password yangilangan bo'lsa 
  if(newUser.passwordChangedDate.getTime()/1000>token.iat){
    return next(new AppError('Sizning tokenningiz yaroqsiz !',401))
  }

  req.user=newUser
  next()
})

//////////////////// role middleware /////////////////
exports.role=(...roles)=>{

  return (req,res,next)=>{
      console.log("rolesssssssssssssss",roles)
    if(!roles.includes(req.user.role)){
      return next(new AppError('Sizga bu ishni bajarish mumkin emas !',401))
    }
    next()
  }
}

/////////////// forget password ///////////
exports.forgotPassword=catchAsync(async(req,res,next)=>{
  // 1 email orqali user ni topish
  const user=await User.findOne({email:req.body.email})
  if(!user){
    return next(new AppError('Bu emailli user mavjud emas !',403))
  }

  // 2 reset token yaratish
  const token=user.hashResetToken()
  await user.save({validateBeforeSave:false})

})
////////////// resent password ////////////
exports.resentPassword=catchAsync(async(req,res,next)=>{
  
})
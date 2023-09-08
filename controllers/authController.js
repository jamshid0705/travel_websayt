const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const catchAsync = require('../utility/catchAsync')
const AppError=require('./../utility/appError')
const User=require('../models/userModel')
const Email=require('../utility/email')

const signToken=(id)=>{
  return jwt.sign({id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXPIRES_IN})
}

// cookie ga token yuborish
const sendToken=(user,statusCode,res,req)=>{
  const token=signToken(user._id)

  const cookieOption={
    expires:new Date(Date.now()+process.env.JSON_COOKIE_EXPIRES_IN*60*60*1000),
    httpOnly:true
  }

  if(process.env.NODE_ENV==='production') cookieOption.secure=true

  res.cookie('jwt',token,cookieOption)
  user.password=undefined
    res.status(statusCode).json({
      status:'success',
      token:token,
      data:{
        user
      }
    })
}
///////////// sign up //////////////
exports.signup=catchAsync(async(req,res)=>{
  
  const user=await User.create(req.body)
  // const url=`${req.protocol}://${req.get('host')}/me`
  const token=signToken(user._id)
  sendToken(user,200,res,req)
  const url='http://127.0.0.1:3000/'
  await new Email(user,url).sendWelcome()
  
  res.status(200).json({
    status: 'success',
    token: token,
    data: user,
  });
  
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
  sendToken(user,200,res,req)

})

///////////////// logout ///////////////////////
exports.logout=catchAsync((req,res,next)=>{
  res.cookie('jwt','loggedout',{
    expiresIn:new Date(Date.now())+10*1000,
    httpOnly:true
  })
  res.status(200).json({status:'success'})
})

///////////////////// protect middleware //////////////////
exports.protect=catchAsync(async(req,res,next)=>{
  // 1 token bor yo'qligini tekshirish
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }else if(req.cookies.jwt){
    token=req.cookies.jwt
  }
  if(!token || token==='null'){
    return next(new AppError('Token y\`oq! Iltimos tekshirib ko\`ring !',401))
  }
  
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
  res.locals.user=newUser
  next()
})

//////////////////// is login in /////////////////////
exports.isLoginIn=async(req,res,next)=>{
 
  try {
    if(req.cookies.jwt){
      // 2 token ni tekshirish
    const verifyToken=await jwt.verify(req.cookies.jwt,process.env.JSON_SECRET)
    // 3 tokendan id ni olib o'sha id lik userni topish
    
    const newUser=await User.findById(verifyToken.id)
    if(!newUser){
      return next()
    }
    // 4 password yangilangan bo'lsa 
    if(newUser.passwordChangedDate.getTime()/1000>verifyToken.iat){
      return next()
    }
    // console.log(res)
    res.locals.user=newUser
    return next()
    }
  } catch (error) {
    return next()
  }
  next()
}

//////////////////// role middleware /////////////////
exports.role=(...roles)=>{

  return (req,res,next)=>{
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
  // 3 emailga jo'natish
  const resentLink=`${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${token}`
  try {
    await new Email(user,resentLink).sendResetPassword()
    res.status(200).json({
      status:"success",
      message:'Token emailga yubrildi !'
    })
  } catch (error) {
    // console.log(error)
    user.resetTokenHash=undefined,
    user.resetTokenVaqt=undefined
    await user.save({validateBeforeSave:false})
    
    return next(new AppError('Token emailga yuborilmadi. Iltimos yana urinib ko\`ring !',500))
  }
  next()

})
////////////// resent password ////////////
exports.resentPassword=catchAsync(async(req,res,next)=>{
  //1 token olamiz urldan
  const resetToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user=await User.findOne({resetTokenHash:resetToken,resetTokenVaqt:{$gt:Date.now()}})
 
  // 2 user bormi tekshiramiz va new userni hosil qilamiz
  if(!user){
    return next(new AppError('Bunday user mavjud emas, reset tokenda kamchilik',401))
  }
 
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('Siz parolni kiritishingiz kk', 404));
  }
  if (!(req.body.password === req.body.passwordConfirm)) {
    return next(
      new AppError('Parollar teng emas ! Iltimos bir xil parol kiriting', 404)
    );
  }

  user.password=req.body.password
  user.passwordConfirm=req.body.passwordConfirm
  user.passwordChangedDate = Date.now();

  user.resetTokenHash=undefined
  user.resetTokenVaqt=undefined

  await user.save()
  // 3 new jwt 
  sendToken(user,200,res,req)

})

exports.updatePassword=catchAsync(async(req,res,next)=>{
  // 1 userni topish
  const user=await User.findById(req.user._id).select('+password')
  console.log(user)
  // 2 password ni tekshirish bcrypt bilan
  if(!(await bcrypt.compare(req.body.passwordCorrunt,user.password))){
    return next(new AppError('Siz xato password kiritdingiz !',401))
  }
  // 3 update password
  user.password=req.body.password
  user.passwordConfirm=req.body.passwordConfirm
  await user.save()
  // 4 jwt send
  sendToken(user,200,res,req)

})
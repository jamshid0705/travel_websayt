const User = require('../models/userModel');
const catchAsync=require('./../utility/catchAsync')
const AppError=require('./../utility/appError')
const factory=require('./handlerFactory')

exports.getMe=(req,res,next)=>{
  req.params.id=req.user.id
  next()
}

exports.updateMe=catchAsync(async(req,res,next)=>{
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('Bu updatePassword urli emas. Uning url /updateMyPassword'))
  }
  
  const user=await User.findByIdAndUpdate(req.user.id,req.body,{new:true,runValidators:true})

  res.status(200).json({
    status:'success',
    data:{
      user
    }
  })
})

exports.deleteMe=catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false})

  res.status(204).json({
    status:'success',
    data:null
  })
})


// add user
exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Siz faqat /sign up url orqali ro\'yhatdan o\'tishingiz mumkin !',
  });
};

exports.getUsers =factory.getAll(User)
exports.getUserId = factory.getOneId(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)

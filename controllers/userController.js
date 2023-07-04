const User = require('../models/userModel');
const catchAsync=require('./../utility/catchAsync')
const AppError=require('./../utility/appError')
// get all users
exports.getUsers =catchAsync( async(req, res,next) => {
  const user = await User.find()
  res.status(200).json({
      status: 'success',
      results: user.length,
      data: {
        user,
      },
    });
});

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
// get id user
exports.getUserId = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// update user
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// add user
exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// delete user
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};

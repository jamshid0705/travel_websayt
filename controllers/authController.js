const User=require('../models/userModel')
const catchAsync = require('../utility/catchAsync')

exports.signup=catchAsync(async(req,res)=>{
  const user=await User.create(req.body)

  res.status(200).json({
    status:'seccess',
    data:{
      user
    }
  })
})
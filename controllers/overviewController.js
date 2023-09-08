const catchAsync = require("../utility/catchAsync");
const Tour=require('../models/tourModel')
const AppError=require('../utility/appError');
const User = require("../models/userModel");

exports.getTour=catchAsync(async(req,res,next)=>{
  const tours=await Tour.find()
  res.status(200).render('overview',{
    title:'All Tours',
    tours
  })
})

exports.getOneTour=catchAsync(async(req,res,next)=>{
  const tour=await Tour.findOne({slug:req.params.slug}).populate({path:'reviews',select:'review rating  user'})
  // if(!tour){
  //   return next(new AppError('Bunday name li tour topilmadi !',404))
  // }
  console.log(tour)
  res.status(200).render('tour',{
    title:tour.name,
    tour
  })
})

exports.login=catchAsync(async(req,res,next)=>{
   res.status(200).render('login',{
    title:'login'
  })
})

////////////// sign up////////////////////
exports.signup=catchAsync(async(req,res,next)=>{
  res.status(200).render('signup')
})

exports.getAccount=(req,res)=>{
    res.status(200).render('account',{
    title:'Your account'
  })
}

exports.updateUser=async(req,res)=>{
  const updateUser=await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
  },{
    new:true,
    runValidators:true
  })
   res.status(200).render('account',{
    title:'Your account',
    user:updateUser
  })
}
const catchAsync = require("../utility/catchAsync");
const Tour=require('../models/tourModel')

exports.getTour=catchAsync(async(req,res,next)=>{
  const tours=await Tour.find()
  res.status(200).render('overview',{
    title:'All Tours',
    tours
  })
})

exports.getOneTour=catchAsync(async(req,res)=>{
  const tour=await Tour.findOne({slug:req.params.slug}).populate({path:'reviews',select:'review rating  user'})
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
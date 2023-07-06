const catchAsync=require('../utility/catchAsync')
const AppError=require('../utility/appError')
const Review=require('../models/reviewModel')

const sendRes=(data,status,res)=>{
  res.status(status).json({
    status:data?'success':'fail',
    results:data?data.length:undefined,
    data:{
      reviews:data?data:undefined
    }
  })
}

exports.getAllReviews=catchAsync(async(req,res,next)=>{
  const review=await Review.find()

  sendRes(review,200,res)
})

exports.getOneReviews=catchAsync(async(req,res,next)=>{
  const review=await Review.findById({_id:req.params.id})

  sendRes(review,200,res)
})


exports.addReviews=catchAsync(async(req,res,next)=>{
  //  console.log(req.body)
  if(!req.body.tour){
    req.body.tour=req.params.tourId,
    req.body.user=req.user.id
  }
 
  const review=await Review.create(req.body)

  sendRes(review,201,res)
})

exports.updateReviews=catchAsync(async(req,res,next)=>{
  const review=await Review.findByIdAndUpdate({_id:req.params.id},req.body, {
      new: true,
      runValidators: true,
    })

  sendRes(review,200,res)
})


exports.deleteReviews=catchAsync(async(req,res,next)=>{
  const review=await Review.findByIdAndDelete(req.params.id)

  sendRes(review,204,res)
})
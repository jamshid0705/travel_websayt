const catchAsync=require('../utility/catchAsync')
const Review=require('../models/reviewModel')
const factory=require('./handlerFactory')

// const sendRes=(data,status,res)=>{
//   res.status(status).json({
//     status:data?'success':'fail',
//     results:data?data.length:undefined,
//     data:{
//       reviews:data?data:undefined
//     }
//   })
// }

exports.sendIdAddReview=(req,res,next)=>{
   if(!req.body.tour){
    req.body.tour=req.params.tourId,
    req.body.user=req.user.id
  }
  next()
}

exports.getAllReviews=factory.getAll(Review)
exports.getOneReviews=factory.getOneId(Review)
exports.addReviews=factory.addOne(Review)
exports.updateReviews=factory.updateOne(Review)
exports.deleteReviews=factory.deleteOne(Review)
const express=require('express')
const reviewController=require('../controllers/reviewController')
const authController=require('../controllers/authController')

const route=express.Router({mergeParams:true})
// post  /:tourId/review
// get   /:tourId/review

route.route('/').get(reviewController.getAllReviews).post(authController.protect,authController.role('user'),reviewController.sendIdAddReview,reviewController.addReviews)
route.route('/:id').patch(reviewController.updateReviews).delete(reviewController.deleteReviews).get(reviewController.getOneReviews)

module.exports=route
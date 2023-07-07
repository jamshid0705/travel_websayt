const express=require('express')
const reviewController=require('../controllers/reviewController')
const authController=require('../controllers/authController')

const route=express.Router({mergeParams:true})
// post  /:tourId/review
// get   /:tourId/review
// middleware
route.use(authController.protect)

route.route('/').get(reviewController.getAllReviews).post(authController.role('user'),reviewController.sendIdAddReview,reviewController.addReviews)
route.route('/:id').patch(authController.role('user','admin'),reviewController.updateReviews).delete(authController.role('user','admin'),reviewController.deleteReviews).get(reviewController.getOneReviews)

module.exports=route
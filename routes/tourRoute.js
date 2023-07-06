const express = require('express');
const route = express.Router();
const tourController = require('../controllers/tourController');
const authController=require('../controllers/authController')
const reviewRout=require('./reviewRout')
// const reviewController=require('../controllers/reviewController')

route.use('/:tourId/review',reviewRout)
// route.post('/:tourId/review',authController.protect,authController.role('user'),reviewController.addReviews)

route.route('/').get(tourController.getTours).post(tourController.addTour);
route.route('/agg').get(tourController.getTourStates)
route.route('/month/:year').get(tourController.getMonthYear)
route.route('/top-5-cheap').get(tourController.topCheap,tourController.getTours)

route.route('/:id').get(tourController.getTourId).patch(tourController.updateTour).delete(authController.protect,authController.role('admin'),tourController.deleteTour);

module.exports = route;

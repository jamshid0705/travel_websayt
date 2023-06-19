const express = require('express');
const route = express.Router();
const tourController = require('../controllers/tourController');

route.route('/').get(tourController.getTours).post(tourController.addTour);
route.route('/:id').get(tourController.getTourId).patch(tourController.updateTour).delete(tourController.deleteTour);
module.exports = route;

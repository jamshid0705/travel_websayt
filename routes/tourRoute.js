const express = require('express');
// const fs = require('fs');
const route = express.Router();
const tourController = require('../controllers/tourController');

// const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
route.param('id', tourController.checkId);

route.route('/').get(tourController.getTours).post(tourController.checkBody,tourController.addTour);
route.route('/:id').get(tourController.getTourId).patch(tourController.updateTour).delete(tourController.deleteTour);
module.exports = route;

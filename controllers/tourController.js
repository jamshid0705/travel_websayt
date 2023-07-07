const Tour = require('../models/tourModel');
const catchAsync=require('./../utility/catchAsync')
// const AppError=require('./../utility/appError')
const factory=require('./handlerFactory')

// top 5 cheap
exports.topCheap = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,difficulty,price,durations,summary';
  next();
};

exports.getTours =factory.getAll(Tour)
exports.getTourId = factory.getOneId(Tour,'reviews')
exports.addTour =factory.addOne(Tour)
exports.updateTour =factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

exports.getTourStates =catchAsync( async (req, res,next) => {
    const state = await Tour.aggregate([
      { $match: { price: { $gte:0 } } },
      {
        $group: {
          _id: '$difficulty',
          numTour: { $sum: 1 },
          numAverage: { $sum: '$ratingsAverage' },
          numPrice: { $sum: '$price' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: 'easy' } } },
    ]);
    res.status(200).json({
      status: 'success',
      results: state.length,
      data: {
        state,
      },
    });
});

exports.getMonthYear =catchAsync( async (req, res,next) => {
    const year = req.params.year;
    const yearAgg = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTour: { $sum: 1 },
          nameTours: { $push: '$name' },
        },
      },
      {
        $sort: { numTour: -1 },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project:{_id:0}
      }
    ]);

    res.status(200).json({
      status: 'success',
      results: yearAgg.length,
      data: {
        yearAgg,
      },
    });
});


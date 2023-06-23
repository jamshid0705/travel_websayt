const Tour = require('../models/tourModel');
const Apifeatures = require('../utility/apiFeatures');
const catchAsync=require('./../utility/catchAsync')
const AppError=require('./../utility/appError')
// middlewares
// exports.checkId = (req, res, next, val) => { // tushunmovchilik bor
//   console.log(`This data is id: ${val}`);
//   if (req.params.id * 1 > tours.length - 1) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   next();
// };

// exports.checkBody=(req,res,next)=>{
//   if(!req.body.name || !req.body.price){
//     res.status(400).json({
//       status:'success',
//       message:"Missis name or price !"
//     })
//   }
//   next()
// }

// top 5 cheap
exports.topCheap = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,difficulty,price,durations,summary';
  next();
};

// get tour method
exports.getTours =catchAsync(async (req, res,next) => {
  
    // Queryni qurish

    // /////////////// 1 filter //////////////
    // const reqObj = { ...req.query };
    // const fields = ['page', 'limit', 'sort', 'fields'];
    // fields.forEach((el) => delete reqObj[el]);

    // //////////2 advance filter /////////////
    // // ? dan keyingi qiymatlarni oladi
    // let queryString = JSON.stringify(reqObj);
    // queryString = queryString.replace(/\bgte|gt|lte|lt\b/g, (val) => `$${val}`);
    // let query = Tour.find(JSON.parse(queryString));

    // /////////// 3 Sort ///////////
    // if(req.query.sort){
    //   const newQuery=req.query.sort.split(',').join(' ')
    //   query = query.sort(newQuery);
    //   // query('price ratingsAverage')
    // }else{
    //   query=query.sort('-createAt')
    // }

    // ///////// 4 fields  ///////////////
    // if(req.query.fields){
    //   const field=req.query.fields.split(',').join(' ')
    //   query=query.select(field)
    //   // select('name price difficulty')
    // }else{
    //   query=query.select('-__v')
    // }

    // ///////// 5 pagination ////////////
    // const page=req.query.page*1 || 1
    // const limit=req.query.limit*1 || 10
    // const skip=(page-1)*limit

    // query=query.skip(skip).limit(limit)

    // if(req.query.page){
    //   const a=await Tour.countDocuments() // tour ni length ni beradi
    //   if(skip>=a){
    //     throw new Error('Bunday page mavjud emas !')
    //   }
    // }

    const features = new Apifeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const allTour = await features.query;

    res.status(200).json({
      status: 'success',
      results: allTour.length,
      data: {
        allTour,
      },
    });
});

// get id tour method
exports.getTourId =catchAsync( async (req, res,next) => {
    const newTour = await Tour.findById(req.params.id);
    // const newTour=await Tour.findOne({_id:req.params.id})

    if(!newTour){
      return next(new AppError('Not found this ID',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        newTour,
      },
    });
});

// post tour method
exports.addTour =catchAsync( async (req, res,next) => {
   const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
});

// update tour method
exports.updateTour =catchAsync( async (req, res,next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!tour){
      return next(new AppError('Not found this ID',404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
});

//delete tour method
exports.deleteTour = catchAsync(async (req, res,next) => {
    const newTour=await Tour.findByIdAndDelete(req.params.id);

    if(!newTour){
      return next(new AppError('Not found this ID',404))
    }

    res.status(204).json({
      status: 'success',
      data: {
        message: 'success',
      },
    });
  
});

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

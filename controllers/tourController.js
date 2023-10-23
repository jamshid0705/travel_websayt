const Tour = require('../models/tourModel');
const AppError = require('../utility/appError');
const catchAsync=require('./../utility/catchAsync')
const factory=require('./handlerFactory')
const multer=require('multer');
const sharp=require('sharp')



const storageMulter=multer.memoryStorage()

const fileFilterMul=(req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb(new AppError('Image emas. Iltimos image fayl yuklang !',404),false)
  }
}

const upload=multer({
  storage:storageMulter,
  fileFilter:fileFilterMul
})

exports.uploadTourImg=upload.fields([{name:'imageCover',maxCount:1},{name:'images',maxCount:3}])

exports.resizeTourImages=catchAsync(async(req,res,next)=>{
  console.log(req.files)

  if(!req.files.imageCover || !req.files.images) return next()
  // upload imageCover
  req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.imageCover[0].buffer).resize(2000,1333).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/tours/${req.body.imageCover}`)
  
  req.body.images=[]
  await Promise.all(req.files.images.map(async(el,i) => {
    const filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`
    await sharp(req.files.images[i].buffer).resize(2000,1333).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/tours/${filename}`)
    req.body.images.push(filename)
  }));
  
  next()
  
})
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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/41.229571, 69.209462/unit/mi

exports.getTourWithin=catchAsync(async(req,res,next)=>{
  const {distance,latlng,unit}=req.params
  const [lat,lng]=latlng.split(',')

  const radius=unit==='mi'?distance/3963.2 :distance/6378.1

  if(!lat || !lng){
    next(new AppError('Latitute va Longituteda xatolik. Iltimos tekshirib ko\'ring !'))
  }
  
  const tours=await Tour.find({
    startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
  })

  res.status(200).json({
    status:'success',
    results:tours.length,
    data:{
      data:tours
    }
  })
})

exports.getDistances=catchAsync(async(req,res,next)=>{
  const {latlng,unit}=req.params
  const [lat,lng]=latlng.split(',')
  const multiplier=unit==='mi'? 0.000621371:0.001
  if(!lat || !lng){
    next(new AppError('Latitute va Longituteda xatolik. Iltimos tekshirib ko\'ring !'))
  }
  
  const distance=await Tour.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates:[lng*1,lat*1]
        },
        distanceField:'distance',
        distanceMultiplier:multiplier
      }
    },{
      $project:{
        distance:1,
        name:1
      }
    }
  ])

  res.status(200).json({
    status:'success',
    data:{
      data:distance
    }
  })
})
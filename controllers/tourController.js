const Tour = require('../models/tourModel');

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
// get tour method
exports.getTours = async (req, res) => {
  try {
    const reqObj = { ...req.query };
    const fields = ['page', 'limit', 'sort', 'fields'];
    fields.forEach((el) => delete reqObj[el]);
    console.log(reqObj); // ? dan keyingi qiymatlarni oladi
    const allTour = await Tour.find(reqObj);
    res.status(200).json({
      status: 'success',
      results: allTour.length,
      data: {
        allTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// get id tour method
exports.getTourId = async (req, res) => {
  try {
    const newTour = await Tour.findById(req.params.id);
    // const newTour=await Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// post tour method
exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

// update tour method
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

//delete tour method
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        message: 'success',
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

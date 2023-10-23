const catchAsync=require('../utility/catchAsync')
const AppError=require('../utility/appError')
const Apifeatures=require('../utility/apiFeatures')


exports.deleteOne = Model=>catchAsync(async (req, res,next) => {
    const doc=await Model.findByIdAndDelete(req.params.id);

    if(!doc){
      return next(new AppError('Not found this ID',404))
    }

    res.status(204).json({
      status: 'success',
      data: {
        message: 'success',
      },
    });
  
});

exports.updateOne=Model =>catchAsync( async (req, res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!doc){
      return next(new AppError('Not found this ID',404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        data:doc
      },
    });
});

exports.addOne=Model =>catchAsync( async (req, res,next) => {
   const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
});

exports.getOneId=(Model,populateOption)=>catchAsync( async (req, res,next) => {
  let query=Model.findById(req.params.id)
  if(populateOption) query=query.populate(populateOption)

  const doc=await query

  if(!doc){
    return next(new AppError('Not found this ID',404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      data:doc,
    },
  });
});

exports.getAll=Model=>catchAsync(async (req, res,next) => {
  let filter={}
  if(req.params.tourId) filter={tour:req.params.tourId}
  const features = new Apifeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
  
  const doc = await features;

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data:doc,
    },
  });
});
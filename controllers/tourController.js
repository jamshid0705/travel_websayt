const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));

// middlewares
exports.checkId = (req, res, next, val) => { // tushunmovchilik bor 
  console.log(`This data is id: ${val}`);
  if (req.params.id * 1 > tours.length - 1) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  next();
};

exports.checkBody=(req,res,next)=>{
  if(!req.body.name || !req.body.price){
    res.status(400).json({
      status:'success',
      message:"Missis name or price !"
    })
  }
  next()
}
// get tour method
exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    time: req.requestTime,
    // resTime:new Date().toISOString(),
    data: {
      tours,
    },
  });
};

// get id tour method
exports.getTourId = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// post tour method
exports.addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`./dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

// update tour method
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'This data was updated !',
    },
  });
};

//delete tour method
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const fs = require('fs');
const express = require('express');
const app = express();

// 1 Middleware
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// app.get('/',(req,res)=>{
//   res.status(200).json({'message':'Hello from the server side !'})
// })
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// 2 Rout Handler
// get tour method
const getTours = (req, res) => {
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
const getTourId = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Inavalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// post tour method
const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

// update tour method
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length - 1) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'This data was updated !',
    },
  });
};

//delete tour method
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length - 1) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// get all users
const getUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// get id user
const getUserId = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// update user
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// add user
const addUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// delete user
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// 3 Routes
// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTourId);
// app.post('/api/v1/tours', addTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
const tourRout=express.Router()
const userRout=express.Router()

tourRout.route('/').get(getTours).post(addTour);
tourRout.route('/:id').get(getTourId).patch(updateTour).delete(deleteTour);

userRout.route('/').get(getUsers).post(addUser);
userRout.route('/:id').get(getUserId).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours',tourRout);
app.use('/api/v1/users',userRout);
// 4 start server
app.listen(3000, () => {
  console.log('App running on port 3000...');
});

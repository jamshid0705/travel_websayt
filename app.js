const express = require('express');

const morgan = require('morgan');
const app = express();

const tourRout = require('./routes/tourRoute');
const userRout = require('./routes/userRoute');
// 1 Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(express.static(`${__dirname}/public`));
// app.get('/',(req,res)=>{
//   res.status(200).json({'message':'Hello from the server side !'})
// })
// 2 Rout Handler
// 3 Routes
// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTourId);
// app.post('/api/v1/tours', addTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRout);
app.use('/api/v1/users', userRout);

module.exports = app;

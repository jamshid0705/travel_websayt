const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const mongoSanitize=require('express-mongo-sanitize')
const xss=require('xss-clean')
const hpp=require('hpp')
const app = express();

const globalErrorHandler=require('./controllers/errorController')
const AppError=require('./utility/appError')
const tourRout = require('./routes/tourRoute');
const userRout = require('./routes/userRoute');
const reviewRout=require('./routes/reviewRout')

// Global Middleware

// http securty
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// request limit
app.use('/api',rateLimit({
  windowMs:60*60*1000,
  max:100,
  message:'Siz juda ko\`p so\`rov yubordingiz. Iltimos bir ozdan so\`ng harakat qilib ko\`ring !'
}))

// body parser
app.use(express.json({limit:'10kb'}));

// example middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// request ga kelgan har xil url hujumlardan saqlaydi
app.use(mongoSanitize())

// requestni body siga malumot o'rniga html fayllar yuborish orqali qilingan hujum misol: "name":"<div id='23'>jamshid</div>" buni buzib saqlaydi
app.use(xss())

// url dagi xatolar
app.use(hpp())

// static fayl
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
app.use('/api/v1/reviews',reviewRout)

// url dagi error ni catch qilish un
app.all('*',(req,res,next)=>{
  next(new AppError(`Can not find this url ${req.originalUrl}`,404))
})

// globalni errorni catch qilish
app.use(globalErrorHandler)

module.exports = app;

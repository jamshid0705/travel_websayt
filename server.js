const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log('DB connection fail !', err);
  });

// addTour.save().then(doc=>{
//   console.log('This data saved !')
// }).catch(err=>{
//   console.log('ERROR:',err)
// })
// console.log(process.env)
const PORT = process.env.PORT || 3000;
// 4 start server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

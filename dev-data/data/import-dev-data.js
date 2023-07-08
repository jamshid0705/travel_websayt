const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successfully!');
  })
  .catch((err) => {
    console.log('DB connection unsuccessfullyly !', err);
  });

const tour = JSON.parse(fs.readFileSync(`${__dirname}/./tours.json`, `utf-8`));
const user = JSON.parse(fs.readFileSync(`${__dirname}/./users.json`, `utf-8`));
const review = JSON.parse(fs.readFileSync(`${__dirname}/./reviews.json`, `utf-8`));

// console.log(typeof tour)

const importData = async (req, res) => {
  try {
    await Tour.create(tour);
    await User.create(user,{validateBeforeSave:false});
    await Review.create(review);
    console.log('Ma`lumot saqlandi!');
  } catch (error) {
    console.log(error);
  }
  process.exit()
};

const deleteData = async (req, res) => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Database o`chirildi !');
  } catch (error) {
    console.log(error);
  }
  process.exit()
};

console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

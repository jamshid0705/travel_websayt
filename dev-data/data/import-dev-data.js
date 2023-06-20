const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
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

const tour = JSON.parse(fs.readFileSync(`${__dirname}/./tours-simple.json`, `utf-8`));
// console.log(typeof tour)

const importData = async (req, res) => {
  try {
    await Tour.create(tour);
    console.log('Ma`lumot saqlandi!');
  } catch (error) {
    console.log(error);
  }
  process.exit()
};

const deleteData = async (req, res) => {
  try {
    await Tour.deleteMany();
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

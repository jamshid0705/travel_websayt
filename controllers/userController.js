const User = require('../models/userModel');
const catchAsync=require('./../utility/catchAsync')
const AppError=require('./../utility/appError')
// get all users
exports.getUsers =catchAsync( async(req, res,next) => {
  const user = await User.find()
  res.status(200).json({
      status: 'success',
      results: user.length,
      data: {
        user,
      },
    });
});
// get id user
exports.getUserId = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// update user
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// add user
exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};
// delete user
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This url was not found !',
  });
};

const express = require('express');
const route = express.Router();
const userController=require('../controllers/userController')
const authController=require('../controllers/authController')

route.post('/signup',authController.signup)
route.post('/login',authController.login)

route.post('/forgotpassword',authController.forgotPassword)
route.post('/resetpassword',authController.resentPassword)

route.route('/').get(authController.protect, userController.getUsers).post(userController.addUser);
route.route('/:id').get(userController.getUserId).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = route;

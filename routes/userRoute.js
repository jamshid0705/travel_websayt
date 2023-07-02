const express = require('express');
const route = express.Router();
const userController=require('../controllers/userController')
const authController=require('../controllers/authController')

route.post('/signup',authController.signup)
route.post('/login',authController.login)

route.route('/').get(userController.getUsers).post(userController.addUser);
route.route('/:id').get(userController.getUserId).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = route;

const express = require('express');
const route = express.Router();
const userController=require('../controllers/userController')
const authController=require('../controllers/authController')

route.post('/signup',authController.signup)
route.post('/login',authController.login)

route.post('/forgotpassword',authController.forgotPassword)
route.patch('/resetpassword/:token',authController.resentPassword)

// middleware route
route.use(authController.protect)

route.get('/me',userController.getMe,userController.getUserId)
route.patch('/updateMyPassword',authController.updatePassword)
route.patch('/updateMe',userController.updateMe)
route.delete('/deleteMe',userController.deleteMe)

route.use(authController.role('admin'))

route.route('/').get( userController.getUsers).post(userController.addUser);
route.route('/:id').get(userController.getUserId).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = route;

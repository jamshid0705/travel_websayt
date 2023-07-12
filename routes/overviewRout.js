const express=require('express')
const overviewController=require('../controllers/overviewController')
const authController=require('../controllers/authController')
const route=express.Router()

route.get('/',authController.isLoginIn,overviewController.getTour)
route.get('/tour/:slug',authController.isLoginIn,overviewController.getOneTour)
route.get('/login',authController.isLoginIn,overviewController.login)
route.get('/me',authController.protect,overviewController.getAccount)
// route.post('/submit-user-data',authController.protect,overviewController.updateUser)

module.exports=route
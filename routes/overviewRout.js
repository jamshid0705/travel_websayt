const express=require('express')
const overviewController=require('../controllers/overviewController')
const authController=require('../controllers/authController')
const route=express.Router()

route.use(authController.isLoginIn)
route.get('/',overviewController.getTour)
route.get('/tour/:slug',overviewController.getOneTour)
route.get('/login',overviewController.login)

module.exports=route
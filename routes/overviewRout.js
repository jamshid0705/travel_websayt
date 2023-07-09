const express=require('express')
const overviewController=require('../controllers/overviewController')
const route=express.Router()

route.get('/',overviewController.getTour)
route.get('/tour/:slug',overviewController.getOneTour)

module.exports=route
const stripe=require('stripe')(process.env.SECRET_KEY)
const Tour=require('./../models/tourModel')
const catchAsync=require('../utility/catchAsync')
const factory=require('../controllers/handlerFactory')
const AppError=require('../utility/appError')

exports.getCheckoutSession=catchAsync(async(req,res,next)=>{
    // 1 get tour with id
    const tour= await Tour.findById(req.params.tourId)
    console.log(tour)
    // 2 create checkout sesseion
    const session=await stripe.checkout.sessions.create({
        payment_method_type:['card'],
        success_url:`${req.protocol}://${req.get('host')}/`,
        cansel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.id,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description: tour.summary,
                images:[`/img/tours/${tour.imageCover}`],
                amount:tour.price*100,
                currency:'usd',
                quantity:1
            }
        ]
    })

    // res
    res.status(200).json({
        status:'success',
        session
    })
    next()
})
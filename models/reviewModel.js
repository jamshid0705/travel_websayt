const mongoose=require('mongoose')
const Tour = require('./tourModel')

const reviewSchema=mongoose.Schema({
  review:{
    type:String,
    required:[true,'Siz review yozishingiz kerak !']
  },
  rating:{
    type:Number,
    max:5,
    min:0
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'user',
    required:[true,'review userga tegishli bo\`lishi kerak']
  },
  tour:{
    type:mongoose.Schema.ObjectId,
    ref:'tour',
    required:[true,'review tourga tegishli bo\`lishi kerak']
  }
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})

// document muddleware
reviewSchema.pre(/^find/,function(next){
  this.populate({path:'user',select:' -__v -createAt'}).populate({path:"tour",select:'name price'})
  next()
})

reviewSchema.statics.calcAverageRating=async function(tourId){
  // console.log(tourId)
  const stats=await this.aggregate([
    {
      $match:{tour:tourId}
    },
    {
      $group:{
        _id:'$tour',
        nRating:{$sum:1},
        avgRating:{$avg:'$rating'}
      }
    }
  ])
  // console.log('agr',stats)
  
  if(stats.length>0){
    await Tour.findByIdAndUpdate(tourId,{
    ratingsQuantity:stats[0].nRating,
    ratingsAverage:stats[0].avgRating
    })
  }else{
    await Tour.findByIdAndUpdate(tourId,{
    ratingsQuantity:0,
    ratingsAverage:5
    })
  }
}

// user faqat bitta review yoza oladi bitta tourga
reviewSchema.index({tour:1,user:1},{unique:true})

reviewSchema.post('save',function(){
  // console.log(this)
  this.constructor.calcAverageRating(this.tour)
})

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/,async function(next){
  // console.log(this)
  this.r=await this.findOne() // tushunmadim ???????????????
  // console.log(this.r)
  next()
})

reviewSchema.post(/^findOneAnd/,async function(){
  await this.r.constructor.calcAverageRating(this.r.tour._id)
  // console.log(this.r.tour)
})

const review=mongoose.model('review',reviewSchema)
module.exports=review
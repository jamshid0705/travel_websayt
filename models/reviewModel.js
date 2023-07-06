const mongoose=require('mongoose')

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
  this.populate({path:'user',select:' -__v -createAt'}).populate({path:"tour",select:'name duration maxGroupSize price difficulty'})
  next()
})

const review=mongoose.model('review',reviewSchema)
module.exports=review
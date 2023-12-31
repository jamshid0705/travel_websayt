const mongoose = require('mongoose');
const slugify=require('slugify')
// const User=require('./userModel')
// const validator=require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name!'],
    unique: true,
    trim: true,
    maxlength:[20,'A tour must have 20 max characters !'],
    minlength:[10,'A tour must have 10 min characters !'],
    // validate:[validator.isAlpha,'Tour name must only contain character!']
  },
  duration: {
    type: String,
    required: [true, 'A tour must have durations !'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have maxGroupSize !'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty !'],
    enum:{
      values:['easy','difficult','medium'],
      message:'Difficulty values: easy,difficul and medium'
    }
  },
  slug:String,
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min:[1,'min ratingsAverage: 1.0'],
    max:[5,'max ratingsAverage: 5.0'],
    set:val=>Math.round(val*10)/10  // 4.555555 => 4.6
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Price is required !'],
  },
  priceDiscount:{
    type:Number,
    validate:{
      validator:function(val){
      return val<this.price
    },
    message:'PriceDiscount price dan kichik bo`lishi kerak !'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have summary !'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have imageCover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  secretTour:{
    type:Boolean,
    default:false
  },
  startLocation:{
    type:{
        type:String,
        default:'Point',
        enum:'Point'
      },
    coordinates:[Number],
    address:String,
    description:String,
    day:Number
  },
  locations:[
    {
      type:{
        type:String,
        default:'Point',
        enum:'Point'
      },
      coordinates:[Number],
      address:String,
      description:String,
      day:Number
    }
  ],
  guides:[
    {type:mongoose.Schema.ObjectId,
     ref:'user'}
  ]
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

tourSchema.index({price:1,ratingsAverage:-1})
tourSchema.index({slug:1})
tourSchema.index({startLocation:'2dsphere'})
// data ni chaqirganimizda 
tourSchema.virtual('durationsWeek').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews',{
  ref:'review',
  foreignField:'tour',
  localField:'_id'
})

// document middleware data bazaga borishdan oldin qo'shimcha qo'shadi
tourSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true})
  next()
})
// databasega saqlashdan oldin user collectiondan malumotlar olib kelinadi
// tourSchema.pre('save',async function(next){
//   const guidesPromise=this.guides.map(async id=>await User.findById({_id:id}))
//   this.guides=await Promise.all(guidesPromise)
//   next()
// })
// query middleware
tourSchema.pre(/^find/,function(next){
  this.populate({path:'guides',select:'-__v -passwordChangedDate'})
  next()
})
// tourSchema.pre(/^find/,function(next){
//   this.populate('reviews')
//   next()
// })
tourSchema.pre(/^find/,function(next){
  this.find({secretTour:{$ne:true}})
  next()
})

// aggregate middleware
// tourSchema.pre('aggregate',function(next){
//   this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
//   console.log(this.pipeline())
//   next()
// })

const Tour = mongoose.model('tour', tourSchema);
module.exports = Tour;

const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please ! Your name !"]
  },
  email:{
    type:String,
    unique:true,
    required:[true,"Please ! Your email !"],
    lowercase:true,
    validate:[validator.isEmail,'Your email isn`t correct !']
  },
  photo:{
    type:String
  },
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
  },
  password:{
    type:String,
    required:[true,"Please! Your password!"],
    minlength:8,
    select:false
  },
  passwordConfirm:{
    type:String,
    required:[true,"Please! Your passwordConfirm!"],
    validate:{
      validator:function(el){
         return el===this.password
      },
      message:'Password is not the same !'
    }
  },
  passwordChangedDate:{
    type:Date,
    default:Date.now()
  },
  resetTokenHash:String,
  resetTokenVaqt:Date
})

// document middleware
userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next()

  this.password=await bcrypt.hash(this.password,12)
  this.passwordConfirm=undefined
  next()
})

// reset token yasash
userSchema.methods.hashResetToken=function(){
  const token=crypto.randomBytes(32).toString('hex')
  // console.log(token)
  const resetToken=crypto.createHash('sha256').update(token).digest('hex')
  // console.log(resetToken)
  this.resetTokenHash=resetToken
  this.resetTokenVaqt=Date.now()+10*60*1000

  return token
}
const User=mongoose.model('users',userSchema)
module.exports=User
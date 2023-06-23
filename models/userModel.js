const mongoose=require('mongoose')
 const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please ! Your name !"]
  },
  email:{
    type:String,
    required:[true,"Please ! Your email !"],
    unique:[true,"This email is already in use !"],
    lowercase:true,
    validate:[validator.isEmail,'Your email isn`t correct !']
  },
  photo:{
    type:String
  },
  password:{
    type:String,
    required:[true,"Please! Your password!"],
    minlength:8
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
  }
})

// document middleware
userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next()

  this.password=await bcrypt.hash(this.password,12)
  this.passwordConfirm=undefined
  next()
})

const User=mongoose.model('users',userSchema)
module.exports=User
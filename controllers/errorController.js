const AppError = require("../utility/appError")

const handlerDublicateFields=(error)=>{
  const message='Dublicate fields value: Please use anther value !'
  return new AppError(message,400)
}

const sendErrorDev=(err,res)=>{
  res.status(err.statusCode).json({
    status:err.status,
    error:err,
    message: err.message,
    stack:err.stack
  })
}

const sendErrorPro=(err,res)=>{
  res.status(err.statusCode).json({
    status:err.status,
    message: err.message
  })
}

const ValidatorError=(err)=>{
  const errors=Object.values(err.errors).map(val=>val.message)
  const message=`Invalid input data:${errors.join('. ')} `
  return new AppError(message,400)
}

module.exports=(err,req,res,next)=>{
  err.statusCode=err.statusCode || 500
  err.status=err.status || 'error'

  if(process.env.NODE_ENV==='development'){
    sendErrorDev(err,res)
     console.log(err)
  } else if(process.env.NODE_ENV==='production'){
    let error={...err}
    
    if(error.code===11000){
      error=handlerDublicateFields(error)
    }
    if(error.name==='ValidationError') {
       console.log('99999999999')
      error=ValidatorError(error)
   }

    sendErrorPro(error,res)
  }
  
  next()
}
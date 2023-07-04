const nodemailer=require('nodemailer')

const sendEmail=async (options)=>{
  // 1 transporter yaratish
  const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    }
  })
  
  // 2 mail ni sozlash
  const mailOption={
    from:'jamshid khatamov <jamshidshamshod0705@gamil.com>',
    to:options.email,
    subject:options.subject,
    text:options.message
  }
  // 3 mail ni jo'natish
  await transporter.sendMail(mailOption)

}

module.exports=sendEmail
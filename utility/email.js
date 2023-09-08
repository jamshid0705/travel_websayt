const nodemailer=require('nodemailer')
const pug=require('pug')
const htmlToText=require('html-to-text')

module.exports=class Email{
  constructor(user,url){
    this.to=user.email,
    this.firstName=user.name.split(' ')[0],
    this.url=url,
    this.from=`jamshid khatamov <${process.env.EMAIL_FROM}>`
  }

  newTransport(){
    // if(process.env.NODE_ENV='production'){
    //   return 1
    // }

    return nodemailer.createTransport({
      host:process.env.EMAIL_HOST,
      port:process.env.EMAIL_PORT,
      auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
      }
    })
  }

  async send(template,subject){
    //1 pug render qilish
    const html=pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
      firstName:this.firstName,
      url:this.url,
      subject:subject
    })
    //2 mailoption ni
    const mailOption={
    from:this.from,
    to:this.to,
    subject:subject,
    html:html
  }
    //3 send qilish emailga
    await this.newTransport().sendMail(mailOption)
  }

  async sendWelcome(){
    await this.send('welcome','Welcome to Natours Family !')
  }
  async sendResetPassword(){
    await this.send('passwordReset','Your password reset token (valid for only 10 minutes)')
  }
}


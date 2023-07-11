import '@babel/polyfill'
import {login} from './login'

const loginn=document.querySelector('.form')

loginn.addEventListener('submit',e=>{
  e.preventDefault()
  console.log(password)
  const email=document.querySelector('#email').value
  const password=document.querySelector('#password').value

  login(email,password)
})
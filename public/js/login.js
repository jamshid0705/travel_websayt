/* eslint-disable */ 
const hideAlert=()=>{
  const el=document.querySelector('.alert')
  if(el) el.parentElement.removeChild(el)
}

const showAlert=(type,msg)=>{
  hideAlert()
  const markup=`<div class="alert alert--${type}">${msg}</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
  window.setTimeout(hideAlert,5000)
}

////////////// login //////////////
const login=async(email,password)=>{
  try {
    const res=await axios({
      method:'POST',
      url:'http://127.0.0.1:3000/api/v1/users/login',
      data:{
        email,
        password
      }
    })
    
    if(res.data.status==='success'){
      showAlert('success','Siz muvaffaqiyatli ro\'yhatdan o\'tdingiz !')
      window.setTimeout(()=>{
        location.assign('/')
      },1500)
    }
  } catch (error) {
    showAlert("error",error.response.data.message)
  }
}


document.querySelector('.form').addEventListener('submit',e=>{
  e.preventDefault()
  const email=document.querySelector('#email').value
  const password=document.querySelector('#password').value
  login(email,password)
})

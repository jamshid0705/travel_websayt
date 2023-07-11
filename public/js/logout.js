
const showAlert=(type,msg)=>{
  hideAlert()
  const markup=`<div class="alert alert--${type}">${msg}</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
  window.setTimeout(hideAlert,5000)
}
const logout=async()=>{
  try {
    const res=await axios({
      method:"GET",
      url:'http://127.0.0.1:3000/api/v1/users/logout'
    })
    console.log('res',res)
    if(res.data.status==='success') location.reload(true)

  } catch (error) {
    showAlert('error','Error logout! Try again !')
  }
}


document.querySelector('.nav__el--logout').addEventListener('click',logout)
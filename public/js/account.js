// const { default: axios } = require("axios")
// const hideAlert=()=>{
//   const el=document.querySelector('.alert')
//   if(el) el.parentElement.removeChild(el)
// }

// const showAlert=(type,msg)=>{
//   hideAlert()
//   const markup=`<div class="alert alert--${type}">${msg}</div>`
//   document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
//   window.setTimeout(hideAlert,5000)
// }

const updateUser=async(data,type)=>{
  try {
    const url=type==='password'?`http://127.0.0.1:3000/api/v1/users/updateMyPassword`:`http://127.0.0.1:3000/api/v1/users/updateMe`
    const res=await axios({
      method:'PATCH',
      url,
      data
    })
    if(res.data.status==='success'){
      showAlert('success',`${type} update successfully !`)
      //  window.setTimeout(()=>{
      //   location.assign('/me')
      // },1500)
    }
  } catch (error) {
    showAlert('error',error.message)
  }
}

document.querySelector('.form-user-data').addEventListener('submit',e=>{
  e.preventDefault()
  const name=document.querySelector('#name').value
  const email=document.querySelector('#email').value
  updateUser({name,email},'data')
})

document.querySelector('.form-user-password').addEventListener('submit',async e=>{
  e.preventDefault()
  document.querySelector('.btn-update-password ').textContent='Updating...'
  const passwordCorrunt=document.querySelector('#password-current').value
  const password=document.querySelector('#password').value
  const passwordConfirm=document.querySelector('#password-confirm').value
  await updateUser({passwordCorrunt,password,passwordConfirm},'password')

  document.querySelector('.btn-update-password ').textContent='Save password'
  document.querySelector('#password-current').value=''
  document.querySelector('#password').value=''
  document.querySelector('#password-confirm').value=''
})
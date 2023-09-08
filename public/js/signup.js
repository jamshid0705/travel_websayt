// import axios from 'axios';

const signupUser = async (name, email, pass, re_pass) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name: name,
        email: email,
        password: pass,
        passwordConfirm: re_pass,
      },
    });
    console.log(res.status);
    if (res.status == 200) {
      alert('Log in using the link sent to your email !');
      window.setTimeout(() => {
        location.assign('signup');
      }, 1000);
    }
  } catch (error) {
    console.log(error);
      alert(`${error.response.data.message}`);
      window.setTimeout(() => {
        location.assign('login');
      }, 1000);
    
    // console.log(res.status)
    // if(res.status==404){
    //   alert('You have an error !')
    //   window.setTimeout(()=>{
    //     location.assign('signup')
    //   },1000)
    // }
  }
};

document.querySelector('.register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const pass = document.querySelector('#pass').value;
  const re_pass = document.querySelector('#re_pass').value;
  signupUser(name, email, pass, re_pass);
  console.log(name, email, pass, re_pass);
  name = document.querySelector('#name').value = '';
  email = document.querySelector('#email').value = '';
  pass = document.querySelector('#pass').value = '';
  re_pass = document.querySelector('#re_pass').value = '';
});

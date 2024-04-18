'use strict';

const buttonSignIn = document.getElementById('buttonSignIn');

buttonSignIn.addEventListener('click', async () => {
    try{
    const inputLogin = document.getElementById('inputLogin');
    const inputPassword = document.getElementById('inputPassword');

    let response = await axios.post('/auth/login', {
        username: inputLogin.value,
        password: inputPassword.value,
    });

    console.log(response.data);

    let success = response.data.success;
    if(success) {
        // Add JWT to the localStorage and redirect to the '/chat' route;
        localStorage.setItem('jwt', response.data.jwt);
        window.location.href = '/chat';
    }
    }   catch(err) {
        console.log(err.response.data.message);
    }
});
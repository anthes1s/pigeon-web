'use strict';

const buttonSignUp = document.getElementById('buttonSignUp');

buttonSignUp.addEventListener('click', async () => {
    const inputLogin = document.getElementById('inputLogin');
    const inputPassword = document.getElementById('inputPassword');
    // Add some check that would require the length of password to be >8 symbols

    let response = await axios.post('/auth/register', {
        username: inputLogin.value,
        password: inputPassword.value,
    });

    console.log(response.data);
    // Let user know that the registration was successful

});
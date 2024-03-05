'use strict';

const inputLogin = document.getElementById(`inputLogin`);
const inputPassword = document.getElementById(`inputPassword`);
const buttonSignIn = document.getElementById(`buttonSignIn`);

buttonSignIn.addEventListener('click', () => { 
    axios.post(`/api/login`, {
        username: inputLogin.value,
        password: inputPassword.value
    })
    .then((response) => {
        let success = response.data.success;

        console.log(response.data);

        if(success) {

            let jwt = response.data.jwt;
            localStorage.setItem('jwt', jwt);
            console.log(`User exists! Successfully logged in!`);

            window.location.href = `/chat`;
        } else {

            /* Add some label to the HTML page that would let the user know that the log in attempt wasn't successfull */

            console.log(`User does not exist! Failed to log in!`);
        }
    })
    .catch((error) => {
        console.error(`User does not exists! Failed to log in!`);
    });
});

'use strict';

const inputLogin = document.getElementById(`inputLogin`);
const inputPassword = document.getElementById(`inputPassword`);
const buttonSignIn = document.getElementById(`buttonSignIn`);
var labelLoginStatus = document.getElementById(`loginLabelStatus`);

buttonSignIn.addEventListener('click', () => { 
    axios.post(`/api/login`, {
        username: inputLogin.value,
        password: inputPassword.value
    })
    .then((response) => {
        let success = response.data.success;
        if(success) {

            /* Add logic that adds a JWT token to a local storage and redirects to a '/chat' route (don't forget to add authentification to the chat route!) */

            console.log(`User exists! Successfully logged in!`);
        } else {

            /* Add some label to the HTML page that would let the user know that the log in attempt wasn't successfull */

            console.log(`User does not exist! Failed to log in!`);
        }
    })
    .catch((error) => {
        console.error(`User does not exists! Failed to log in!`);
    });
});

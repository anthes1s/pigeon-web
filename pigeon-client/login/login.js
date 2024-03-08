'use strict';

const inputLogin = document.getElementById(`inputLogin`);
const inputPassword = document.getElementById(`inputPassword`);
const buttonSignIn = document.getElementById(`buttonSignIn`);
let statusLabel = document.createElement('label');

buttonSignIn.addEventListener('click', () => { 
    statusLabel.style.display = "none";

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

            statusLabel.style.color = "#008000";
            statusLabel.textContent = "Logged in successfully!";
            statusLabel.style.display = "";
            maindiv.appendChild(statusLabel);

            setTimeout(() => window.location.href = `/chat`, 1000);
            
        } else {
            /* Add some label to the HTML page that would let the user know that the log in attempt wasn't successfull */
            statusLabel.style.color = "#FF0000";
            statusLabel.textContent = "Invalid username or password";
            statusLabel.style.display = "";
            maindiv.appendChild(statusLabel);

        }
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
    });
});

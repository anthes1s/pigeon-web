'use strict';

const inputLogin = document.getElementById(`inputLogin`);
const inputPassword = document.getElementById(`inputPassword`);
const buttonSignIn = document.getElementById(`buttonSignIn`);
let statusLabel = document.createElement('label');
maindiv.appendChild(statusLabel);

buttonSignIn.addEventListener('click', () => { 
    statusLabel.style.display = "none";

    axios.post(`/api/login`, {
        username: inputLogin.value,
        password: inputPassword.value
    })
    .then((response) => {
        let success = response.data.success;

        if(success) {
            let jwt = response.data.jwt;
            localStorage.setItem('jwt', jwt);

            statusLabel.style.color = "#008000";
            statusLabel.textContent = "Logged in successfully!";
            statusLabel.style.display = "";
            setTimeout(() => window.location.href = `/chat`, 1000);
            
        } else {
            statusLabel.style.color = "#FF0000";
            statusLabel.textContent = "Invalid username or password";
            statusLabel.style.display = "";
        }
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
    });
});

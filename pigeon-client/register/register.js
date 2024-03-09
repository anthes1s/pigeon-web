'use strict';

const inputLogin = document.getElementById('inputLogin');
const inputPassword = document.getElementById('inputPassword');
const buttonFinish = document.getElementById('buttonFinish');

let statusLoginLabel = document.createElement("label");
let statusPasswordLabel = document.createElement("label");

statusLoginLabel.style.marginTop = '4px';
statusLoginLabel.textContent = "Your login is too long, make it shorter (pls)";
statusLoginLabel.style.color = "#FF0000";

statusPasswordLabel.style.marginTop = '4px';
statusPasswordLabel.textContent = "Your password is too short, make it longer (pls)";
statusPasswordLabel.style.color = "#FF0000";

inputLogin.addEventListener('keydown', () => {
    let loginLength = inputLogin.value.length;
    if((loginLength + 1) > 255) {
        statusLoginLabel.style.display = "";
        maindiv.appendChild(statusLoginLabel);
        return;
    } else {
        statusLoginLabel.style.display = "none";
        return;
    }
});

inputPassword.addEventListener('keydown', () => {
    let passwordLength = inputPassword.value.length;
    if((passwordLength + 1) < 8) {
        statusPasswordLabel.style.display = "";
        maindiv.appendChild(statusPasswordLabel);
        return;
    } else {
        statusPasswordLabel.style.display = "none";
        return;
    }
});

buttonFinish.addEventListener('click', () => {
    let loginLength = inputLogin.value.length;
    if(loginLength > 255) {
        return;
    }
    let passwordLength = inputPassword.value.length;
    if(passwordLength < 8) {
        return;
    }

    axios.post('/api/register', {
        username: inputLogin.value,
        password: inputPassword.value
    })
    .then(response => {
        console.log(`Successful response: `, response.data);

        let statusRegistrationLabel = document.createElement("label");

        if(response.data.success) {
            statusRegistrationLabel.style.color = "#008000";
            statusRegistrationLabel.textContent = `${response.data.message}`;
            statusRegistrationLabel.style.marginTop = "4px";
            maindiv.appendChild(statusRegistrationLabel);

            setTimeout(() => window.location.href = '/', 1000);
        } else {
            /* Append a label to a bottom of a div that says ${response.data.message} */
            statusRegistrationLabel.style.color = "#FF0000";
            statusRegistrationLabel.textContent = `${response.data.message}`;
            statusRegistrationLabel.style.marginTop = "4px";
            maindiv.appendChild(statusRegistrationLabel);
        }
    })
    .catch(err => {
        console.error(`Error: ${err.message}`);
    })
});
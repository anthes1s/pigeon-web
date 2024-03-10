'use strict';

import { establishConnection } from "./modules/establishConnection.mjs";

const inputMessage = document.getElementById(`inputMessage`);
const textareaMessageBox = document.getElementById(`textareaMessageBox`);
const buttonSend = document.getElementById(`buttonSend`);
const maindiv = document.getElementById(`maindiv`); 

/* Validate JWT */
axios.post(`/api/verify`, {
    jwt: localStorage.getItem('jwt')
})
.then(response => {
    console.log(response.status);
    establishConnection();
})
.catch(err => {
    console.error(err.message);
    inputMessage.parentNode.removeChild(inputMessage);
    buttonSend.parentNode.removeChild(buttonSend);
    textareaMessageBox.parentNode.removeChild(textareaMessageBox);

    let statusLabel = document.createElement("statusLabel");
    statusLabel.textContent = "403 - Forbidden";
    statusLabel.classList.add("container");
    maindiv.appendChild(statusLabel);
});
   

'use strict';

import { formatDate } from './modules/formatDate.mjs';

const socket = io();

const inputMessage = document.getElementById(`inputMessage`);
const textareaMessageBox = document.getElementById(`textareaMessageBox`);
const buttonSend = document.getElementById(`buttonSend`);

socket.on(`Initial message history load`, (msgHistory) => {
    for(let msg of msgHistory) {
        let message = `${formatDate(Number(msg.date_timestamp))}${msg.username} - ${msg.message}\n`;
        textareaMessageBox.append(message);
    }
});

socket.on(`Server sent a message`, (msg) => {
    let message = `${formatDate(msg.date)}${msg.username} - ${msg.message}\n`;
    textareaMessageBox.append(message);

    inputMessage.value = "";
});

socket.on(`User sent a message`, (message) => {
    console.log(message);
    ps.emit(`Server sent a message`, message);
});

buttonSend.addEventListener('click', () => {
    let message = {
        date: Date.now(),
        message: inputMessage.value,
        jwt: localStorage.getItem('jwt') 
    }

    if(inputMessage.value) {
        socket.emit(`User sent a message`, message);
    } else {
        /* Show some sort of error that says that the message can't be empty */
        return;
    }

});



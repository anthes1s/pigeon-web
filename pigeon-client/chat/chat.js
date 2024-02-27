'use strict';

import { formatDate } from './modules/formatDate.mjs';

const socket = io();

const inputMessage = document.getElementById(`inputMessage`);
const textareaMessageBox = document.getElementById(`textareaMessageBox`);
const buttonSend = document.getElementById(`buttonSend`);

socket.on(`Server sent a message`, (msg) => {
    let message = formatDate(msg.date) + ' ' + msg.message + `\n`;

    textareaMessageBox.append(message);

    inputMessage.value = "";
});

buttonSend.addEventListener('click', () => {
    let message = {
        date: Date.now(),
        message: inputMessage.value,
        /* also need a username, but i'll add it later, after i'll get to know how to authorize people properly */
    }

    if(inputMessage.value) {
        /* send the message to the server */
        socket.emit(`User sent a message`, message);
    } else {
        return;
    }

});



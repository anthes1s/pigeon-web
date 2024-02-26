'use strict';

const socket = io();

const inputLogin = document.getElementById(`inputLogin`);
const inputPassword = document.getElementById(`inputPassword`);
const buttonSignIn = document.getElementById(`buttonSignIn`);

buttonSignIn.addEventListener('click', () => {
    socket.emit('buttonClick', {login: inputLogin.value, password: inputPassword.value});
});

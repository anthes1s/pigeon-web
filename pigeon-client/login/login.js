'use strict';

const socket = io();

const inputLogin = document.getElementById(`inputLogin`);
const inputPassword = document.getElementById(`inputPassword`);
const buttonSignIn = document.getElementById(`buttonSignIn`);

buttonSignIn.addEventListener('click', () => {

    /**
     * Instead of emiting shit from the socket,
     * i have to make a query request to the database
     * to check if the given person exists, and if it does i need to redirect it to /chat
     * but then i need to do some sort of authorization to the chat so that without a redirect
     * from query you wouldn't be able to go to the /chat route and you'll get 403 forbidden response
     *  
     * P.S: I have no fucking clue how to do proper authorization
     * P.S.S: TODO --- learn how to authorize users onto server ¯\_(ツ)_/¯
     */
    socket.emit('Sign In', {login: inputLogin.value, password: inputPassword.value});
});

'use strict';

import { formatDate } from './modules/formatDate.mjs';

const inputMessage = document.getElementById(`inputMessage`);
const textareaMessageBox = document.getElementById(`textareaMessageBox`);
const buttonSend = document.getElementById(`buttonSend`);
const inputSearch = document.getElementById(`inputSearch`);
const listUsers = document.getElementById(`listUsers`);
const maindiv = document.getElementById(`maindiv`); 

let receiver = '';
let favorites = [];

function addUserToList(username, socket) {
    let item = document.createElement(`li`);
    let link = document.createElement(`a`);
    link.href = `#`;
    link.textContent = `${username}`;

    item.appendChild(link);

    link.addEventListener(`click`, (event) => {
        receiver = username;
        console.log(receiver);

        textareaMessageBox.innerHTML = '';
        event.preventDefault();
        /* Create a request from which you'll get a message history with that user */
        socket.emit('Get message history', {sender: localStorage.getItem('jwt'), receiver: username});
    });

    return item;
}

/* Validate JWT */
axios.post(`/api/verify`, {
    jwt: localStorage.getItem('jwt')
})
.then(async (response) => {  
    const socket = io({
        query: { jwt: localStorage.getItem('jwt') }
    }); 

    await axios.post(`/api/favorites`, {
        username: localStorage.getItem(`username`)
    })
    .then(async (response) => {
        favorites = await response.data.data;
        for (let user of favorites) {
            listUsers.appendChild(addUserToList(user, socket));
        }
    })
    .catch(err => {
        console.error(err.message);
    })


    socket.on(`Server is asking for a receiver`, () => {
        socket.emit(`User responds with a receiver`, receiver);
    })

    socket.on('Server sent a message history', (msgHistory) => {
        if(!msgHistory) return;
        console.log(msgHistory);
        for(let msg of msgHistory) {
            let message = `${formatDate(msg.date_timestamp)}${msg.username} - ${msg.message}\n`;
            textareaMessageBox.append(message);
        }       
    });
    
    socket.on(`Server sent a message`, (msg) => {
        if(msg.username != receiver) {
            console.log(`User is not connected to the proper chatroom!`);
            return;
        }

        let message = `${formatDate(msg.date_timestamp)}${msg.username} - ${msg.message}\n`;
        textareaMessageBox.append(message);
    
        inputMessage.value = "";
    });
    
    socket.on(`User sent a message`, (message) => {
        ps.emit(`Server sent a message`, message);
    });
    
    buttonSend.addEventListener('click', () => {
        if(!receiver) {
            console.log(`Search for a user to send a message to him!`)
            return;
        }

        let msg = { 
            receiver: receiver,
            date_timestamp: Date.now(),
            message: inputMessage.value,
            jwt: localStorage.getItem('jwt') 
        }

        if(inputMessage.value) {
            let message = `${formatDate(msg.date_timestamp)}${localStorage.getItem('username')} - ${msg.message}\n`;
            textareaMessageBox.append(message);
            inputMessage.value = "";

            socket.emit(`User sent a message`, msg);
        } else {
            /* Show some sort of error that says that the message can't be empty */
            return;
        }
    
    });

    inputSearch.addEventListener('input', () => {
        let username = inputSearch.value;
        listUsers.innerHTML = '';
        
        if(!username) {
            axios.post(`/api/favorites`, {
                username: localStorage.getItem(`username`)
            })
            .then(async (response) => {
                favorites = response.data.data;
                for (let user of favorites) {
                    listUsers.appendChild(addUserToList(user, socket));
                }
            })
            .catch(err => {
                console.error(err.message);
            });
        } else {
            axios.post(`/api/search`, {
                    username: username
            })
            .then(response => {
                let usersFound = response.data.data;

                for(let user of usersFound) {
                    listUsers.appendChild(addUserToList(user.username, socket));
                }
            })
            .catch(err => {
                console.error(err.message);
            });      
        } 
    });   
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
   

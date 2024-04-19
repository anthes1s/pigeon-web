'use strict';

function formateTimestamp(timestamp) {
    const date = new Date(Number(timestamp));
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return `[${day}-${month}-${year} ${hours}:${minutes}]`;
}

function printLabel(message) {
    let label = document.createElement('h1');
    label.textContent = message;
    document.body.appendChild(label);
}

function showApplication() {
    const div = document.getElementById('application');
    div.style.display = 'flex';
}

function appendUserToList(username, socket) {
    let item = document.createElement(`li`);
    let link = document.createElement(`a`);
    link.href = `#`;
    link.textContent = `${username}`;

    item.appendChild(link);

    link.addEventListener(`click`, () => {
        console.log(username, 'clicked in the list');

        localStorage.setItem('receiver', username);
        
        textareaMessageBox.innerHTML = '';
        /* Create a request from which you'll get a message history with that user */
    });

    return item;
}

async function init() {
    try { 
    let response = await axios.post('/auth/verify', {
        jwt: localStorage.getItem('jwt'),
    });

    showApplication();
    localStorage.setItem('receiver', null);
    const socket = io('/chat');

    const buttonSend = document.getElementById('buttonSend');
    const inputSearch = document.getElementById('inputSearch');
    const listUsers = document.getElementById('listUsers');
    const textareaMessageBox = document.getElementById('textareaMessageBox');

    inputSearch.addEventListener('input', async () => {
        try {
            let user = inputSearch.value;
            listUsers.innerHTML = '';

            if(!user) { 
                // List chatrooms that already exist
                return;
            }
       
            let response = await axios.get('/chat/search', {
                params: {
                    username: user,
                }
            });

            let usersFound = response.data;

            for(let username of usersFound) {
                if(username === localStorage.getItem('username')) continue;
                listUsers.appendChild(appendUserToList(username, socket));
            }
       
        } catch (error) {
            console.log(error.message);
        }
    });
    
    buttonSend.addEventListener('click', () => {
        const inputMessage = document.getElementById('inputMessage');
        
        let message = { 
            timestamp: Date.now(), 
            sender: localStorage.getItem('username'),
            receiver: localStorage.getItem('receiver'),
            message: inputMessage.value,
        }
        socket.emit('message', message);

        textareaMessageBox.append(`${formateTimestamp(message.timestamp)} ${message.sender} - ${message.message}`)
        inputMessage.value = "";
    });

    } catch(error) {
        if(error.response?.data?.statusCode) {
            let message = `${error.response.data.statusCode} - ${error.response.data.error}: ${error.response.data.message}`;
            printLabel(message);
        }
    }  
}

init();
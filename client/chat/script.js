'use strict';

function formateTimestamp(timestamp) {
  const date = new Date(Number(timestamp));

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

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

  link.addEventListener(`click`, (event) => {
    console.log(username, 'clicked in the list');
    localStorage.setItem('receiver', username);

    textareaMessageBox.innerHTML = '';
    event.preventDefault();

    socket.emit('message-history', {
      sender: localStorage.getItem('username'),
      receiver: localStorage.getItem('receiver'),
    });
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
    const socket = io('/chat', {
      query: {
        username: localStorage.getItem('username'),
      },
    });

    const buttonSend = document.getElementById('buttonSend');
    const inputSearch = document.getElementById('inputSearch');
    const listUsers = document.getElementById('listUsers');
    const textareaMessageBox = document.getElementById('textareaMessageBox');

    socket.on('search', (users) => {
      console.log(users);
      let ownUsername = localStorage.getItem('username');
      if (!users) {
        listUsers.innerHTML = '';
        return;
      }

      for (let user of users) {
        if (user !== ownUsername)
          listUsers.appendChild(appendUserToList(user, socket));
      }
    });

    socket.on('new-message', (message) => {
      if (message.sender === localStorage.getItem('receiver'))
        textareaMessageBox.append(
          `${formateTimestamp(new Date(message.timestamp))} ${message.sender} - ${message.message}\n`,
        );
      else
        textareaMessageBox.append(
          `You've got new message from: ${message.sender}!\n`,
        );
    });

    socket.on('message-history', (messages) => {
      for (let message of messages) {
        textareaMessageBox.append(
          `${formateTimestamp(new Date(message.timestamp))} ${message.sender} - ${message.message}\n`,
        );
      }
    });

    socket.on('favorites', (favorites) => {
      for (let user of favorites) {
        listUsers.appendChild(appendUserToList(user, socket));
      }
    });

    socket.emit('favorites', { username: localStorage.getItem('username') });

    inputSearch.addEventListener('input', async () => {
      try {
        let user = inputSearch.value;
        listUsers.innerHTML = '';

        if (!user) {
          socket.emit('favorites', {
            username: localStorage.getItem('username'),
          });
          return;
        }
        socket.emit('search', { username: user });
      } catch (error) {
        console.log(error);
      }
    });

    buttonSend.addEventListener('click', () => {
      const inputMessage = document.getElementById('inputMessage');

      let message = {
        timestamp: Date.now(),
        sender: localStorage.getItem('username'),
        receiver: localStorage.getItem('receiver'),
        message: inputMessage.value,
      };

      socket.emit('new-message', message);

      textareaMessageBox.append(
        `${formateTimestamp(message.timestamp)} ${message.sender} - ${message.message}\n`,
      );
      inputMessage.value = '';
    });
  } catch (error) {
    if (error.response?.data?.statusCode) {
      let message = `${error.response.data.statusCode} - ${error.response.data.error}: ${error.response.data.message}`;
      printLabel(message);
    }
  }
}

init();

'use strict';

require('dotenv').config();

const PigeonServer = require('./modules/PigeonServer');
const path = require('path');

const ps = new PigeonServer();

ps.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/login/login.html'));
});

ps.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/chat/chat.html'))
});

ps.on('connection', (socket) => {
    console.log(`User connected!`);

    socket.on('Sign In', (user) => {

        /* insert database logic */
        /* you can also encrypt them all before adding to the database */
        console.log(user);
    })

    socket.on(`User sent a message`, (message) => {
        console.log(message);
        ps.emit(`Server sent a message`, message);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected!`);
    });
});

ps.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running at ${`localhost`}:${process.env.SERVER_PORT}`);
});
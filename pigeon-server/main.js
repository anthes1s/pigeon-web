'use strict';

const ps = require('./modules/PigeonServer');
const path = require('path');

ps.express_server.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/login/login.html'));
});

ps.express_server.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/chat/chat.html'))
});

ps.io.on('connection', (socket) => {
    console.log(`User connected!`);

    socket.on('Sign In', (user) => {

        /* insert database logic */
        /* you can also encrypt them all before adding to the database */
        console.log(user);
    })

    socket.on(`User sent a message`, (message) => {
        console.log(message);
        ps.io.emit(`Server sent a message`, message);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected!`);
    });
});

ps.http_server.listen(ps.port, ps.localhost, () => {
    console.log(`Server is running at ${ps.localhost}:${ps.port}`);
});
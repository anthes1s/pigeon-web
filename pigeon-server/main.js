'use strict';

const ps = require('./modules/PigeonServer');
const path = require('path');

ps.express_server.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/login.html'));
});

ps.io.on('connection', (socket) => {
    console.log(`User connected!`);

    socket.on('buttonClick', (user) => {
        console.log(user);
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected!`);
    });
});

ps.http_server.listen(ps.port, ps.localhost, () => {
    console.log(`Server is running at ${ps.localhost}:${ps.port}`);
});
'use strict';

require('dotenv').config();

const PigeonApplication = require('./modules/PigeonApplication');
const path = require('path');
const jwt = require('jsonwebtoken');

const pa = new PigeonApplication();

pa.use('/login',    pa.static(path.resolve(__dirname, '../pigeon-client/login')));
pa.use('/chat',     pa.static(path.resolve(__dirname, '../pigeon-client/chat')));
pa.use('/register', pa.static(path.resolve(__dirname, '../pigeon-client/register')));
pa.use('/api',      pa.getAPIRouter());

pa.get('/', (req, res) => { 
    res.redirect('/login'); 
});

/* TODO: Refactor this somehow */
pa.on('connection', async (socket) => {
    console.log(`User connected!`);

    let token = socket.handshake.query.jwt; 
    jwt.verify(token, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {
        if(err) {
            console.error(`Error happened: ${err.message}`);
        }
        pa.addSocket(decoded.username, socket);
    });

    let messageHistory = await pa.getMessageHistory(`global`);
    socket.emit('Initial message history load', messageHistory);

    socket.on(`User sent a message`, (msg) => {
        jwt.verify(msg.jwt, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {
        if(err) {
            console.error(`Error: ${err.message}`);
            return;
        }
            const timestamp = msg.date;
            const username = decoded.username;
            const message = msg.message;

            const messageToSend = {date: timestamp, username: username, message: message};  
            pa.emit(`Server sent a message`, messageToSend);
            pa.addMessage(`global`, {date: timestamp, username: username, message: message});
        });    
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected!`);
        pa.deleteSocket(socket);
    });
});

pa.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running at ${`localhost`}:${process.env.SERVER_PORT}`);
});

/**
 * Reasons to switch to Typescript:
 * 1) Function overloading
 * 2) Something else that I've completely forgotten 
 * 3) `Implements` that kind of works like a multiple inheritance
 * ?) ...
 * ?) To be continued
 */
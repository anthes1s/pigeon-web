'use strict';

require('dotenv').config();

const PigeonApplication = require('./modules/PigeonApplication');
const jwt = require('jsonwebtoken');
const path = require('path');

/* Encapsulate this into a PigeonApplication? */
const pa = new PigeonApplication();

pa.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/login/login.html'));
});

pa.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/chat/chat.html'));
});

pa.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/register/register.html'));
});

/* TODO: Create an ExpressJS router for `/api/...` */
pa.post('/api/login', async (req, res) => {
    try {
        let {username, password} = req.body;
        if(await pa.userExists(username, password)) {
            /* Do not transfer a password into a JWTs payload? */
            let token = jwt.sign({ username }, process.env.ACCESS_JWT_TOKEN);
            res.json({success: true, message: `${username} was found!`, jwt: token});
        } else {
            res.json({ success: false, message: `${username} was not found!`});
        }
    } catch(err) {
        res.sendStatus(403).json({ success: false, error: `${err.message}`});
    }
});

pa.post('/api/verify', (req, res) => {
    let token = req.body.jwt;
    jwt.verify(token, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {
        if(err) {
            return res.sendStatus(403);
        }
        res.sendStatus(200);
    });
})

pa.post('/api/register', async (req, res) => {
    let {username, password} = req.body;
    if(await pa.usernameExists(username)) {
        res.json({success: false, message: "Username was already taken"});
    } else {
        await pa.addUser(username, password);
        res.json({success: true, message: "Registation successful" });
    }
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
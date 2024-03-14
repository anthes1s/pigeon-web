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

    socket.on(`Get message history`, async (req) => {  
        jwt.verify(req.sender, process.env.ACCESS_JWT_TOKEN, async (err, decoded) => {
            if(err) {
                console.error(`Error occurred: ${err.message}`);
            }

            let sender = decoded.username;
            let receiver = req.receiver;
            
            let chatroomName = await pa.chatroomFind(sender, receiver);
            
            /* If chat room doesn't exist, create it! */
            if(chatroomName === `Table not found`) {
                await pa.chatroomCreate(sender, receiver);
                chatroomName = await pa.chatroomFind(sender, receiver);
            }

            let messageHistory = await pa.getMessageHistory(chatroomName);

            socket.emit('Server sent a message history', messageHistory);
        });

    });

    socket.on(`User sent a message`, (msg) => {
        jwt.verify(msg.jwt, process.env.ACCESS_JWT_TOKEN, async (err, decoded) => {
        if(err) {
            console.error(`Error: ${err.message}`);
            return;
        }   
            console.log(msg);

            const timestamp = msg.date_timestamp;
            const sender = decoded.username;
            const receiver = msg.receiver;
            const message = msg.message;

            const messageToSend = { date_timestamp: timestamp, username: sender, message: message, receiver: msg.receiver };  
            
            if(pa.getSocket(receiver)) {
                pa.getSocket(receiver).emit(`Server sent a message`, messageToSend);
            }
                
            let chatroomName = await pa.chatroomFind(sender, receiver);
            await pa.addMessage(chatroomName, { date_timestamp: timestamp, username: sender, message: message });
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
 * 4) This whole shit would look better if i written it on Nest+TS
 * ?) To be continued
 */
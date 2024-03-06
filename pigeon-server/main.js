'use strict';

require('dotenv').config();

const PigeonServer = require('./modules/PigeonServer');
const PigeonDatabase = require('./modules/PigeonDatabase');
const jwt = require('jsonwebtoken');
const path = require('path');

const ps = new PigeonServer();
const pd = new PigeonDatabase();

ps.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/login/login.html'));
});

/* For `/chat` add a JWT authorization middleware */

ps.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/chat/chat.html'))
});

ps.post('/api/login', async (req, res) => {
    try {
    let {username, password} = req.body;

    if(await pd.userExists(username, password)) {
        /* Also sign a JWT and send it to the client so he can access `/chat` */
        let token = jwt.sign({username, password}, process.env.ACCESS_JWT_TOKEN);
        res.json({success: true, message: `${username} was found!`, jwt: token});
    } else {
        res.json({ success: false, message: `${username} was not found!`});
    }
    } catch(err) {
        res.sendStatus(403).json({ success: false, error: `${err.message}`});
    }
});

ps.post('/api/verify', (req, res) => {
    let token = req.body.jwt;
    console.log(token);

    jwt.verify(token, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {
        if(err) {
            console.log(err.message);
            return res.sendStatus(403);
        }
        console.log(decoded);
        res.sendStatus(200);
    });
})

/* Before handling `/chat` make a proper authorization YOU FUCKING TWAT */ 

ps.on('connection', async (socket) => {
    console.log(`User connected!`);
    let messageHistory = await pd.getMessageHistory(`global`);
    socket.emit('Initial message history load', messageHistory);
    
    socket.on('Sign In', (user) => {
        
    })

    socket.on(`User sent a message`, (msg) => {
        /**
         * 1) Extract the username from the JWT
         * 2) Format a message (add date, username (from JWT) and a message itself)
         * 3) Emit it back
         * 4) Add it to the database
        **/
        jwt.verify(msg.jwt, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {
        if(err) {
            console.error(`Error: ${err.message}`);
            return;
        }
            const timestamp = msg.date;
            const username = decoded.username;
            const message = msg.message;

            const messageToSend = {date: timestamp, username: username, message: message};  
            ps.emit(`Server sent a message`, messageToSend);

            pd.addMessage(`global`, {date: timestamp, username: username, message: message});
        });    
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected!`);
    });
});

ps.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running at ${`localhost`}:${process.env.SERVER_PORT}`);
});
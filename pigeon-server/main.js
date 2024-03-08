'use strict';

require('dotenv').config();

const PigeonServer = require('./modules/PigeonServer');
const PigeonDatabase = require('./modules/PigeonDatabase');
const jwt = require('jsonwebtoken');
const path = require('path');

/* Encapsulate this into a PigeonApplication? */
const ps = new PigeonServer();
const pd = new PigeonDatabase();

ps.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/login/login.html'));
});

ps.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/chat/chat.html'));
});

ps.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pigeon-client/register/register.html'));
});

/* TODO: Create an ExpressJS router for `/api/...` */
ps.post('/api/login', async (req, res) => {
    try {
        let {username, password} = req.body;
        if(await pd.userExists(username, password)) {
            /* Do not transfer a password into a JWTs payload? */
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
    jwt.verify(token, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {
        if(err) {
            return res.sendStatus(403);
        }
        res.sendStatus(200);
    });
})

ps.post('/api/register', async (req, res) => {
    let {username, password} = req.body;
    /* Check if the user with the same name already exists and only then add him to the database */
    if(await pd.usernameExists(username)) {
        res.json({success: false, message: "Username was already taken"});
    } else {
        await pd.addUser(username, password);
        res.json({success: true, message: "Registation successful" });
    }
});

/* TODO: Refactor this somehow */
ps.on('connection', async (socket) => {
    console.log(`User connected!`);
    let messageHistory = await pd.getMessageHistory(`global`);
    socket.emit('Initial message history load', messageHistory);
    
    socket.on('Sign In', (user) => {
        
    });

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


/**
 * Reasons to switch to Typescript:
 * 1) Function overloading
 * 2) Something else that I've completely forgotten 
 * 3) ...
 * 4) To be continued
 */
'use strict';

const PigeonServer = require('./PigeonServer');
const PigeonDatabase = require('./PigeonDatabase');
const PigeonSocketManager = require('./PigeonSocketManager');
const PigeonCacheManager = require('./PigeonCacheManager');
const jwt = require('jsonwebtoken');

class PigeonApplication {
    constructor() {
        this._pd = new PigeonDatabase();
        this._pcm = new PigeonCacheManager();
        this._ps = new PigeonServer();
        this._psm = new PigeonSocketManager();       
    }

    /* PigeonServer Functions */
    static(root)                                { return this._ps.static(root) }
    use(route, ...middleware)                   { this._ps.use(route, ...middleware) }
    get(route, ...middleware)                   { this._ps.get(route, ...middleware) }
    post(route, ...middleware)                  { this._ps.post(route, ...middleware) }
    on(event, callback)                         { this._ps.on(event, callback) }
    emit(event, ...data)                        { this._ps.emit(event, ...data) }
    listen(port, callback)                      { this._ps.listen(port, callback) }
	
    /* PigeonDatabase Functions */
    async userFind(username)                    { return await this._pd.userFind(username) }
    async userExists(username, password)        { return await this._pd.userExists(username, password) }
    async usernameExists(username)              { return await this._pd.usernameExists(username) }
    async getMessageHistory(tableName)          { return await this._pd.getMessageHistory(tableName) }
    async addMessage(tableName, msgObject)      { await this._pd.addMessage(tableName, msgObject) }
    async addUser(username, password)           { await this._pd.addUser(username, password) }
    async chatroomFind(sender, receiver)        { return await this._pd.chatroomFind(sender, receiver) }
    async chatroomCreate(sender, receiver)      { await this._pd.chatroomCreate(sender, receiver) }
    async chatroomFavorites(username)           { return await this._pd.chatroomFavorites(username) }
    
    /* PigeonSocketManager Functions */
    addSocket(username, socket)                 { this._psm.addSocket(username, socket) }
    deleteSocket(socket)                        { this._psm.deleteSocket(socket) }
    getSocket(username)                         { return this._psm.getSocket(username) }

    /* PigeonCacheManager Functions */
    async setCache(key, value)                  { await this._pcm.setCache(key, value) }
    async getCache(key)                         { return await this._pcm.getCache(key) }
    async checkCache(key)                       { return await this._pcm.checkCache(key) }
    async appendCache(key, value)               { await this._pcm.appendCache(key, value) } 

    /* Create additional routers using PigeonServers getRouter method */
    getAPIRouter() {
        const router = this._ps.getRouter();
        /* Now create callbacks as a controllers in a different file/object */
        router.post(`/search`, async (req, res) => {
            try {
                let { username } = req.body;
                if(!username) return res.json({ success: true, message: `Users were successfully found!`, data: [] }); // This is kind of useless because of `favorites`? 
                let usersFound = await this.userFind(username);
                res.json({ success: true, message: `Users were successfully found!`, data: usersFound });
            } catch(err) {
                res.json({ success: false, message: `Error occured: ${err.message}` });
            }
        });

        router.post('/login', async (req, res) => {
            try {
                let {username, password} = req.body;
                if(await this.userExists(username, password)) {
                    let token = jwt.sign({ username }, process.env.ACCESS_JWT_TOKEN);
                    res.json({success: true, message: `${username} was found!`, jwt: token, username: username});
                } else {
                    res.json({ success: false, message: `${username} was not found!`});
                }
            } catch(err) {
                res.sendStatus(403).json({ success: false, error: `${err.message}`});
            }
        });

        router.post('/verify', (req, res) => {
            let token = req.body.jwt;
            jwt.verify(token, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {
                if(err) {
                    return res.sendStatus(403);
                }
                res.sendStatus(200);
            });
        })

        router.post('/register', async (req, res) => {
            try {
            let {username, password} = req.body;
            if(await this.usernameExists(username)) {
                res.json({success: false, message: "Username was already taken"});
            } else {
                await this.addUser(username, password);
                res.json({success: true, message: "Registation successful" });
            }
            } catch (err) {
                console.error(`Error occurred: ${err.message}`);
            }
        });


        /* Add Redis caching here */
        router.post(`/favorites`, async (req, res) => {
            try {
            let username = req.body.username;
            let result = await this._pd.chatroomFavorites(username);
            let favorites = []
            for(let row of result) {
                if(row.table_name.split(`_`)[0] === username) favorites.push(row.table_name.split('_')[1]);
                else if(row.table_name.split(`_`)[1] === username) favorites.push(row.table_name.split('_')[0]);
            }
            res.json({success: true, data: favorites });
            } catch (err) {
                console.error(`Error occurred: ${err.message}`);
            }
        })

        return router;
    }
}

module.exports = PigeonApplication;


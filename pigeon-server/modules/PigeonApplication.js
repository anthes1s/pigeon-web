'use strict';

const PigeonServer = require('./PigeonServer');
const PigeonDatabase = require('./PigeonDatabase');
const PigeonSocketManager = require('./PigeonSocketManager');

class PigeonApplication {
    constructor() {
        this._ps = new PigeonServer();
        this._pd = new PigeonDatabase();
        this._psm = new PigeonSocketManager();
    }

    /* PigeonServer Functions */
    use(...middleware)          { this._ps.use(...middleware) }
    get(route, ...middleware)   { this._ps.get(route, ...middleware) }
    post(route, ...middleware)  { this._ps.post(route, ...middleware) }
    on(event, callback)         { this._ps.on(event, callback) }
    emit(event, ...data)        { this._ps.emit(event, ...data) }
    listen(port, callback)      { this._ps.listen(port, callback) }
    
    /* PigeonDatabase Functions */
    async userExists(username, password)      { return await this._pd.userExists(username, password) }
    async usernameExists(username)            { return await this._pd.usernameExists(username) }
    async getMessageHistory(tableName)        { return await this._pd.getMessageHistory(tableName) }
    async addMessage(tableName, msgObject)    { await this._pd.addMessage(tableName, msgObject) }
    async addUser(username, password)         { await this._pd.addUser(username, password) }
    
    /* PigeonSocketManager Functions */
    addSocket(username, socket) { this._psm.addSocket(username, socket) }
    deleteSocket(socket)        { this._psm.deleteSocket(socket) }
    getSocket(username)         { return this._psm.getSocket(username) }
}

module.exports = PigeonApplication;


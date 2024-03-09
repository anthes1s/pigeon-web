'use strict'; 

class PigeonSocketManager {
    constructor() {
        this._clients = new Map();
    }

    addSocket(username, socket) {
        this._clients.set(username, socket);
        console.log(this._clients.keys());
    }

    deleteSocket(socket) {
        this._clients.forEach((value, key) => {
            if(socket === value) {
                this._clients.delete(key);
            }
        });
        console.log(this._clients.keys());
    }

    getSocket(username) {
        return this._clients.get(username);
    }
}

module.exports = PigeonSocketManager;
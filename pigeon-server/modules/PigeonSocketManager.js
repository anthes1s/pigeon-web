'use strict'; 

class PigeonSocketManager {
    constructor() {
        this._clients = new Map();
    }

    addSocket(username, socket) {
        this._clients.set(username, socket);
    }

    deleteSocket(socket) {
        this._clients.forEach((value, key) => {
            if(socket === value) {
                this._clients.delete(key);
            }
        });
    }

    getSocket(username) {
        return this._clients.get(username);
    }
}

module.exports = PigeonSocketManager;
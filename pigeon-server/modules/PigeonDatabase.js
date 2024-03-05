'use strict';

const { Client } = require('pg');

class PigeonDatabase {
    constructor() {
        this._client = new Client({
            user: "postgres",
            password: "postgres",
            host: "localhost",
            database: "pigeondatabase"
        });

        this._client.connect()
        .then(() => {
            console.log("PostgreSQL successfully connected!")
        })
        .catch((err) => {
            console.error(`Error: ${err.message}`);
        })
    }

    async userExists(username, password) {
        try{
            let user = await this._client.query(`SELECT username, password FROM users WHERE username = '${username}' AND password ='${password}'`);
            return Boolean(user.rowCount);
        } catch(err) {
            console.error(`${username} not found!\nError: ${err.message}`);
            throw err;
        }
    }
}

module.exports = PigeonDatabase;
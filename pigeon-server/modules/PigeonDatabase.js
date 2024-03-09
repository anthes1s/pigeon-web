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
            console.error(`PostgreSQL Error: ${err.message}`);
        })
    }

    /* Next two functions (userExists and usernameExists) is one of the reasons i should switch to Typescript */
    async userExists(username, password) {
        try{
            let user = await this._client.query(`SELECT username, password FROM users WHERE username = '${username}' AND password ='${password}'`);
            return Boolean(user.rowCount);
        } catch(err) {
            console.error(`${username} not found!\nError: ${err.message}`);
        }
    }

    async usernameExists(username) {
        try{
            let user = await this._client.query(`SELECT username FROM users WHERE username = '${username}'`);
            return Boolean(user.rowCount);
        } catch(err) {
            console.error(`${username} not found!\nError: ${err.message}`);
        }
    }

    async getMessageHistory(tableName) {
        /* This needs additional error handling for: Wrong table name, wrong table (that doesn't contain messages), etc */
        try {
            let messageHistory = await this._client.query(`SELECT * FROM ${tableName}`);
            return messageHistory.rows;
        } catch(err) {
            console.error(`Error occured while fetching message history: ${err.message}`);
        }
    }

    async addMessage(tableName, msgObject) {
        await this._client.query(`INSERT INTO ${tableName} (date_timestamp, username, message) VALUES (${msgObject.date}, '${msgObject.username}', '${msgObject.message}')`);
    }

    async addUser(username, password) {
        await this._client.query(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`);
    }
}

module.exports = PigeonDatabase;
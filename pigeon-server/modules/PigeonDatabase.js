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

    async userFind(username) {
        try {
            const options = {
                text: `SELECT username FROM users WHERE username LIKE $1`,
                values: [username + '%']
            }

            let result = await this._client.query(options);
            return result.rows;
        } catch(err) {
            console.error(`${username} not found!\nError: ${err.message}`);
        }
    }

    /* Next two functions (userExists and usernameExists) is one of the reasons i should switch to Typescript */
    async userExists(username, password) {
        try{
            const options = {
                text: `SELECT username, password FROM users WHERE username = $1 AND password = $2`,
                values: [username, password]
            }

            let user = await this._client.query(options);
            return Boolean(user.rowCount);
        } catch(err) {
            console.error(`${username} not found!\nError: ${err.message}`);
        }
    }

    async usernameExists(username) {
        try{
            const options = {
                text: `SELECT username FROM users WHERE username = $1`,
                values: [username]
            }

            let user = await this._client.query(options);
            return Boolean(user.rowCount);
        } catch(err) {
            console.error(`${username} not found!\nError: ${err.message}`);
        }
    }

    async getMessageHistory(tableName) {
        try {
            const options = {
                text: `SELECT * FROM ${tableName}`,
            }

            let messageHistory = await this._client.query(options);
            console.log(messageHistory.rows);
            return messageHistory.rows;
        } catch(err) {
            console.error(`Error occured while fetching message history: ${err.message}`);
        }
    }

    async addMessage(tableName, msgObject) {
        const options = {
            text: `INSERT INTO ${tableName} (date_timestamp, username, message) VALUES ($1, $2, $3)`,
            values: [msgObject.date_timestamp, msgObject.username, msgObject.message]
        }

        await this._client.query(options);
    }

    async addUser(username, password) {
        const options = {
            text: `INSERT INTO users (username, password) VALUES ($1, $2)`,
            values: [username, password]
        }
        await this._client.query(options);
    }

    async chatroomFind(sender, receiver) {
        const tableSuffix = `_msghistory`;
        const firstNameToCheck = `${sender}_${receiver}${tableSuffix}`.toLowerCase();
        const secondNameToCheck = `${receiver}_${sender}${tableSuffix}`.toLowerCase();

        const options = {
            text: `SELECT table_name FROM information_schema.tables 
                   WHERE table_name = $1
                   OR table_name = $2`,
            values: [firstNameToCheck, secondNameToCheck]
        }

        let result = await this._client.query(options);
                                               
        if(result.rowCount == 0) return `Table not found`;


        let chatroomName = await result.rows[0].table_name;
        return chatroomName;
    }

    async chatroomCreate(sender, receiver) {
        let tableSuffix = `_msghistory`;
        const chatroomName = `${sender}_${receiver}${tableSuffix}`.toLowerCase();

        const options = {
            text: `CREATE TABLE IF NOT EXISTS ${chatroomName} (
                date_timestamp BIGINT NOT NULL,
                username VARCHAR(255) NOT NULL,
                message VARCHAR(255) NOT NULL
            )`,
        }
        
        await this._client.query(options);
    }

    async chatroomFavorites(username) {
        const options = { 
            text: `SELECT table_name FROM information_schema.tables 
                   WHERE table_name LIKE $1
                   AND table_name NOT LIKE $2`,
            values: ['%' + username + '%', `${username}_${username}_msghistory`]
        }
        
        let result = await this._client.query(options);
        return result.rows;
    }

}

module.exports = PigeonDatabase;
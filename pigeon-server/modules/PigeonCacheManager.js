'use strict';

const redis = require('redis');

class PigeonCacheManager {
    constructor() {
        this._client = redis.createClient({
            host: `172.24.103.218`,
            port: 6379
        });

        this._client.connect();
        console.log(`Connected to Redis...`);
    }

    async setCache(key, value) {
        try {        
            await this._client.setEx(key, 1800, JSON.stringify(value).slice(0, -1));
        } catch (err) {
            console.error(`Redis Error Occurred: ${err.message}`);
        }
    }

    async getCache(key) {
        try {
            let result = await this._client.get(key);
            return JSON.parse(result + `]`);
        } catch(err) {
            console.error(`Redis Error Occurred: ${err.message}`);
        }
    }

    async checkCache(key) {
        try {
            let result = await this._client.exists(key);
            return Boolean(result);
        } catch (err) {
            console.error(`Redis Error Occurred: ${err.message}`);
        }
    }

    async appendCache(key, value) {
        try {          
            await this._client.append(key, `,` + JSON.stringify(value));
        } catch (err) {
            console.error(`Redis Error Occurred: ${err.message}`);
        }
    }
}

module.exports = PigeonCacheManager;
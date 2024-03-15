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

    setCache(key, value) {
        this._client.setEx(key, 1800, JSON.stringify(value));
    }

    async getCache(key) {
        let result = await this._client.get(key);
        return JSON.parse(result);
    }

    async checkCache(key) {
        let result = await this._client.exists(key);
        return Boolean(result);
    }
}

module.exports = PigeonCacheManager;
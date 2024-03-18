'use strict';

const PigeonServer = require('../pigeon-server/modules/PigeonServer');
const ioClient = require('socket.io-client');

let ps;
let client;

beforeEach((done) => {
    ps = new PigeonServer;
    ps.listen(3000);

    client = ioClient.connect('http://localhost:3000/');

    client.on('connect', () => {
        done();
    });
});

afterEach((done) => {
    client.disconnect();
    ps.close(() => {
        done();
    });
});

test('PigeonServer properly delegates middleware usage from ExpressJS', async () => { 
    ps.use((req, res, next) => {
        req.middlewareUsed = true;
        next();
    });

    ps.get('/', (req, res) => {
        res.json({ success: req.middlewareUsed });
    })

    try {
        let response = await fetch('http://localhost:3000/', { method: "GET" });
        let result = await response.json();

        expect(result.success).toBe(true);
    } catch(err) {
        console.error(err.message);
        expect(false).toBe(true);
    } 
});

test('GET method is properly delegated', async () => {
    ps.get('/', (req, res) => {
        res.json({ success: true });
    });
    try {
        let response = await fetch('http://localhost:3000/', { method: "GET "});
        let result = response.json();
        
        expect(result.success).toBe(true);
    } catch (err) {
        expect(false).toBe(false);
    } 
});

test('POST method is properly delegated', async () => {
    ps.post('/', (req, res) => {
        res.json({ success: true });
    });

    try {
        let response = await fetch('http://localhost:3000/', { method: "POST "});
        let result = response.json();

        expect(result.success).toBe(true);
    } catch (err) {
        expect(false).toBe(false);
    }
});

test('Socket.io `.on()` method is properly delegated', () => {
    ps.on('connection', (socket) => {
        socket.on('test', (data) => {
            expect(data).toBe(true);
        });
    });

    client.emit('test', true);
});

test('Socket.io emitter is propperly delegated', () => {
    client.on('test', (data) => {
        expect(data).toBe(true);
    });

    ps.emit('test', true);
});
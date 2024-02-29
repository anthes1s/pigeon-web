'use strict';

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

class PigeonServer {
	constructor() {
		this.express_server = express();
		this.http_server = http.createServer(this.express_server);
		this.io = new Server(this.http_server);

		this.express_server.use(express.static('pigeon-client')); 

		this.http_server.on('error', (error) => {
			console.error('HTTP Server Error:', error);
		});
	}

	get(route, ...middleware) {
		this.express_server.get(route, ...middleware);
	}

	on(event, callback) {
		this.io.on(event, callback);
	}

	emit(event, ...data) {
		this.io.emit(event, ...data);
	}

	listen(port = undefined, callback) {
		this.http_server.listen(port, callback);
	}
}

module.exports = PigeonServer;
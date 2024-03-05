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
		this.express_server.use(express.json());

		this.http_server.on('error', (error) => {
			console.error('HTTP Server Error:', error);
		});
	}

	use(...middleware) {
		this.express_server.use(...middleware);
	}

	get(route, ...middleware) {
		this.express_server.get(route, ...middleware);
	}

	post(route, ...middleware) {
		this.express_server.post(route, ...middleware);
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
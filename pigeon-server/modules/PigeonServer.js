'use strict';

const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

class PigeonServer {
	constructor() {
		this._express_server = express();
		this._http_server = http.createServer(this._express_server);
		this._io = new Server(this._http_server);

		this._express_server.use(express.json());
		
		this._http_server.on('error', (error) => {
			console.error('HTTP Server Error:', error.message);
		});
	}

	static(root) {
		return express.static(root)
	}

	use(route = undefined, ...middleware) {
		this._express_server.use(route, ...middleware);
	}

	get(route, ...middleware) {
		this._express_server.get(route, ...middleware);
	}

	post(route, ...middleware) {
		this._express_server.post(route, ...middleware);
	}

	on(event, callback) {
		this._io.on(event, callback);
	}

	emit(event, ...data) {
		this._io.emit(event, ...data);
	}

	listen(port = undefined, callback) {
		this._http_server.listen(port, callback);
	}

	getRouter() {
		return express.Router(); 
	}
}

module.exports = PigeonServer;
'use strict';

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

const port = 3000;
const localhost = require('ip').address();


/* this probably needs to be encapsulated */
const express_server = express();
const http_server = http.createServer(express_server);
const io = new Server(http_server);

express_server.use(express.static('pigeon-client'));

module.exports = {
	express_server,
	http_server,
	io,
	port,
	localhost
}
// Main JS file
const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const appHandler = require('./handler');

const honk = express();
appHandler(honk);
const honkServer = http.createServer(honk);
const PORT = require('./serverinfo').port ?? 6005;
const io = socketio(honkServer);

honkServer.listen(PORT, () => console.log(`Honking in port ${PORT}`));

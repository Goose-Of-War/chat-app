// Main JS file
const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');

const appHandler = require('./handler');
const serverInfo = require('./serverinfo.json');
const DB = require('../database/database');

const honk = express();
const honkServer = http.createServer(honk);
const PORT = require('./serverinfo').port ?? 6005;
const io = socketio(honkServer);
honk.use(bodyParser.urlencoded({ extended: true }));
honk.use(bodyParser.json())
appHandler(honk);

if (serverInfo.mongoLink) DB.init();

honkServer.listen(PORT, () => console.log(`Honking in port ${PORT}`));

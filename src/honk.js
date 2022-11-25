// Main JS file
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const nunjucks = require('nunjucks');
const path = require('path');
const socketio = require('socket.io');

const appHandler = require('./handler');
const serverInfo = require('./serverinfo.json');
const DB = require('../database/database');
global.Tools = require('./tools')

const honk = express();
const honkServer = http.createServer(honk);
const PORT = serverInfo.port ?? 6005;
const io = socketio(honkServer);

nunjucks.configure({ express: honk })
honk.use(bodyParser.urlencoded({ extended: true }));
honk.use(bodyParser.json())
honk.use(express.static(path.resolve(__dirname, '../templates')));

appHandler(honk);

if (serverInfo.mongoLink) DB.init();

honkServer.listen(PORT, () => console.log(`Honking in port ${PORT}`));

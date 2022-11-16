// Database connection file
const mongoose = require('mongoose');

const connectLink = require('../src/serverinfo.json').mongoLink;

exports.init = () => {
	if (!connectLink) throw new Error("No database link ;-;");
	mongoose.connect(connectLink, { connectTimeoutMS: 5000 }).then(db => {
		const socket = db.connections[0];
		console.log(`Connected to the database at ${socket.host}:${socket.port}`);
	}).catch(err => console.log(`Unable to connect.\nError: ${err}`));
};
const mongoose = require('mongoose');

const User = require('./schemas/User');

async function getUser (cred) {
	return (await User.find(cred));
}

async function addNewUser (_user) {
	// user = { displayName, username, password, emailAddress }
	if (!_user) throw new Error("No blank users accepted");
	const user = User(_user);
	return user.save();
}


module.exports = { addNewUser }

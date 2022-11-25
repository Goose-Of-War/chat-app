const mongoose = require('mongoose');

const User = require('./schemas/User');

async function getUser (cred) {
	return (await User.findOne(cred));
}

async function addNewUser (_user) {
	// user = { displayName, username, password, emailAddress }
	if (!_user) throw new Error("No blank users accepted");
	let user = await getUser({ username: _user.username });
	if (user) {
		console.log(user);
		throw new Error("Username already exists");
	}
	user = User(_user);
	user.password = Tools.encodePassword(user.password);
	return user.save();
}

module.exports = { addNewUser, getUser }

// Handler. Nothing here yet
const path  = require('path');

const DBH = require('../database/database_handler');

module.exports = function handler (app) {
	// plain redirect ;-;
	app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../templates/index.html')));

	// Auth

	// Sign-in
	app.get('/signin', (req, res) => {
		if (req.cookies.user) res.redirect('/success');
		res.sendFile(path.join(__dirname, '../templates/signin.html'));
	});

	app.post('/signin', (req, res) => {
		const { username, password } = req.body;
		DBH.getUser({
			username,
			password: Tools.encodePassword(password)
		}).then(user => {
			if (user) {
				res.cookie('user', username);
				res.cookie('name', user.displayName ?? 'Anonymous');
				res.redirect("/success");
			} else {
				res.send('Invalid creds.');
			}
		}).catch(err => console.log(err));
	});

	// Sign-up
	app.get('/signup', (req, res) => {
		if (req.cookies.user) res.redirect('/success');
		res.sendFile(path.join(__dirname, '../templates/signup.html'));
	});

	app.post('/signup', (req, res) => {
		const user = { username, displayName, emailAddress, password } = req.body;
		if (Tools.checkUserInfo(user)) {
			DBH.addNewUser(user).then(output => {
				res.cookie('user', username);
				res.cookie('name', displayName ?? 'Anonymous');
				res.redirect("/success");
			}).catch(err => console.log(err));
		} else res.send('Invalid values');
	});

	// Successful sign-in/sign-up
	app.get('/success', (req, res) => {
		if (!req.cookies.user) res.redirect('/signin');
		res.sendFile(path.join(__dirname, '../templates/signedin.html'));
	});

	// Chats
	// The page of the chats
	app.get(/\/chat\/.*/, (req, res) => {
		const args = req.path.split("/");
		if (!req.cookies.user) return res.redirect('/signin');
		DBH.getChats().then(sockets => {
			if (!sockets.find(socket => socket === args[2])) {
				res.send(JSON.stringify({code: 404, data: 'Not found'}));
			}
			else res.sendFile(path.join(__dirname, '../templates/chat.html'));
		}).catch(err => console.log(err));
	});
	// To fetch the messages of the specific chat
	app.post('/fetch-messages', (req, res) => DBH.fetchMessages(req.body.chat).then(messages => res.send(JSON.stringify(messages))).catch(err => console.log(err)));
};

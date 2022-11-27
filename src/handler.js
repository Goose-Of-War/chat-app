// Handler. Nothing here yet
const path  = require('path');

const DBH = require('../database/database_handler');

module.exports = function handler (app) {
	async function get (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case '': {
				res.sendFile(path.join(__dirname, '../templates/index.html'));
				break;
			}
			case 'chat': {
				if (!req.cookies.user) return res.redirect('/signin');
				try {
					const sockets = await DBH.getChats();
					if (!sockets.find(socket => socket === args[2])) {
						return res.send("Chat not found ;-;");;
					}
					return res.sendFile(path.join(__dirname, '../templates/chat.html'));
				}
				catch (err) {
					console.log(err);
					res.send(";-;");
				}
				break;
			}
			case 'signup': {
				if (req.cookies.user) res.redirect('/success');
				res.sendFile(path.join(__dirname, '../templates/signup.html'));
				break;
			}
			case 'signin': {
				if (req.cookies.user) res.redirect('/success');
				res.sendFile(path.join(__dirname, '../templates/signin.html'));
				break;
			}
			case 'success': {
				res.sendFile(path.join(__dirname, '../templates/signedin.html'));
				break;
			}
			default: {
				res.send('[-_-]!');
			}
		};
	};

	async function post (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case 'fetch-messages': {
				console.log(req.body.socket);
				try {
					const messages = await DBH.fetchMessages(req.body.socket);
					res.send(JSON.stringify(messages));
					break;
				}
				catch (err) { 
					console.log(err); 
					return res.send("Uh...");
				}
				break;
			}
			case 'send-message': {
				const { socket, message } = req.body;
				try {
					const sockets = await DBH.getChats();
					if (!sockets.find(chat => socket === chat)) {
						return res.send("Chat not found ;-;");;
					}
					try {
						console.log("A");
						DBH.saveMessage({
							chat: socket,
							user: req.cookies.name,
							message
						}); 
					}
					catch (err) {
						console.log(err);
					}
				}
				catch (err) {
					console.log(err);
					res.send(";-;");
				}
				break;
			}
			case 'signup': {
				const user = { username, displayName, emailAddress, password } = req.body;
				if (Tools.checkUserInfo(user)) {
					try {
						await DBH.addNewUser(user);
						res.cookie('user', username);
						res.cookie('name', displayName ?? 'Anonymous');
						res.redirect("/success");
					}
					catch (err) {
						console.log(err);
					}
				}
				break;
			}
			case 'signin': {
				const { username, password } = req.body;
				try {
					const user = await DBH.getUser({
						username,
						password: Tools.encodePassword(password)
					});
					if (user) {
						res.cookie('user', username);
						res.cookie('name', user.displayName ?? 'Anonymous');
						res.redirect("/success");
					}
				}
				catch (err) {
					console.log(err);
				}
				break;
			}
			default: {
				res.send(";-;");
			}
		};
	};

	app.get(/.*/, get);
	app.post(/.*/, post);
};

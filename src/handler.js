// Handler. Nothing here yet
const path  = require('path');

const DBH = require('../database/database_handler');

module.exports = function handler (app) {
	function get (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case '': {
				res.sendFile(path.join(__dirname, '../templates/index.html'));
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
				res.send(';-;');
			}
		};
	};

	async function post (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case 'signup': {
				const user = { username, displayName, emailAddress, password } = req.body;
				if (Tools.checkUserInfo(user)) {
					try {
						await DBH.addNewUser(user);
						res.cookie('user', username);
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

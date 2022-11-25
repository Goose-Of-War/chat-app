// Handler. Nothing here yet
const path  = require('path');

const DBH = require('../database/database_handler');

module.exports = function handler (app) {
	function get (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case '': {
				res.sendFile('index.html');
				break;
			}
			case 'signup': {
				res.sendFile(path.join(__dirname, '../templates/signup.html'));
				break;
			}
			case 'signin': {
				res.sendFile(path.join(__dirname, '../templates/signin.html'));
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
						console.log("Success")
					}
					catch (err) {
						console.log(err)
					}
				}
				else res.send("<html><body>Something's wrong</body></html>");
				break;
			}
			case 'signin': {
				const { username, password } = req.body;
				const user = await DBH.getUser({
					username,
					password: Tools.encodePassword(password)
				});
				user ? console.log("User Found") : console.log("Credentials don't match records")
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

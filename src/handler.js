// Handler. Nothing here yet
const path  = require('path');

const DBH = require('../database/database_handler');

module.exports = function handler (app) {
	function get (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case '' : {
				res.sendFile(path.join(__dirname, '../templates/index.html'));
				break;
			}
			case 'signup': {
				res.sendFile(path.join(__dirname, '../templates/signup.html'));
				break;
			}
			default : {
				res.send('');
			}
		};
	};

	function post (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case 'signup' : {
				console.log(req.body);
				const user = { username, displayName, emailAddress, password } = req.body;
				// need to add validator
				DBH.addNewUser(user)
				break;
			}
		};
	};

	app.get(/.*/, get);
	app.post(/.*/, post);
};

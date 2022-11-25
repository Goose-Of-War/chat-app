// Handler. Nothing here yet
const path  = require('path');

const DBH = require('../database/database_handler');

module.exports = function handler (app) {
	function get (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case '' : {
				res.sendFile('index.html');
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

	async function post (req, res) {
		const args = req.path.split("/");
		switch (args[1]) {
			case 'signup' : {
				const user = { username, displayName, emailAddress, password } = req.body;
				if (Tools.checkUserInfo(user)) {
					try {
						await DBH.addNewUser(user); 
						res.send("<html><body>Success</body></html>");
					}
					catch (err) {
						console.log(err)
						res.send("<html><body>Something's wrong</body></html>");
					}
				}
				else res.send("<html><body>Something's wrong</body></html>");
				break;
			}
		};
	};

	app.get(/.*/, get);
	app.post(/.*/, post);
};

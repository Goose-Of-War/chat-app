// Handler. Nothing here yet
const path  = require('path');

const DBH = require('../database/database_handler');

module.exports = function handler (app) {
	// Middlewares
	app.use(/.*/, (req, res, next) => {
		// The app will now check for signed in or not
		res.signedIn = Boolean(req.cookies.user);

		res.renderFile = function (filePath, ctx = {}) {
			ctx.signedIn = res.signedIn;
			res.render(path.join(__dirname, '../templates', filePath), ctx);
		}
		next();
	});


	// plain redirect ;-;
	app.get('/', (req, res) => res.renderFile('_base.njk'));

	// Auth

	// Sign-in
	app.get('/signin', (req, res) => {
		if (req.cookies.user) return res.redirect('/success');
		res.renderFile('signin.njk');
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
				res.send("success");
			}
		}).catch(err => console.log(err));
	});

	// Sign-up
	app.get('/signup', (req, res) => {
		if (req.cookies.user) res.redirect('/success');
		res.renderFile('signup.njk');
	});

	app.post('/signup', (req, res) => {
		const user = { username, displayName, emailAddress, password } = req.body;
		if (Tools.checkUserInfo(user)) {
			DBH.addNewUser(user).then(output => {
				res.cookie('user', username);
				res.cookie('name', displayName ?? 'Anonymous');
				return res.redirect("/success");
			}).catch(err => console.log(err));
		} else res.send('Invalid values');
	});

	// Successful sign-in/sign-up
	app.get('/success', (req, res) => {
		if (!req.cookies.user) return res.redirect('/signin');
		res.renderFile('signedin.njk');
	});

	app.get('/signout', (req, res) => {
		res.clearCookie('user');
		res.clearCookie('name');
		res.redirect('/');
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
			else res.renderFile('_chat.njk', {
				pagetitle: `Chat ${args[2]}`
			});
		}).catch(err => console.log(err));
	});
	// To fetch the messages of the specific chat on first connection
	app.post('/fetch-messages', (req, res) => DBH.fetchMessages(req.body.chat).then(messages => res.send(JSON.stringify(messages))).catch(err => console.log(err)));
	// To save a new message
	app.post('/send-message', (req, res) => {
		const msg = req.body;
		msg.user = req.cookies.name;
		DBH.saveMessage(msg).then(fin => res.send(JSON.stringify({ user: msg.user }))).catch(err => console.log(err));
	})
};

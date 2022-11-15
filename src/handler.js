// Handler. Nothing here yet

module.exports = function handler (app) {
	function get (req, res) {
		res.send("Hello");
	}

	function post () {
		res.send("Bye");
	}

	app.get(/.*/, get);
	app.post(/.*/, post);
};

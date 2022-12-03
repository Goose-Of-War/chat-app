const axios = require('axios');
const socketIO = require('socket.io');

const io = socketIO(honkServer);

io.sockets.on('connection', socket => {
	console.log("Connected");
	socket.on('join', data => {
		// data = { user, room }
		socket.user = data.user;
		socket.room = data.room;
		socket.join(socket.room);
		socket.broadcast.to(socket.room).emit('userJoin', { user: socket.user });
	});

	socket.on('sendMessage', data => {
		// data = { user, message }
		data.chat = socket.room;
		data.time = new Date();
		axios.post('/send-messages', data).then(res => {
			io.sockets.in(socket.room).emit('userMessage', data);
		}).catch(err => {
			console.log(err);
			socket.broadcast('errorMessage', 'Your message wasn\'t sent.');
		});
	})
});
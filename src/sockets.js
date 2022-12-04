const socketIO = require('socket.io');

exports.init = () => {
	const io = socketIO(honkServer);

	io.sockets.on('connection', socket => {
		socket.on('join', data => {
			// data = { user, room }
			socket.user = data.user;
			socket.room = data.room;
			socket.join(socket.room);
			socket.broadcast.to(socket.room).emit('userJoin', { user: socket.user });
		});

		socket.on('sendMessage', data => socket.emit('userMessage', data));
	});
}
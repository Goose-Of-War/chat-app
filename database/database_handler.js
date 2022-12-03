const mongoose = require('mongoose');

const User = require('./schemas/User');
const Information = require('./schemas/Information');
const ChatMessageSchema = require('./schemas/ChatMessage');

async function getUser (cred) {
	return (await User.findOne(cred));
}

async function addNewUser (_user) {
	// user = { displayName, username, password, emailAddress }
	if (!_user) throw new Error("No blank users accepted");
	let user = await getUser({ username: _user.username });
	if (user) {
		console.log(user);
		throw new Error("Username already exists");
	}
	user = User(_user);
	user.password = Tools.encodePassword(user.password);
	return user.save();
}

async function getChats () {
	const info = await Information.findOne();
	if (info) return info.chatSockets;
	throw new Error('No Sockets Found');
}

async function saveMessage (msg) {
	// msg = { chat, user, message, time }
	const chats = await getChats();
	if (!chats.find(socket => socket === msg.chat)) throw new Error("Socket doesn't exist ;-;");
	ChatMessageSchema.set('collection', 'chat-' + msg.chat);
	const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
	const message = ChatMessage({
		user: msg.user,
		message: msg.message,
		time
	});
	console.log("Saving");
	return message.save()
}

async function fetchMessages (socket) {
	const chats = await getChats();
	if (!chats.find(chat => chat === socket)) throw new Error("Socket doesn't exist ;-;");
	ChatMessageSchema.set('collection', 'chat-' + socket);
	const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
	return ChatMessage.find();
}

module.exports = { addNewUser, fetchMessages, getUser, getChats, saveMessage }
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
	let ChatMessage = mongoose.model(`ChatMessage-${msg.chat}`, ChatMessageSchema);
	const message = ChatMessage({
		user: msg.user,
		message: msg.message,
		time: msg.time
	});
	await message.save();
	delete mongoose.models[`ChatMessage-${msg.chat}`];
	return message;
}

async function fetchMessages (socket) {
	const chats = await getChats();
	if (!chats.find(chat => chat === socket)) throw new Error("Socket doesn't exist ;-;");
	ChatMessageSchema.set('collection', 'chat-' + socket);
	let ChatMessage = mongoose.model(`ChatMessage-'${socket}`, ChatMessageSchema);
	const messages = await ChatMessage.find();
	delete mongoose.models[`ChatMessage-${socket}`];
	return messages;
}

module.exports = { addNewUser, fetchMessages, getUser, getChats, saveMessage }
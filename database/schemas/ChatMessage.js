const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
	chat: { type: String, required: true },
	message: { type: String, reuired: true },
	time: { type: String, default: new Date() }
});

module.exports = ChatMessageSchema;
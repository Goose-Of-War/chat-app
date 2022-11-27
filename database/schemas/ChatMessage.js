const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
	user: { type: String, required: true },
	message: { type: String, required: true },
	time: { type: String, default: new Date() }
});

module.exports = ChatMessageSchema;
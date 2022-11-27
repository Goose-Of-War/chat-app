const mongoose = require('mongoose');

const InformationSchema = new mongoose.Schema({
	admins: { type: [String], required: true },
	chatSockets: { type: [String], required: true }
});

InformationSchema.set('collection', 'configInfo');

module.exports = mongoose.model('Information', InformationSchema);
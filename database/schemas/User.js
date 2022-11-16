const mongooose = require('mongoose');

const UserSchema = new mongooose.Schema({
	displayName: String,
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	emailAddress: { type: String, required: true }
});

UserSchema.set('collection', 'userCredentials');

module.exports = mongooose.model('User', UserSchema);

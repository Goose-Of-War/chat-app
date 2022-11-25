const { encoding } = require('./serverinfo.json');

// RegEx which might be reused
global.emailRegex = /^[0-9a-zA-z\.-_]{2,}\@[a-z\.]{3,}\.[a-z]{2,3}/g;
global.usernameRegex = /^[0-9a-zA-z\._-]{4,32}$/g;
global.passwordRegex = /^[0-9a-zA-z!@#$%^&*()\.-_,'"\[\]\\\{\}\/]{8,32}$/g
// Approved characters: English alphabet, digits, Shift 0-9 symbols, 
// all types of brackets, full stop, comma, quotation marks, slashes

// Checks if the new user info is valid
function checkUserInfo (userinfo) {
	// userinfo = { username, password, emailAddress }
	return [
		emailRegex.test(userinfo.emailAddress),
		usernameRegex.test(userinfo.username),
		passwordRegex.test(userinfo.password)
	].every(elm => elm)
}

// Password encoder tools

function caesarCipher (str, shift, encode = true) {
	// encode is false if it is to be used for decoding purposes
	return str.split("").map(char => {
		
		if (/^[a-z]$/.test(char)) return String.fromCharCode(
			(char.charCodeAt(0) - 'a'.charCodeAt(0) + shift * (encode ? 1 : -1) + 26) % 26 + 'a'.charCodeAt(0)
			);
		else if (/^[A-Z]$/.test(char)) return String.fromCharCode(
			(char.charCodeAt(0) - 'A'.charCodeAt(0) + shift * (encode ? 1 : -1) + 26) % 26 + 'A'.charCodeAt(0)
			);
		else if (/^[0-9]$/.test(char)) return (~~char + shift * (encode ? 1 : -1) + 30) % 10 + "";
		else return char;
	}).join("");
}

function vigenereCipher (str, key, encode = true) {
	let i = 0;
	return str.split("").map(char => {
		shift = key.toLowerCase().charCodeAt(i++ % key.length) - 'a'.charCodeAt(0);
		if (/^[a-z]$/.test(char)) return String.fromCharCode(
			(char.charCodeAt(0) - 'a'.charCodeAt(0) + shift * (encode ? 1 : -1) + 26) % 26 + 'a'.charCodeAt(0)
			);
		else if (/^[A-Z]$/.test(char)) return String.fromCharCode(
			(char.charCodeAt(0) - 'A'.charCodeAt(0) + shift * (encode ? 1 : -1) + 26) % 26 + 'A'.charCodeAt(0)
			);
		else {
			i--;
			return char;
		}
	}).join("");
}

function encodePassword (password) {
	let [shift, key] = encoding.split('-');
	return caesarCipher(vigenereCipher(password, key), shift);
}

module.exports = {
	checkUserInfo,
	encodePassword,
	caesarCipher,
	vigenereCipher
}
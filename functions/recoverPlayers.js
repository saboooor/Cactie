const fs = require('fs');
module.exports = function recoverPlayers(client) {
	const data = fs.readFileSync('playercache.txt');
	console.log(data);
	fs.writeFileSync('playercache.txt', '');
};
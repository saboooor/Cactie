const nodeactyl = require('nodeactyl');
const srv = require('../config/pterodactyl.json')['nether depths bungee'];
const WebSocket = require('ws');
module.exports = async client => {
	return;
	const Client = new nodeactyl.NodeactylClient(srv.url, srv.apikey);
	const socket = await Client.getConsoleWebSocket(srv.id);
	const ws = new WebSocket(socket.socket, {
		origin: 'https://panel.birdflop.com',
		headers : {
			Authorization: 'Bearer ' + socket.token,
		},
	});
	ws.on('message', message => {
		console.log(message);
	});
};
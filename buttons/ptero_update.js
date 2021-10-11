const { NodeactylClient } = require('nodeactyl');
const pteroUpdate = require('../functions/pteroUpdate.js');
const servers = require('../config/pterodactyl.json');
module.exports = {
	name: 'ptero_update',
	async execute(interaction) {
		const srvs = Object.keys(servers).map(i => { return servers[i]; });
		const server = srvs.find(srv => interaction.message.embeds[0].url.split('server/')[1] == srv.id);
		const Client = new NodeactylClient(server.url, server.apikey);
		pteroUpdate(interaction, Client);
	},
};
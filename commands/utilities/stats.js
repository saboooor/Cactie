const nodeactyl = require('nodeactyl');
const { apikey, apikey2 } = require('../../config/pterodactyl.json');
const url = 'https://panel.birdflop.com/';
const Client = new nodeactyl.NodeactylClient(url, apikey);
module.exports = {
	name: 'stats',
	description: 'Get the status of Pup or a Minecraft Server',
	aliases: ['status', 'mcstatus', 'mcstats'],
	usage: '[Server]',
	options: [{
		type: 3,
		name: 'server',
		description: 'Specify a Minecraft server',
	}],
	async execute(message, args, client) {
		const info = await Client.getServerDetails('50dc31e4');
		console.log(info);
	},
};
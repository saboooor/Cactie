const { NodeactylClient } = require('nodeactyl');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'proxy',
	description: 'Sends a command to Nether Depths Proxy',
	aliases: ['b'],
	args: true,
	usage: '<Command>',
	async execute(message, args, client) {
		try {
			// Get proxy server and send command there (this will be dynamic later cuz aethersmp)
			const server = servers['nether depths proxy'];
			const Client = new NodeactylClient(server.url, server.apikey);
			if (!client.guilds.cache.get(server.guildid).members.cache.get(message.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
			Client.sendServerCommand(server.id, args.join(' '));
			message.reply({ content: `Sent command \`${args.join(' ')}\` to Proxy` });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};
const nodeactyl = require('nodeactyl');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'stop',
	description: 'Stop pup or a server',
	async execute(message, args, client) {
		const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name}`; });
		if (!args[0]) {
			args = [];
			serverlist.forEach(i => {
				i = i.replace('\n', '').toLowerCase();
				if (servers[i].guildid == message.guild.id) args.push(servers[i].name);
			});
			if (args[1]) args = ['dumb'];
			if (!args[0]) args = ['pup'];
		}
		const server = servers[args.join(' ').toLowerCase()];
		if (!server) return message.reply(`**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\``);
		if (!client.guilds.cache.get(server.guildid).members.cache.get(message.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		if (server.client) client.user.setPresence({ activity: { name: 'Stopping', type: 'PLAYING' } });
		const info = await Client.getServerDetails(server.id);
		Client.stopServer(server.id);
		client.logger.info(`Stopping ${info.name}`);
		await message.channel.send({ content: `Stopping ${info.name}` });
		if (server.client) Client.killServer(server.id);
	},
};

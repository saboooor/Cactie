const nodeactyl = require('nodeactyl');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'start',
	description: 'Start a server',
	async execute(message, args, client) {
		const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name}`; });
		if (!args[0]) {
			args = [];
			serverlist.forEach(i => {
				i = i.replace('\n', '').toLowerCase();
				if (servers[i].guildid == message.guild.id) args.push(servers[i].name);
			});
			if (!args[0] || args[1]) args = ['dumb'];
		}
		const server = servers[args.join(' ').toLowerCase()];
		if (!server) return message.reply(`**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\``);
		if (!client.guilds.cache.get(server.guildid).members.cache.get(message.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		const info = await Client.getServerDetails(server.id);
		Client.startServer(server.id);
		client.logger.info(`Starting ${info.name}`);
		await message.channel.send({ content: `Starting ${info.name}` });
	},
};

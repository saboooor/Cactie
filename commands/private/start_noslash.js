const nodeactyl = require('nodeactyl');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'start',
	description: 'Start a server',
	async execute(message, args, client) {
		const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name} (${servers[i].short})`; });
		if (!args[0]) {
			args = [];
			serverlist.forEach(i => {
				i = i.replace('\n', '').split(' (')[0].toLowerCase();
				if (servers[i].guildid == message.guild.id) args.push(servers[i].name);
			});
			if (!args[0] || args[1]) args = ['dumb'];
		}
		const srvs = [];
		Object.keys(servers).map(i => { srvs.push(servers[i]); });
		let server = servers[args.join(' ').toLowerCase()];
		if (!server) server = srvs.find(srv => args[0].toLowerCase() == srv.short);
		if (!server) return message.reply(`**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\``);
		if (!client.guilds.cache.get(server.guildid).members.cache.get(message.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		const info = await Client.getServerDetails(server.id);
		Client.startServer(server.id);
		client.logger.info(`Starting ${info.name}`);
		await message.channel.send({ content: `Starting ${info.name}` });
	},
};

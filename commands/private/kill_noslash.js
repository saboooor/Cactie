const nodeactyl = require('nodeactyl');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'kill',
	description: 'Kill pup or a server',
	async execute(message, args, client) {
		const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name} (${servers[i].short})`; });
		if (!args[0]) {
			args = [];
			serverlist.forEach(i => {
				i = i.replace('\n', '').split(' (')[0].toLowerCase();
				if (servers[i].guildid == message.guild.id) args.push(servers[i].name);
			});
			if (args[1]) args = ['dumb'];
			if (!args[0]) args = ['pup'];
		}
		const srvs = [];
		Object.keys(servers).map(i => { srvs.push(servers[i]); });
		let server = servers[args.join(' ').toLowerCase()];
		if (!server) server = srvs.find(srv => args[0].toLowerCase() == srv.short);
		if (!server) return message.reply(`**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\``);
		if (!client.guilds.cache.get(server.guildid).members.cache.get(message.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		if (server.client) client.user.setPresence({ activity: { name: 'Getting Killed', type: 'PLAYING' } });
		const info = await Client.getServerDetails(server.id);
		client.logger.info(`Killing ${info.name}`);
		await message.channel.send({ content: `Killing ${info.name}` });
		Client.killServer(server.id);
	},
};

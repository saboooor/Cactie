const servers = require('../config/pterodactyl.json');
module.exports = {
	name: 'whatip',
	triggers: ['what'],
	additionaltriggers: ['ip'],
	private: true,
	execute(message) {
		const serverlist = Object.keys(servers).map(i => { return servers[i].name.toLowerCase(); }), srvs = [];
		serverlist.forEach(i => { if (servers[i] && servers[i].guildid == message.guild.id) srvs.push(servers[i].ip); });
		if (srvs[0]) message.channel.send({ content: srvs[0] });
	},
};
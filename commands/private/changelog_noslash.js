const { MessageEmbed } = require('discord.js');
const pteroconfig = require('../../config/pterodactyl.json');
module.exports = {
	name: 'changelog',
	aliases: ['cl'],
	args: true,
	usage: '<Server> <Changes (split with new line)>',
	async execute(message, args, client) {
		const changes = args.join(' ').replace(args[0] + ' ', '').split('\n');
		const servers = [];
		Object.keys(pteroconfig).map(i => { if (pteroconfig[i].changelogs) servers.push(pteroconfig[i]); });
		const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].short} (${servers[i].name})`; });
		const server = servers.find(srv => args[0].toLowerCase() == srv.short);
		const Embed = new MessageEmbed()
			.setAuthor('Changelog', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/scroll_1f4dc.png')
			.setFooter(`By ${message.author.username}`, message.author.avatarURL({ dynamic : true }));
		if (!server) return message.reply(`**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\``);
		if (!client.guilds.cache.get(server.guildid).members.cache.get(message.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
		server.clconsolechannels.forEach(channelid => {
			changes.forEach(change => {
				client.channels.cache.get(channelid).send(`${server.clcommand}${change}`);
			});
		});
		server.clmainchannels.forEach(channelid => {
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get(channelid).send({ embeds: [Embed] });
			});
		});
		message.reply(`${changes.length} Changelog(s) sent to ${server.name}!`);
	},
};
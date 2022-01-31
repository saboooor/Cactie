const { MessageEmbed } = require('discord.js');
const pteroconfig = require('../../config/pterodactyl.json');
module.exports = {
	name: 'changelog',
	description: 'Sends a changelog and broadcasts it to console/changelog channels',
	aliases: ['cl'],
	args: true,
	usage: '<Server> <Changes (split with new line)>',
	async execute(message, args, client) {
		try {
			const changes = args.join(' ').replace(args[0] + ' ', '').split('\n');
			const servers = [];
			Object.keys(pteroconfig).map(i => { if (pteroconfig[i].changelogs) servers.push(pteroconfig[i]); });
			const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].short} (${servers[i].name})`; });
			const server = servers.find(srv => args[0].toLowerCase() == srv.short);
			const Embed = new MessageEmbed()
				.setAuthor({ name: 'Changelog', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/scroll_1f4dc.png' })
				.setFooter({ text: `By ${message.author.username}`, iconURL: message.author.avatarURL({ dynamic : true }) });
			if (!server) return message.reply({ content: `**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\`` });
			const guild = client.guilds.cache.get(server.guildid);
			if (!guild.members.cache.get(message.member.id) || !guild.members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
			server.changelogs.consolechannels.forEach(channelid => {
				changes.forEach(change => {
					guild.channels.cache.get(channelid).send({ content: `${server.changelogs.consolecmd}${change}` });
				});
			});
			server.changelogs.mainchannels.forEach(channelid => {
				changes.forEach(change => {
					Embed.setColor(Math.floor(Math.random() * 16777215));
					Embed.setDescription(change);
					guild.channels.cache.get(channelid).send({ embeds: [Embed] });
				});
			});
			message.reply({ content: `${changes.length} Changelog(s) sent to ${server.name}!` });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};
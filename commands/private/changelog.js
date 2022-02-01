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
			// Get the changelogs and split them by new-lines
			const changes = args.join(' ').replace(args[0] + ' ', '').split('\n');

			// Push the servers cuz object to array yk
			const servers = [];
			Object.keys(pteroconfig).map(i => { if (pteroconfig[i].changelogs) servers.push(pteroconfig[i]); });

			// Make changelog embed
			const Embed = new MessageEmbed()
				.setAuthor({ name: 'Changelog', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/scroll_1f4dc.png' })
				.setFooter({ text: `By ${message.author.username}`, iconURL: message.author.avatarURL({ dynamic : true }) });
			
			// Get the server from the first arg
			const server = servers.find(srv => args[0].toLowerCase() == srv.short);

			// Create list of valid servers and send the list if the server above is invalid
			const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].short} (${servers[i].name})`; });
			if (!server) return message.reply({ content: `**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\`` });

			// Get defined server's guild and check if user has perms there
			const guild = client.guilds.cache.get(server.guildid);
			if (!guild.members.cache.get(message.member.id) || !guild.members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });

			// Send changelog commands to the console channels
			server.changelogs.consolechannels.forEach(channelid => {
				changes.forEach(change => {
					guild.channels.cache.get(channelid).send({ content: `${server.changelogs.consolecmd}${change}` });
				});
			});
			
			// Send changelog embeds to the main channels and reply with response
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
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const YAML = require('yaml');
const { servers } = YAML.parse(fs.readFileSync('./pterodactyl.yml', 'utf8'));
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

			// Make changelog embed
			const CLEmbed = new EmbedBuilder()
				.setAuthor({ name: 'Changelog', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/scroll_1f4dc.png' })
				.setFooter({ text: `By ${message.author.username}`, iconURL: message.author.avatarURL() });

			// Get the server from the first arg
			const server = servers.find(srv => args[0].toLowerCase() == srv.short && srv.changelogs);

			// Create list of valid servers and send the list if the server above is invalid
			const serverlist = servers.map(s => { if (s.changelogs) return `\n${s.short} (${s.name})`; });
			if (!server) return client.error(`Invalid Server!\nPlease use an option from the list below:\n${serverlist.join('')}`, message, true);

			// Get defined server's guild and check if user has perms there
			const guild = client.guilds.cache.get(server.guildid);
			if (!guild.members.cache.get(message.member.id) || !guild.members.cache.get(message.member.id).roles.cache.has(server.roleid)) return client.error('You can\'t do that!', message, true);

			// Send changelog commands to the console channels
			server.changelogs.console.forEach(channelid => {
				changes.forEach(change => {
					guild.channels.cache.get(channelid).send({ content: `${server.changelogs.cmd}${change}` });
				});
			});

			// Send changelog embeds to the main channels and reply with response
			server.changelogs.main.forEach(channelid => {
				changes.forEach(change => {
					CLEmbed.setColor(Math.floor(Math.random() * 16777215))
						.setDescription(change);
					guild.channels.cache.get(channelid).send({ embeds: [CLEmbed] });
				});
			});
			message.reply({ content: `${changes.length} Changelog(s) sent to ${server.name}!` });
		}
		catch (err) { client.error(err, message); }
	},
};
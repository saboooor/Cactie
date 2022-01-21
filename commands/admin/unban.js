const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'unban',
	description: 'Unban someone that was banned from the server',
	ephemeral: true,
	args: true,
	usage: '<User>',
	permissions: 'BAN_MEMBERS',
	botperm: 'BAN_MEMBERS',
	cooldown: 5,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		// Get user from arg and check if user is valid
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });

		// Send unban message to user
		await user.send({ content: `**You've been unbanned in ${message.guild.name}**` })
			.catch(e => {
				client.logger.warn(e);
				message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been unbanned.' });
			});

		// Actually unban the dude
		message.guild.members.unban(user.id);

		// Create embed with color and title
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`Unbanned ${user.tag}`);

		// Reply with unban log
		message.reply({ embeds: [Embed] });
		client.logger.info(`Unbanned user: ${user.tag} in ${message.guild.name}`);

		// Check if log channel exists and send message
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
		if (logchannel) {
			Embed.setTitle(`${message.member.user.tag} ${Embed.title}`);
			logchannel.send({ embeds: [Embed] });
		}
	},
};
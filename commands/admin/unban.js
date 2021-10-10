const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'unban',
	description: 'Unban someone that was banned from the server',
	args: true,
	usage: '<User>',
	permissions: 'BAN_MEMBERS',
	cooldown: 5,
	guildOnly: true,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`Unbanned ${user.tag}`);
		await user.send({ content: `**You've been unbanned in ${message.guild.name}` })
			.catch(e => {
				client.logger.warn(e);
				message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been unbanned.' });
			});
		message.reply({ embeds: [Embed], ephemeral: true });
		message.guild.members.unban(args[0]);
		client.logger.info(`Unbanned user: ${user.tag} in ${message.guild.name}`);
	},
};
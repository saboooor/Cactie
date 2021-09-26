const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'unban',
	description: 'Unban someone that was banned from the guild',
	args: true,
	usage: '<User>',
	permissions: 'BAN_MEMBERS',
	cooldown: 5,
	guildOnly: true,
	options: [{
		type: 3,
		name: 'user',
		description: 'User to unban',
		required: true,
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`Unbanned ${user.tag}`);
		await user.send({ content: `**You've been unbanned in ${message.guild.name}` })
			.catch(e => {
				client.logger.error(e);
				message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been unbanned.' });
			});
		message.reply({ embeds: [Embed], ephemeral: true });
		message.guild.members.unban(args[0]);
		client.logger.info(`Unbanned user: ${user.tag} in ${message.guild.name}`);
	},
};
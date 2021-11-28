const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'unmute',
	description: 'Unmute someone that was muted in the server',
	ephemeral: true,
	args: true,
	usage: '<User>',
	permissions: 'MANAGE_MESSAGES',
	botperms: 'MANAGE_ROLES',
	cooldown: 5,
	guildOnly: true,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		// Get settings and check if mutecmd is enabled
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const role = await message.guild.roles.cache.get(srvconfig.mutecmd);
		if (!role) return message.reply('This command is disabled!');

		// Get user and check if user is valid
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });

		// Get member and role and check if member doesn't have the role
		const member = message.guild.members.cache.get(user.id);
		if (!member.roles.cache.has(role.id)) return message.reply({ content: 'This user is not muted!' });

		// Reset the mute timer
		await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', 0);

		// Send unmute message to user
		await user.send({ content: '**You\'ve been unmuted**' })
			.catch(e => {
				client.logger.warn(e);
				message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been unmuted.' });
			});

		// Actually get rid of the mute role
		await member.roles.remove(role);

		// Create embed with color and title
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`Unmuted ${user.tag}`);

		// Reply with unban log
		message.reply({ embeds: [Embed] });
		client.logger.info(`Unmuted ${user.tag} in ${message.guild.name}`);

		// Check if log channel exists and send message
		const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
		if (logchannel) {
			Embed.setTitle(`${message.member.user.tag} ${Embed.title}`);
			logchannel.send({ embeds: [Embed] });
		}
	},
};
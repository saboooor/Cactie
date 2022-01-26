const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'unmute',
	description: 'Unmute someone that was muted in the server',
	ephemeral: true,
	args: true,
	usage: '<User>',
	permission: 'MANAGE_MESSAGES',
	botperm: 'MANAGE_ROLES',
	cooldown: 5,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		// Get settings and check if mutecmd is enabled
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const role = await message.guild.roles.cache.get(srvconfig.mutecmd);
		if (!role && srvconfig.mutecmd != 'timeout') return message.reply('This command is disabled!');

		// Get user and check if user is valid
		const user = client.users.cache.get(args[0].replace(/\D/g, ''));
		if (!user) return message.reply({ content: 'Invalid User!' });

		// Get member and author and check if role is lower than member's role
		const member = message.guild.members.cache.get(user.id);
		const author = message.member;
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });

		// Check if user is unmuted
		if (role && !member.roles.cache.has(role.id)) return message.reply({ content: 'This user is not muted!' });

		// Reset the mute timer
		if (role) await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', 0);

		// Send unmute message to user
		await user.send({ content: '**You\'ve been unmuted**' })
			.catch(e => {
				client.logger.warn(e);
				message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been unmuted.' });
			});

		// Actually get rid of the mute role or untimeout
		if (role) await member.roles.remove(role);
		else await member.timeout(0);

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
const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'Kick someone from the server',
	ephemeral: true,
	args: true,
	usage: '<User> [Reason]',
	permission: 'KickMembers',
	botperm: 'KickMembers',
	cooldown: 5,
	options: require('../options/kick.json'),
	async execute(message, args, client) {
		try {
			// Get user and check if user is valid
			const member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return client.error(message.lang.invalidmember, message, true);

			// Get member and author and check if role is lower than member's role
			const author = message.member;
			if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) return client.error(`You can't do that! Your role is ${member.roles.highest.rawPosition - author.roles.highest.rawPosition} lower than the user's role!`, message, true);

			// Create embed
			const KickEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Kicked ${member.user.tag}.`);

			// Add reason if specified
			if (args[1]) KickEmbed.addFields({ name: 'Reason', value: args.slice(1).join(' ') });

			// Send kick message to target
			await member.send({ content: `**You've been kicked from ${message.guild.name}.${args[1] ? ` Reason: ${args.slice(1).join(' ')}` : ''}**` })
				.catch(err => {
					client.logger.warn(err);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});

			// Reply with response
			await message.reply({ embeds: [KickEmbed] });

			// Actually kick the dude
			await member.kick({ reason: `Kicked by ${message.member.user.tag} for ${args.slice(1).join(' ')}` });
			client.logger.info(`Kicked user: ${member.user.tag} from ${message.guild.name}`);

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				KickEmbed.setTitle(`${message.member.user.tag} ${KickEmbed.toJSON().title}`);
				logchannel.send({ embeds: [KickEmbed] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};
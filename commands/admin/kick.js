const { Embed } = require('discord.js');
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
			const user = member.user;
			if (!user) return message.reply({ content: 'Invalid User! Are they in this server?' });

			// Get member and author and check if role is lower than member's role
			const author = message.member;
			if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) return message.reply({ content: `You can't do that! Your role is ${member.roles.highest.rawPosition - author.roles.highest.rawPosition} lower than the user's role!` });

			// Create embed
			const KickEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Kicked ${user.tag}.`);

			// Add reason if specified
			if (args[2]) KickEmbed.addFields({ name: 'Reason', value: args.slice(2).join(' ') });

			// Send kick message to target
			await user.send({ content: `**You've been kicked from ${message.guild.name}.${args[2] ? ` Reason: ${args.slice(2).join(' ')}` : ''}**` })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});

			// Reply with response
			message.reply({ embeds: [KickEmbed] });

			// Actually kick the dude
			await member.kick({ reason: `Kicked by ${message.member.user.tag} for ${args.slice(1).join(' ')}` });
			client.logger.info(`Kicked user: ${user.tag} from ${message.guild.name}`);

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				KickEmbed.setTitle(`${message.member.user.tag} ${KickEmbed.title}`);
				logchannel.send({ embeds: [KickEmbed] });
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};
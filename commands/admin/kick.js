const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'Kick someone from the server',
	ephemeral: true,
	args: true,
	usage: '<User> [Reason]',
	permission: 'KICK_MEMBERS',
	botperm: 'KICK_MEMBERS',
	cooldown: 5,
	options: require('../options/kick.json'),
	async execute(message, args, client) {
		try {
			// Get user and check if user is valid
			const member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return message.reply({ content: 'Invalid User! Are they in this server?' });
			const user = member.user;
			if (user == client.user) return message.reply({ content: 'I can\'t kick myself!' });

			// Get member and author and check if role is lower than member's role
			const author = message.member;
			if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });

			// Create embed
			const Embed = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTitle(`Kicked ${user.tag}.`);

			// Add reason if specified
			if (args[2]) Embed.addField('Reason', args.slice(2).join(' '));

			// Send kick message to target
			await user.send({ content: `**You've been kicked from ${message.guild.name}.${args[2] ? ` Reason: ${args.slice(2).join(' ')}` : ''}**` })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});

			// Reply with response
			message.reply({ embeds: [Embed] });

			// Actually kick the dude
			await member.kick({ reason: `Kicked by ${message.member.user.tag} for ${args.slice(1).join(' ')}` });
			client.logger.info(`Kicked user: ${user.tag} from ${message.guild.name}`);

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				Embed.setTitle(`${message.member.user.tag} ${Embed.title}`);
				logchannel.send({ embeds: [Embed] });
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};
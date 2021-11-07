const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'Kick someone from the server',
	args: true,
	usage: '<User> [Reason]',
	permissions: 'KICK_MEMBERS',
	cooldown: 5,
	guildOnly: true,
	options: require('../options/kick.json'),
	async execute(message, args, client) {
		// Get user and check if user is valid
		const member = message.guild.members.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		const user = member.user;
		if (!user) return message.reply({ content: 'Invalid User! Are they in this server?' });

		// Get member and author and check if role is lower than member's role
		const author = message.member;
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });

		// Create embed and check if kick has a reason
		const Embed = new MessageEmbed().setColor(Math.round(Math.random() * 16777215));
		if (args[1]) {
			// Kick with reason
			Embed.setTitle(`Kicked ${user.tag} for ${args.slice(1).join(' ')}`);

			// Send kick message to target
			await user.send({ content: `**You've been kicked from ${message.guild.name} for ${args.slice(1).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});
		}
		else {
			// Kick without reason
			Embed.setTitle(`Kicked ${user.tag}.`);

			// Send kick message to target
			await user.send({ content: `**You've been kicked from ${message.guild.name}.**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});
		}

		// Reply with response
		message.reply({ embeds: [Embed], ephemeral: true });

		// Actually kick the dude
		await member.kick({ reason: `Kicked by ${message.member.user.tag} for ${args.slice(1).join(' ')}` })
			.catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		client.logger.info({ content: `Kicked user: ${user.tag} from ${message.guild.name}` });
	},
};
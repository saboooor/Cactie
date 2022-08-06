const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'Kick someone from the server',
	ephemeral: true,
	args: true,
	usage: '<User @ or Id> [Reason]',
	permissions: ['KickMembers'],
	botPerms: ['KickMembers'],
	cooldown: 5,
	options: require('../../options/kick.js'),
	async execute(message, args, client, lang) {
		try {
			// Get user and check if user is valid
			let member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) member = await message.guild.members.fetch(args[0].replace(/\D/g, ''));
			if (!member) return client.error(lang.invalidmember, message, true);

			// Get member and author and check if role is lower than member's role
			const author = message.member;
			if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) return client.error(`You can't do that! Your role is ${member.roles.highest.rawPosition - author.roles.highest.rawPosition} lower than the user's role!`, message, true);

			// Create embed
			const KickEmbed = new EmbedBuilder()
				.setColor('Random')
				.setTitle(`Kicked ${member.user.tag}.`);

			// Add reason if specified
			if (args[1]) KickEmbed.addFields([{ name: 'Reason', value: args.slice(1).join(' ') }]);

			// Send kick message to target
			await member.send({ content: `**You've been kicked from ${message.guild.name}.${args[1] ? ` Reason: ${args.slice(1).join(' ')}` : ''}**` })
				.catch(err => {
					logger.warn(err);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});

			// Reply with response
			await message.reply({ embeds: [KickEmbed] });

			// Actually kick the dude
			await member.kick({ reason: `Kicked by ${message.member.user.tag} for ${args.slice(1).join(' ')}` });
			logger.info(`Kicked user: ${member.user.tag} from ${message.guild.name}`);

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
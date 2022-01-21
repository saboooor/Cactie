const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'mute',
	description: 'Mute someone in the server',
	ephemeral: true,
	args: true,
	usage: '<User> [Time and/or Reason]',
	permissions: 'MANAGE_MESSAGES',
	botperm: 'MANAGE_ROLES',
	cooldown: 5,
	options: require('../options/punish.json'),
	async execute(message, args, client) {
		// Get mute role and check if role is valid
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const role = await message.guild.roles.cache.get(srvconfig.mutecmd);
		if (!role && srvconfig.mutecmd != 'timeout') return message.reply('This command is disabled!');

		// Get user and check if user is valid
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User! Are they in this server?' });

		// Get member and author and check if role is lower than member's role
		const member = message.guild.members.cache.get(user.id);
		const author = message.member;
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });

		// Check if user is muted
		if (role && member.roles.cache.has(role.id)) return message.reply({ content: 'This user is already muted! Try unmuting instead.' });

		// Check if duration is set and if it's more than a year
		const time = ms(args[1] ? args[1] : 'perm');
		if (role && time > 31536000000) return message.reply({ content: 'You cannot mute someone for more than 1 year!' });
		else if (time > 2592000000) return message.reply({ content: 'You cannot mute someone for more than 30 days with the timeout feature turned on!' });

		// Create embed and check if duration / reason are set and do stuff
		const Embed = new MessageEmbed().setColor(Math.round(Math.random() * 16777215));
		if (!isNaN(time) && args[2]) {
			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}.`)
				.addField('Reason', args.slice(2).join(' '));

			// Send mute message to target
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);

			// Set member data for unmute time
			if (role) await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', Date.now() + time);
		}
		else if (!isNaN(time) && args[1]) {
			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}.`);

			// Send mute message to target
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args[1]}**` })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}`);

			// Set member data for unmute time
			if (role) await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', Date.now() + time);
		}
		else if (args[1]) {
			// Timeout feature can't mute someone forever
			if (srvconfig.mutecmd == 'timeout') return message.reply({ content: 'You cannot mute someone forever with the timeout feature turned on!' });

			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} forever.`)
				.addField('Reason', args.slice(1).join(' '));

			// Send mute message to target
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args.slice(1).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args.slice(1).join(' ')} forever`);
		}
		else {
			// Timeout feature can't mute someone forever
			if (srvconfig.mutecmd == 'timeout') return message.reply({ content: 'You cannot mute someone forever with the timeout feature turned on!' });

			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} forever.`);
			await user.send({ content: `**You've been muted on ${message.guild.name} forever.**` })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} forever`);
		}

		// Actually mute the dude (add role)
		if (role) await member.roles.add(role);
		else await member.timeout(time, `Muted by ${message.member.user.tag} for ${args.slice(1).join(' ')}`);

		// Reply to command
		message.reply({ embeds: [Embed] });

		// Check if log channel exists and send message
		const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
		if (logchannel) {
			Embed.setTitle(`${message.member.user.tag} ${Embed.title}`);
			logchannel.send({ embeds: [Embed] });
		}
	},
};
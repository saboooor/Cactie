const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'mute',
	description: 'Mute someone in the server',
	args: true,
	usage: '<User> [Time and/or Reason]',
	permissions: 'MANAGE_MESSAGES',
	botperms: 'MANAGE_ROLES',
	cooldown: 5,
	guildOnly: true,
	options: require('../options/punish.json'),
	async execute(message, args, client) {
		// Check if mute role is set and mute command is enabled
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.mutecmd == 'false') return message.reply({ content: 'This command is disabled!' });
		if (srvconfig.muterole == 'Not Set') return message.reply({ content: 'Please set a mute role with -settings muterole <Role Id>! Make sure the role is above every other role and Pup\'s role is above the mute role, or else it won\'t work!' });

		// Get user and check if user is valid
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User! Are they in this server?' });

		// Get member and author and check if role is lower than member's role
		const member = message.guild.members.cache.get(user.id);
		const author = message.member;
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });

		// Get mute role and check if role is valid
		const role = await message.guild.roles.cache.get(srvconfig.muterole);
		if (!role) return message.reply({ content: 'Invalid Role! Re-set the mute role in -settings' });

		// Check if user is muted
		if (member.roles.cache.has(role.id)) return message.reply({ content: 'This user is already muted! Try unmuting instead.' });

		// Check if duration is set and if it's more than a year
		const time = ms(args[1] ? args[1] : 'perm');
		if (time > 31536000000) return message.reply({ content: 'You cannot mute someone for more than 1 year!' });

		// Create embed and check if duration / reason are set and do stuff
		const Embed = new MessageEmbed().setColor(Math.round(Math.random() * 16777215));
		if (!isNaN(time) && args[2]) {
			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);

			// Set member data for unmute time
			await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', Date.now() + time);
		}
		else if (!isNaN(time) && args[1]) {
			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}.`);
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args[1]}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}`);

			// Set member data for unmute time
			await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', Date.now() + time);
		}
		else if (args[1]) {
			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} for ${args.slice(1).join(' ')}, forever`);
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args.slice(1).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args.slice(1).join(' ')} forever`);
		}
		else {
			// Set embed title and send mute message to user
			Embed.setTitle(`Muted ${user.tag} forever.`);
			await user.send({ content: `**You've been muted on ${message.guild.name} forever.**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} forever`);
		}

		// Actually mute the dude (add role)
		await member.roles.add(role);

		// Reply to command
		message.reply({ embeds: [Embed], ephemeral: true });
	},
};
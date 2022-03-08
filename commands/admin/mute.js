const { Embed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'mute',
	description: 'Mute someone in the server',
	ephemeral: true,
	args: true,
	usage: '<User> [Time and/or Reason]',
	permission: 'ManageMessages',
	botperm: 'ManageRoles',
	cooldown: 5,
	options: require('../options/punish.json'),
	async execute(message, args, client) {
		try {
			// Get mute role and check if role is valid
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const role = await message.guild.roles.cache.get(srvconfig.mutecmd);
			if (!role && srvconfig.mutecmd != 'timeout') return message.reply({ content: 'This command is disabled!' });

			// Get user and check if user is valid
			const user = client.users.cache.get(args[0].replace(/\D/g, ''));
			if (!user) return message.reply({ content: 'Invalid User! Are they in this server?' });

			// Get member and author and check if role is lower than member's role
			const member = message.guild.members.cache.get(user.id);
			const author = message.member;
			if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) return message.reply({ content: `You can't do that! Your role is ${member.roles.highest.rawPosition - author.roles.highest.rawPosition} lower than the user's role!` });

			// Check if user is muted
			if (role && member.roles.cache.has(role.id)) return message.reply({ content: 'This user is already muted! Try unmuting instead.' });

			// Check if duration is set and if it's more than a year
			const time = ms(args[1] ? args[1] : 'perm');
			if (role && time > 31536000000) return message.reply({ content: 'You cannot mute someone for more than 1 year!' });

			// Timeout feature can't mute someone for more than 30 days
			else if (time > 2592000000) return message.reply({ content: 'You cannot mute someone for more than 30 days with the timeout feature turned on!' });
			if (isNaN(time) && srvconfig.mutecmd == 'timeout') return message.reply({ content: 'You cannot mute someone forever with the timeout feature turned on!' });

			// Create embed and check if duration / reason are set and do stuff
			const MuteEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Muted ${user.tag} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.`);

			// Add reason if specified
			const reason = args.slice(!isNaN(time) ? 2 : 1).join(' ');
			if (reason) MuteEmbed.addFields({ name: 'Reason', value: reason });

			// Send mute message to target
			await user.send({ content: `**You've been muted in ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
				});
			client.logger.info(`Muted user: ${user.tag} in ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

			// Set member data for unmute time if set
			if (!isNaN(time) && role) await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', Date.now() + time);

			// Actually mute the dude (add role)
			if (role) await member.roles.add(role);
			else await member.timeout(time, `Muted by ${message.member.user.tag} for ${args.slice(1).join(' ')}`);

			// Reply to command
			message.reply({ embeds: [MuteEmbed] });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				MuteEmbed.setTitle(`${message.member.user.tag} ${MuteEmbed.title}`);
				logchannel.send({ embeds: [MuteEmbed] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};
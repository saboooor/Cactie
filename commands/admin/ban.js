const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'ban',
	description: 'Ban someone from the server',
	ephemeral: true,
	args: true,
	usage: '<User> [Time and/or Reason]',
	permission: 'BAN_MEMBERS',
	botperm: 'BAN_MEMBERS',
	cooldown: 5,
	options: require('../options/punish.json'),
	async execute(message, args, client) {
		// Get user and check if user is valid
		const member = message.guild.members.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!member) return message.reply({ content: 'Invalid User! Are they in this server?' });
		const user = member.user;

		// Get member and author and check if role is lower than member's role
		const author = message.member;
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });

		// Get amount of time to ban, if not specified, then permanent
		const time = ms(args[1] ? args[1] : 'perm');
		if (time > 31536000000) return message.reply({ content: 'You cannot ban someone for more than 1 year!' });

		// Create embed and check if bqn has a reason / time period
		const Embed = new MessageEmbed().setColor(Math.round(Math.random() * 16777215));

		// Set embed title
		Embed.setTitle(`Banned ${user.tag} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.`);

		// Add reason if specified
		const reason = args.slice(!isNaN(time) ? 2 : 1).join(' ');
		if (reason) Embed.addField('Reason', reason);

		// Send ban message to target
		await user.send({ content: `**You've been banned from ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
			.catch(e => {
				client.logger.warn(e);
				message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
			});
		client.logger.info(`Banned user: ${user.tag} from ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

		// Set unban timestamp to member data for auto-unban
		if (!isNaN(time)) await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'bannedUntil', Date.now() + time);

		// Actually ban the dude
		await member.ban({ reason: `${author.user.tag} banned user: ${user.tag} from ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}` });

		// Reply with response
		message.reply({ embeds: [Embed] });

		// Check if log channel exists and send message
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
		if (logchannel) {
			Embed.setTitle(`${message.member.user.tag} ${Embed.title}`);
			logchannel.send({ embeds: [Embed] });
		}
	},
};
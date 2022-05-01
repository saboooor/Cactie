const { EmbedBuilder } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'ban',
	description: 'Ban someone from the server',
	ephemeral: true,
	args: true,
	usage: '<User> [Time and/or Reason]',
	permission: 'BanMembers',
	botperm: 'BanMembers',
	cooldown: 5,
	options: require('../../options/punish.js'),
	async execute(message, args, client, lang) {
		try {
			// Get user and check if user is valid
			let member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) member = await message.guild.members.fetch(args[0].replace(/\D/g, ''));
			if (!member) return client.error(lang.invalidmember, message, true);
			const user = member.user;

			// Get member and author and check if role is lower than member's role
			const author = message.member;
			if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) return client.error(`You can't do that! Your role is ${member.roles.highest.rawPosition - author.roles.highest.rawPosition} lower than the user's role!`, message, true);

			// Get amount of time to ban, if not specified, then permanent
			const time = ms(args[1] ? args[1] : 'perm');
			if (time > 31536000000) return client.error('You cannot ban someone for more than 1 year!', message, true);

			// Create embed and check if bqn has a reason / time period
			const BanEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Banned ${user.tag} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.`);

			// Add reason if specified
			const reason = args.slice(!isNaN(time) ? 2 : 1).join(' ');
			if (reason) BanEmbed.addFields([{ name: 'Reason', value: reason }]);

			// Send ban message to target
			await user.send({ content: `**You've been banned from ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
				.catch(err => {
					client.logger.warn(err);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
				});
			client.logger.info(`Banned user: ${user.tag} from ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

			// Set unban timestamp to member data for auto-unban
			if (!isNaN(time)) await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'bannedUntil', Date.now() + time);

			// Actually ban the dude
			await member.ban({ reason: `${author.user.tag} banned user: ${user.tag} from ${message.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}` });

			// Reply with response
			await message.reply({ embeds: [BanEmbed] });

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				BanEmbed.setTitle(`${message.member.user.tag} ${BanEmbed.toJSON().title}`);
				logchannel.send({ embeds: [BanEmbed] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};
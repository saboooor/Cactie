const { Embed } = require('discord.js');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'unmute',
	description: 'Unmute someone that was muted in the server',
	ephemeral: true,
	args: true,
	usage: '<User>',
	permission: 'ManageMessages',
	botperm: 'ManageRoles',
	cooldown: 5,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		try {
			// Get settings and check if mutecmd is enabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const role = await message.guild.roles.cache.get(srvconfig.mutecmd);
			if (!role && srvconfig.mutecmd != 'timeout') return client.error('This command is disabled!', message, true);

			// Get user and check if user is valid
			const member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return client.error(msg.invalidmember, message, true);

			// Check if user is unmuted
			if (role && !member.roles.cache.has(role.id)) return client.error('This user is not muted!', message, true);

			// Reset the mute timer
			if (role) await client.setData('memberdata', 'memberId', `${member.id}-${message.guild.id}`, 'mutedUntil', 0);

			// Send unmute message to user
			await member.send({ content: '**You\'ve been unmuted**' })
				.catch(e => {
					client.logger.warn(e);
					message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been unmuted.' });
				});

			// Actually get rid of the mute role or untimeout
			if (role) await member.roles.remove(role);
			else await member.timeout(0);

			// Create embed with color and title
			const UnmuteEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Unmuted ${member.user.tag}`);

			// Reply with unban log
			message.reply({ embeds: [UnmuteEmbed] });
			client.logger.info(`Unmuted ${member.user.tag} in ${message.guild.name}`);

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				UnmuteEmbed.setTitle(`${message.member.user.tag} ${UnmuteEmbed.title}`);
				logchannel.send({ embeds: [UnmuteEmbed] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};
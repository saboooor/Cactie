const { schedule } = require('node-cron');
const { EmbedBuilder } = require('discord.js');

module.exports = async (client) => {
	schedule('* * * * *', async () => {
		const memberdata = await client.query('SELECT * FROM `memberdata`');
		memberdata.forEach(async data => {
			if (!data.memberId.split('-')[1]) return;
			if (data.mutedUntil < Date.now() && data.mutedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				if (!guild) return client.setData('memberdata', 'memberId', data.memberId, 'mutedUntil', 0);
				const userId = data.memberId.split('-')[0];
				let member = await guild.members.cache.get(userId);
				if (!member) member = await guild.members.fetch(userId);
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				const role = await guild.roles.cache.get(srvconfig.mutecmd);
				if (member && role) {
					member.send({ content: '**You have been unmuted**' }).catch(err => logger.warn(err));
					await member.roles.remove(role);
				}
				await client.setData('memberdata', 'memberId', data.memberId, 'mutedUntil', 0);
				logger.info(`Unmuted ${member ? member.user.tag : userId} in ${guild.name}`);

				// Check if log channel exists and send message
				const logchannel = guild.channels.cache.get(srvconfig.logchannel);
				if (logchannel) {
					const UnmuteEmbed = new EmbedBuilder().setTitle(`${member ? member.user.tag : userId} has been unmuted`);
					logchannel.send({ embeds: [UnmuteEmbed] });
				}
			}
			else if (data.bannedUntil < Date.now() && data.bannedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				if (!guild) return client.setData('memberdata', 'memberId', data.memberId, 'bannedUntil', 0);
				const userId = data.memberId.split('-')[0];
				const user = await guild.members.cache.get(userId);
				if (user) user.send({ content: `**You've been unbanned in ${guild.name}**` }).catch(err => logger.warn(err));
				await client.setData('memberdata', 'memberId', data.memberId, 'bannedUntil', 0);
				logger.info(`Unbanned ${user ? user.tag : userId} in ${guild.name}`);
				await guild.members.unban(userId).catch(err => logger.error(err));

				// Check if log channel exists and send message
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				const logchannel = guild.channels.cache.get(srvconfig.logchannel);
				if (logchannel) {
					const UnbanEmbed = new EmbedBuilder().setTitle(`${user ? user.tag : userId} has been unbanned`);
					logchannel.send({ embeds: [UnbanEmbed] });
				}
			}
			else if (data.mutedUntil == 0 && data.bannedUntil == 0) {
				client.delData('memberdata', 'memberId', data.memberId);
			}
		});
	});
};
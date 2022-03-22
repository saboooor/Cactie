const { EmbedBuilder, ApplicationCommandType, ActivityType } = require('discord.js');
const { warn } = require('../lang/int/emoji.json');
module.exports = async (client) => {
	client.logger.info('Bot started!');
	client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: ActivityType.Game }], status: 'dnd' });
	if (!client.application?.owner) await client.application?.fetch();
	const commands = await client.application?.commands.fetch();
	await client.slashcommands.forEach(async command => {
		const sourcecmd = commands.find(c => c.name == command.name);
		const opt = sourcecmd && command.options && `${JSON.stringify(sourcecmd.options)}` == `${JSON.stringify(command.options)}`;
		if ((opt || opt === undefined) && sourcecmd && command.description && sourcecmd.description == command.description) return;
		if (sourcecmd && command.type) return;
		client.logger.info(`Detected /${command.name} has some changes! Overwriting command...`);
		await client.application?.commands.create({
			name: command.name,
			type: command.type ? ApplicationCommandType[command.type] : ApplicationCommandType.ChatInput,
			description: command.description,
			options: command.options,
		});
	});
	await commands.forEach(async command => {
		if (client.slashcommands.find(c => c.name == command.name)) return;
		client.logger.info(`Detected /${command.name} has been deleted! Deleting command...`);
		await command.delete();
	});
	setInterval(async () => {
		const activities = [
			['Game', 'with you ;)'],
			['Game', '/help'],
			['Watching', 'cactie.smhsmh.club'],
			['Competing', `Getting more than ${client.guilds.cache.size} servers!`],
			['Competing', `${client.guilds.cache.size} servers!`],
			['Listening', '3 Big Balls'],
			['Listening', 'Never Gonna Give You Up'],
			['Listening', 'Fortnite Battle Pass'],
		];
		const i = Math.floor(Math.random() * activities.length);
		const activity = activities[i];
		client.user.setPresence({ activities: [{ name: activity[1], type: ActivityType[activity[0]] }] });
	}, 5000);
	setInterval(async () => {
		await client.manager.players.forEach(async player => {
			if (player.timeout && player.timeout < Date.now()) {
				client.logger.info(player.timeout);
				if (!player.voiceChannel) return;
				const AlertEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setDescription(`<:alert:${warn}> **Left because of 5 minutes of inactivity!**`)
					.addFields({ name: 'Tired of me leaving?', value: 'Enable the **24/7** mode with the /247 command!' })
					.setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });
				const guild = client.guilds.cache.get(player.guild);
				const channel = guild.channels.cache.get(player.textChannel);
				const LeaveMsg = await channel.send({ embeds: [AlertEmbed] });
				player.setNowplayingMessage(LeaveMsg);
				client.logger.info(`Destroyed player in ${guild.name} because of queue end`);
				player.destroy();
			}
		});
		const memberdata = await client.query('SELECT * FROM `memberdata`');
		memberdata.forEach(async data => {
			if (!data.memberId.split('-')[1]) return;
			if (data.mutedUntil < Date.now() && data.mutedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				if (!guild) return client.setData('memberdata', 'memberId', data.memberId, 'mutedUntil', 0);
				const userId = data.memberId.split('-')[0];
				let member = await message.guild.members.cache.get(user.id);
				if (!member) member = await message.guild.members.fetch(user.id);
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				const role = await guild.roles.cache.get(srvconfig.mutecmd);
				if (member && role) {
					member.send({ content: '**You have been unmuted**' }).catch(err => client.logger.warn(err));
					await member.roles.remove(role);
				}
				await client.setData('memberdata', 'memberId', data.memberId, 'mutedUntil', 0);
				client.logger.info(`Unmuted ${member ? member.user.tag : userId} in ${guild.name}`);

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
				if (user) user.send({ content: `**You've been unbanned in ${guild.name}**` }).catch(err => client.logger.warn(err));
				await client.setData('memberdata', 'memberId', data.memberId, 'bannedUntil', 0);
				client.logger.info(`Unbanned ${user ? user.tag : userId} in ${guild.name}`);
				await guild.members.unban(userId).catch(err => client.logger.error(err));

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
	}, 10000);
	client.manager.init(client.user.id);
	const timer = (Date.now() - client.startTimestamp) / 1000;
	client.logger.info(`Done (${timer}s)! I am running!`);
};
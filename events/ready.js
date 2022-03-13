const { EmbedBuilder, ApplicationCommandType, ActivityType } = require('discord.js');
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
			['Game', 'With you ;)'],
			['Game', '/help'],
			['Watching', 'pup.smhsmh.club'],
			['Competing', `Getting more than ${client.guilds.cache.size} servers!`],
			['Competing', `${client.guilds.cache.size} servers!`],
			['Listening', '3 Big Balls'],
			['Listening', 'Never Gonna Give You Up'],
			['Listening', 'Fortnite Battle Pass'],
			['Game', 'in {GUILD}'],
			['Competing', '{GUILD}'],
			['Watching', '{GUILD}'],
		];
		const i = Math.floor(Math.random() * activities.length);
		const activity = activities[i];
		if (activity[1].includes('{GUILD}')) activity[1] = activity[1].replace('{GUILD}', client.guilds.cache.get([...client.guilds.cache.keys()][Math.floor(Math.random() * client.guilds.cache.size)]).name);
		client.user.setPresence({ activities: [{ name: activity[1], type: ActivityType[activity[0]] }] });
	}, 5000);
	setInterval(async () => {
		const memberdata = await client.query('SELECT * FROM `memberdata`');
		memberdata.forEach(async data => {
			if (data.mutedUntil < Date.now() && data.mutedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				const userId = data.memberId.split('-')[0];
				const member = await guild.members.cache.get(userId);
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				const role = await guild.roles.cache.get(srvconfig.mutecmd);
				if (member && role) {
					member.send({ content: '**You have been unmuted**' }).catch(e => { client.logger.warn(e); });
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
				const userId = data.memberId.split('-')[0];
				const user = await guild.members.cache.get(userId);
				if (user) user.send({ content: `**You've been unbanned in ${guild.name}**` }).catch(e => { client.logger.warn(e); });
				await client.setData('memberdata', 'memberId', data.memberId, 'bannedUntil', 0);
				client.logger.info(`Unbanned ${user ? user.tag : userId} in ${guild.name}`);
				await guild.members.unban(userId).catch(e => client.logger.error(e));

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